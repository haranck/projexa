import { injectable, inject } from "tsyringe";
import { IGetAdminDashboardStatsUseCase } from "../../interface/admin/IGetAdminDashboardStatsUseCase";
import { AdminDashboardStatsDTO } from "../../dtos/admin/requestDTOs/AdminDashboardStatsDTO";
import { IStripeService } from "../../../domain/interfaces/services/IStripeService";
import { UserModel } from "../../../infrastructure/database/mongo/models/UserModel";
import { WorkspaceModel } from "../../../infrastructure/database/mongo/models/WorkspaceModel";
import { SubscriptionModel } from "../../../infrastructure/database/mongo/models/SubscriptionModel";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getLast6Months(): { label: string; year: number; month: number }[] {
    const now = new Date();
    const result = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        result.push({ label: MONTH_NAMES[d.getMonth()], year: d.getFullYear(), month: d.getMonth() });
    }
    return result;
}

@injectable()
export class GetAdminDashboardStatsUseCase implements IGetAdminDashboardStatsUseCase {
    private static cache: { data: AdminDashboardStatsDTO; timestamp: number } | null = null;
    private static CACHE_TTL = 5 * 60 * 1000;

    constructor(
        @inject('IStripeService') private readonly stripeService: IStripeService,
    ) { }

    async execute(): Promise<AdminDashboardStatsDTO> {
    
        const nowTime = Date.now();
        if (GetAdminDashboardStatsUseCase.cache && (nowTime - GetAdminDashboardStatsUseCase.cache.timestamp < GetAdminDashboardStatsUseCase.CACHE_TTL)) {
            return GetAdminDashboardStatsUseCase.cache.data;
        }

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        const last6Months = getLast6Months();
        const stripeStartTimestamp = Math.floor(sixMonthsAgo.getTime() / 1000);

        const [userStats, workspaceStats, activeSubscriptions, allInvoices, subscriptionsWithPlan] = await Promise.all([
            UserModel.aggregate([
                {
                    $facet: {
                        totalUsers: [{ $count: "count" }],
                        newUsersThisMonth: [
                            { $match: { createdAt: { $gte: startOfMonth } } },
                            { $count: "count" }
                        ],
                        growth: [
                            { $match: { createdAt: { $gte: sixMonthsAgo } } },
                            {
                                $group: {
                                    _id: { 
                                        month: { $month: "$createdAt" }, 
                                        year: { $year: "$createdAt" } 
                                    },
                                    users: { $sum: 1 }
                                }
                            }
                        ]
                    }
                }
            ]),
            WorkspaceModel.aggregate([
                {
                    $facet: {
                        totalWorkspaces: [{ $count: "count" }],
                        newWorkspacesThisMonth: [
                            { $match: { createdAt: { $gte: startOfMonth } } },
                            { $count: "count" }
                        ],
                        topWorkspaces: [
                            { $addFields: { memberCount: { $size: { $ifNull: ["$members", []] } } } },
                            { $sort: { memberCount: -1 } },
                            { $limit: 5 },
                            { $project: { name: 1, members: { $size: { $ifNull: ["$members", []] } }, plan: { $literal: "Active" } } }
                        ]
                    }
                }
            ]),
            SubscriptionModel.countDocuments({ status: 'active' }),
            this.stripeService.getPaidInvoices(stripeStartTimestamp),
            SubscriptionModel.find({ stripeCustomerId: { $exists: true } })
                .select('stripeCustomerId planId status')
                .populate<{ planId: { name?: string } | null }>('planId', 'name')
                .sort({ updatedAt: -1 })
                .lean()
        ]);

        const totalUsers = userStats[0].totalUsers[0]?.count || 0;
        const newUsersThisMonth = userStats[0].newUsersThisMonth[0]?.count || 0;
        const totalWorkspaces = workspaceStats[0].totalWorkspaces[0]?.count || 0;
        const newWorkspacesThisMonth = workspaceStats[0].newWorkspacesThisMonth[0]?.count || 0;
        const topWorkspaces = workspaceStats[0].topWorkspaces;

        const userGrowthByMonth = last6Months.map(({ label, year, month }) => {
            const match = userStats[0].growth.find((g: { _id: { month: number; year: number }; users: number }) => 
                g._id.month === (month + 1) && g._id.year === year
            );
            return { month: label, users: match?.users || 0 };
        });

        const totalRevenue = allInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
        const revenueThisMonth = allInvoices
            .filter(inv => new Date(inv.paidAt) >= startOfMonth)
            .reduce((sum, inv) => sum + (inv.amount || 0), 0);

        const revenueByMonth = last6Months.map(({ label, year, month }) => {
            const monthStart = new Date(year, month, 1);
            const monthEnd = new Date(year, month + 1, 1);
            const revenue = allInvoices
                .filter(inv => {
                    const d = new Date(inv.paidAt);
                    return d >= monthStart && d < monthEnd;
                })
                .reduce((sum, inv) => sum + (inv.amount || 0), 0);
            return { month: label, revenue };
        });

        const customerPlanMap: Record<string, string> = {};
        for (const sub of (subscriptionsWithPlan as unknown as { stripeCustomerId: string; status: string; planId: { name?: string } }[])) {
            if (sub.stripeCustomerId && sub.planId?.name) {
                // If we already have an active plan for this customer, don't overwrite it with a cancelled one
                if (customerPlanMap[sub.stripeCustomerId] && sub.status !== 'active') {
                    continue;
                }
                customerPlanMap[sub.stripeCustomerId] = sub.planId.name;
            }
        }

        const planRevenueMap: Record<string, { revenue: number; subscriptions: number }> = {};
        for (const inv of allInvoices) {
            if (inv.stripeCustomerId) {
                const planName = customerPlanMap[inv.stripeCustomerId] || "Unknown";
                if (!planRevenueMap[planName]) {
                    planRevenueMap[planName] = { revenue: 0, subscriptions: 0 };
                }
                planRevenueMap[planName].revenue += inv.amount || 0;
            }
        }

        // Count active subscriptions per plan separately for accuracy
        for (const sub of (subscriptionsWithPlan as unknown as { stripeCustomerId: string; status: string; planId: { name?: string } }[])) {
            if (sub.status === 'active' && sub.planId?.name) {
                const planName = sub.planId.name;
                if (!planRevenueMap[planName]) {
                    planRevenueMap[planName] = { revenue: 0, subscriptions: 0 };
                }
                planRevenueMap[planName].subscriptions += 1;
            }
        }

        const revenueByPlan = Object.entries(planRevenueMap).map(([plan, data]) => ({
            plan,
            revenue: data.revenue,
            subscriptions: data.subscriptions
        })).filter(p => p.revenue > 0 || p.subscriptions > 0);

        const result = {
            totalUsers,
            newUsersThisMonth,
            totalWorkspaces,
            newWorkspacesThisMonth,
            totalRevenue,
            revenueThisMonth,
            activeSubscriptions,
            revenueByMonth,
            userGrowthByMonth,
            revenueByPlan,
            topWorkspaces
        };

        GetAdminDashboardStatsUseCase.cache = { data: result, timestamp: Date.now() };

        return result;
    }
}
