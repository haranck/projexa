export interface InvoiceDTO {
    invoiceId: string;
    amount: number;
    currency: string;
    status: string | null;
    date: Date;
    hostedInvoiceUrl: string | null;
    pdfUrl: string | null;
}
