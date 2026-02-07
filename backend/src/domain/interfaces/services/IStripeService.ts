import Stripe from "stripe";
import { CreateCheckoutSessionInputDTO } from "../../../application/dtos/user/requestDTOs/CreateCheckoutSessionInputDTO";
import { WebhookEventInputDTO } from "../../../application/dtos/user/requestDTOs/WebhookEventInputDTO";
import { GetSubscriptionInputDTO } from "../../../application/dtos/user/requestDTOs/GetSubscriptionInputDTO";
import { UpdateSubscriptionInputDTO } from "../../../application/dtos/user/requestDTOs/UpdateSubscriptonInputDTO";
import { InvoiceDTO } from "../../../application/dtos/user/requestDTOs/InvoiceDTO";

export interface IStripeService {
    createCheckoutSession(params: CreateCheckoutSessionInputDTO): Promise<string>;
    constructWebhookEvent(params: WebhookEventInputDTO): Promise<Stripe.Event>;
    getSubscription(params: GetSubscriptionInputDTO): Promise<Stripe.Subscription>;
    createProductAndPrice(params: { name: string; amount: number; interval: 'month' | 'year' }): Promise<{ productId: string; priceId: string }>;
    updateSubscriptionPlan(params: UpdateSubscriptionInputDTO): Promise<Stripe.Subscription>;
    getInvoicesByCustomer(customerId: string): Promise<InvoiceDTO[]>;
}