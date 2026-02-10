import Stripe from "stripe";
import { injectable } from "tsyringe"
import { IStripeService } from "../../domain/interfaces/services/IStripeService";
import { env } from "../../config/envValidation";
import { CreateCheckoutSessionInputDTO } from "../../application/dtos/user/requestDTOs/CreateCheckoutSessionInputDTO";
import { WebhookEventInputDTO } from "../../application/dtos/user/requestDTOs/WebhookEventInputDTO";
import { GetSubscriptionInputDTO } from "../../application/dtos/user/requestDTOs/GetSubscriptionInputDTO";
import { UpdateSubscriptionInputDTO } from "../../application/dtos/user/requestDTOs/UpdateSubscriptonInputDTO";
import { SUBSCRIPTION_ERRORS } from "../../domain/constants/errorMessages";
import { InvoiceDTO } from "../../application/dtos/user/requestDTOs/InvoiceDTO";
import { BillingMapper } from "../../application/mappers/BillingMapper";
import { AdminPaymentResponseDTO } from "../../application/dtos/admin/responseDTOs/AdminPaymentResponseDTO";

@injectable()
export class StripeService implements IStripeService {
    private stripe: Stripe;

    constructor() {
        this.stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
            apiVersion: '2025-12-15.clover',
        });
    }
    async createCheckoutSession(params: CreateCheckoutSessionInputDTO): Promise<string> {
        const session = await this.stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            customer: params.customerId,
            customer_email: params.customerId ? undefined : params.customerEmail,
            line_items: [{
                price: params.priceId,
                quantity: 1
            }],
            metadata: params.metadata,
            success_url: params.successUrl,
            cancel_url: params.cancelUrl
        })
        return session.url!;
    }
    async constructWebhookEvent(params: WebhookEventInputDTO): Promise<Stripe.Event> {
        const event = this.stripe.webhooks.constructEvent(params.payload, params.signature, env.STRIPE_WEBHOOK_SECRET!);
        return event;
    }
    async getSubscription(params: GetSubscriptionInputDTO): Promise<Stripe.Subscription> {
        const subscription = await this.stripe.subscriptions.retrieve(params.subscriptionId);
        return subscription;
    }

    async createProductAndPrice(params: { name: string; amount: number; interval: 'month' | 'year' }): Promise<{ productId: string; priceId: string }> {
        const product = await this.stripe.products.create({
            name: params.name,
        });

        const price = await this.stripe.prices.create({
            product: product.id,
            unit_amount: params.amount * 100,
            currency: 'inr',
            recurring: {
                interval: params.interval,
            },
        });

        return {
            productId: product.id,
            priceId: price.id,
        };
    }
    async updateSubscriptionPlan(params: UpdateSubscriptionInputDTO): Promise<Stripe.Subscription> {
        const { stripeSubscriptionId, newPriceId } = params
        const subscription = await this.stripe.subscriptions.retrieve(stripeSubscriptionId)
        if (!subscription) throw new Error(SUBSCRIPTION_ERRORS.SUBSCRIPTION_NOT_FOUND)

        const updatedSub = await this.stripe.subscriptions.update(stripeSubscriptionId, {
            items: [
                {
                    id: subscription.items.data[0].id,
                    price: newPriceId
                }
            ],
            proration_behavior: 'always_invoice',
        })

        return updatedSub;
    }

    async getInvoicesByCustomer(customerId: string): Promise<InvoiceDTO[]> {
        const invoices = await this.stripe.invoices.list({
            customer: customerId,
            limit: 20,
        })
        return invoices.data.map(BillingMapper.toInvoiceDTO)
    }

    async getPaidInvoices(start?: number, end?: number, workspaceName?: string): Promise<AdminPaymentResponseDTO[]> {
        const invoices = await this.stripe.invoices.list({
            status: "paid",
            created: start && end ? { gte: start, lte: end } : undefined,
            limit: 20,
            expand: ['data.charge']
        });

        return invoices.data.map(invoice => {
            let paymentMethodResult: string = invoice.collection_method || "Unknown";

            const expandedInvoice = invoice as Stripe.Invoice & { charge?: string | Stripe.Charge | null };

            if (expandedInvoice.charge && typeof expandedInvoice.charge !== 'string') {
                const charge = expandedInvoice.charge as Stripe.Charge;
                if (charge.payment_method_details?.card) {
                    const card = charge.payment_method_details.card;
                    const brand = card.brand ? card.brand.toUpperCase() : "CARD";
                    paymentMethodResult = `${brand} **** ${card.last4}`;
                } else if (charge.payment_method_details?.type) {
                    paymentMethodResult = charge.payment_method_details.type;
                }
            }

            return {
                invoiceId: invoice.id,
                userName: invoice.customer_name || "Unknown",
                workspaceName: workspaceName || "Unknown",
                amount: (invoice.total ?? 0) / 100,
                currency: invoice.currency,
                status: invoice.status ?? "unknown",
                paymentMethod: paymentMethodResult,
                paidAt: new Date(invoice.status_transitions.paid_at ? invoice.status_transitions.paid_at * 1000 : Date.now()),
                stripeCustomerId: invoice.customer as string
            };
        });
    }

}