import Stripe from 'stripe'
import { InvoiceDTO } from '../dtos/user/requestDTOs/InvoiceDTO'

export class BillingMapper {
    static toInvoiceDTO(invoice: Stripe.Invoice): InvoiceDTO {
        return {
            invoiceId: invoice.id,
            amount: (invoice.total ?? 0) / 100,
            currency: invoice.currency,
            status: invoice.status ?? "unknown",
            date: new Date(invoice.created * 1000),
            hostedInvoiceUrl: invoice.hosted_invoice_url || '',
            pdfUrl: invoice.invoice_pdf || '',
        }
    }
}
