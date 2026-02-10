import { injectable, inject } from "tsyringe";
import { GetAdminPaymentsDTO } from "../../dtos/admin/requestDTOs/GetAdminPaymentsDTO";
import { AdminPaymentResponseDTO } from "../../dtos/admin/responseDTOs/AdminPaymentResponseDTO";
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

    async execute(params: GetAdminPaymentsDTO): Promise<AdminPaymentResponseDTO[]> {
        const start = params.startDate ? new Date(params.startDate).getTime() / 1000 : undefined;
        const end = params.endDate ? new Date(params.endDate).getTime() / 1000 : undefined;

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

        return enrichedInvoices;
    }
}

