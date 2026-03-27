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
    constructor(
        @inject('IStripeService') private readonly stripeService: IStripeService,
    ) { }

    async execute(): Promise<AdminDashboardStatsDTO> {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const last6Months = getLast6Months();

        const [totalUsers, newUsersThisMonth] = await Promise.all([
            UserModel.countDocuments(),
            UserModel.countDocuments({ createdAt: { $gte: startOfMonth } })
        ]);

        const [totalWorkspaces, newWorkspacesThisMonth] = await Promise.all([
            WorkspaceModel.countDocuments(),
            WorkspaceModel.countDocuments({ createdAt: { $gte: startOfMonth } })
        ]);
        const activeSubscriptions = await SubscriptionModel.countDocuments({ status: 'active' });

        const allInvoices = await this.stripeService.getPaidInvoices();
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

        const userGrowthByMonth = await Promise.all(
            last6Months.map(async ({ label, year, month }) => {
                const monthStart = new Date(year, month, 1);
                const monthEnd = new Date(year, month + 1, 1);
                const users = await UserModel.countDocuments({
                    createdAt: { $gte: monthStart, $lt: monthEnd }
                });
                return { month: label, users };
            })
        );

        interface SubscriptionWithPlan {
            planId: { name?: string } | null;
            stripeCustomerId?: string;
        }
        const subscriptionsWithPlan = await SubscriptionModel.find()
            .populate<{ planId: { name?: string } | null }>('planId', 'name')
            .lean<SubscriptionWithPlan[]>();

        const customerPlanMap: Record<string, string> = {};
        for (const sub of subscriptionsWithPlan) {
            if (sub.stripeCustomerId) {
                customerPlanMap[sub.stripeCustomerId] = sub.planId?.name || "Unknown";
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
                planRevenueMap[planName].subscriptions += 1;
            }
        }

        const revenueByPlan = Object.entries(planRevenueMap).map(([plan, data]) => ({
            plan,
            revenue: data.revenue,
            subscriptions: data.subscriptions
        }));

        const workspaces = await WorkspaceModel.find().lean().limit(20);
        const topWorkspaces = workspaces
            .sort((a, b) => (b.members?.length || 0) - (a.members?.length || 0))
            .slice(0, 5)
            .map(ws => ({
                name: ws.name,
                members: ws.members?.length || 0,
                plan: "Active"
            }));

        return {
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
    }
}
