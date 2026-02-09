import { InvoiceDTO } from "../requestDTOs/InvoiceDTO";

export interface WorkspaceInvoicesResponseDTO {
    workspaceId: string;
    invoices: InvoiceDTO[];
}