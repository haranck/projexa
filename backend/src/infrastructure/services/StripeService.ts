import Stripe from "stripe";
import { injectable } from "tsyringe"
import { IStripeService } from "../../domain/interfaces/services/IStripeService";
import { env } from "../../config/envValidation";
import { CreateCheckoutSessionInputDTO } from "../../application/dtos/user/requestDTOs/CreateCheckoutSessionInputDTO";
import { WebhookEventInputDTO } from "../../application/dtos/user/requestDTOs/WebhookEventInputDTO";
import { GetSubscriptionInputDTO } from "../../application/dtos/user/requestDTOs/GetSubscriptionInputDTO";

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
            customer_email: params.customerEmail,
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
}