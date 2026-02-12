import { injectable, inject } from "tsyringe";
import { GetAdminPaymentsDTO } from "../../dtos/admin/requestDTOs/GetAdminPaymentsDTO";
import { GetAdminPaymentsResponseDTO } from "../../dtos/admin/responseDTOs/AdminPaymentResponseDTO";
import { IGetAdminPaymentsUseCase } from "../../interface/admin/IGetAdminPaymentsUseCase";
import { IWorkspaceRepository } from "../../../domain/interfaces/repositories/IWorkspaceRepository";
import { IStripeService } from "../../../domain/interfaces/services/IStripeService";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { ISubscriptionRepository } from "../../../domain/interfaces/repositories/ISubscriptionRepository";

@injectable()
export class GetAdminPaymentsUseCase implements IGetAdminPaymentsUseCase {
    constructor(
        @inject('IWorkspaceRepository') private readonly workspaceRepo: IWorkspaceRepository,
        @inject('IStripeService') private readonly stripeService: IStripeService,
        @inject('IUserRepository') private readonly userRepo: IUserRepository,
        @inject('ISubscriptionRepository') private readonly subscriptionRepo: ISubscriptionRepository
    ) { }

    async execute(params: GetAdminPaymentsDTO): Promise<GetAdminPaymentsResponseDTO> {
        const start = params.startDate ? Math.floor(new Date(params.startDate).getTime() / 1000) : undefined;
        const end = params.endDate ? Math.floor(new Date(params.endDate).getTime() / 1000) : undefined;

        const invoices = await this.stripeService.getPaidInvoices(start, end);

        const enrichedInvoices = await Promise.all(invoices.map(async (invoice) => {
            if (invoice.stripeCustomerId) {
                try {
                    const subscription = await this.subscriptionRepo.findByStripeCustomerId(invoice.stripeCustomerId);
                    if (subscription && subscription.workspaceId) {
                        const workspace = await this.workspaceRepo.getWorkspaceById(subscription.workspaceId.toString());
                        if (workspace) {
                            invoice.workspaceName = workspace.name;
                        }
                    }
                } catch {
                    // SILENCE: Workspace or subscription might not exist for old Stripe test data
                }
            }
            return invoice;
        }));

        // Apply search filter if search parameter is provided
        let filteredInvoices = enrichedInvoices;
        if (params.search && params.search.trim() !== "" && params.search !== "undefined") {
            const searchTerm = params.search.toLowerCase();
            filteredInvoices = enrichedInvoices.filter(invoice =>
                invoice.userName.toLowerCase().includes(searchTerm) ||
                invoice.workspaceName.toLowerCase().includes(searchTerm) ||
                invoice.invoiceId.toLowerCase().includes(searchTerm)
            );
        }

        filteredInvoices.sort((a, b) => b.paidAt.getTime() - a.paidAt.getTime());
        const page = params.page || 1;
        const limit = params.limit || 5;
        const totalDocs = filteredInvoices.length;
        const totalPages = Math.ceil(totalDocs / limit);
        const startIndex = (page - 1) * limit;
        const paginatedData = filteredInvoices.slice(startIndex, startIndex + limit);

        return {
            data: paginatedData,
            meta: {
                totalDocs,
                totalPages,
                page,
                limit
            }
        };
    }
}

