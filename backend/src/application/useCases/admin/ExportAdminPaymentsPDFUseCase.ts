import { inject, injectable } from "tsyringe";
import { IStripeService } from "../../../domain/interfaces/services/IStripeService";
import { IWorkspaceRepository } from "../../../domain/interfaces/repositories/IWorkspaceRepository";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { ISubscriptionRepository } from "../../../domain/interfaces/repositories/ISubscriptionRepository";
import { PDFService } from "../../../infrastructure/services/PDFService";
import { IExportAdminPaymentsPDFUseCase } from "../../interface/admin/IExportAdminPaymentsPDFUseCase";

@injectable()
export class ExportAdminPaymentsPDFUseCase implements IExportAdminPaymentsPDFUseCase {
    constructor(
        @inject('IStripeService') private stripeService: IStripeService,
        @inject('IWorkspaceRepository') private workspaceRepository: IWorkspaceRepository,
        @inject('IUserRepository') private userRepository: IUserRepository,
        @inject('ISubscriptionRepository') private subscriptionRepository: ISubscriptionRepository,
        @inject('PDFService') private pdfService: PDFService
    ) { }

    async execute(params: { startDate?: string; endDate?: string; search?: string; }): Promise<Buffer> {

        const start = params.startDate ? Math.floor(new Date(params.startDate).getTime() / 1000) : undefined;
        const end = params.endDate ? Math.floor(new Date(params.endDate).getTime() / 1000) : undefined;

        const invoices = await this.stripeService.getPaidInvoices(start, end);

        const enrichedInvoices = await Promise.all(invoices.map(async (invoice) => {
            try {
                if (invoice.stripeCustomerId) {
                    const subscription = await this.subscriptionRepository.findByStripeCustomerId(invoice.stripeCustomerId);
                    if (subscription) {
                        const workspace = await this.workspaceRepository.getWorkspaceById(String(subscription.workspaceId));
                        if (workspace) {
                            invoice.workspaceName = workspace.name;
                            const user = await this.userRepository.findById(String(workspace.ownerId));
                            if (user) {
                                invoice.userName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
                            }
                        }
                    }
                }
            } catch {
                // Silently handle errors for legacy data or missing records
            }
            return invoice;
        }));

        let filteredInvoices = enrichedInvoices;
        if (params.search && params.search.trim() !== "" && params.search !== "undefined") {
            const searchTerm = params.search.toLowerCase();
            filteredInvoices = enrichedInvoices.filter(invoice =>
                (invoice.userName && invoice.userName.toLowerCase().includes(searchTerm)) ||
                (invoice.workspaceName && invoice.workspaceName.toLowerCase().includes(searchTerm)) ||
                (invoice.invoiceId && invoice.invoiceId.toLowerCase().includes(searchTerm))
            );
        }

        filteredInvoices.sort((a, b) => b.paidAt.getTime() - a.paidAt.getTime());

        const pdfBuffer = await this.pdfService.generateSalesReportPDF(filteredInvoices);
        return pdfBuffer;
    }
}
