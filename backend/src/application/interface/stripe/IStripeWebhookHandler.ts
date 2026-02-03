import { Stripe } from 'stripe';

export interface IStripeWebhookHandler {
    supports(eventType: string): boolean;
    handle(event: Stripe.Event): Promise<void>;
}
