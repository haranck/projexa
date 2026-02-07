export interface Invoice {
    invoiceId: string;
    date: string | Date;
    status: string;
    amount: number;
    currency: string;
    hostedInvoiceUrl: string;
}