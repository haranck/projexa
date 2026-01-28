import Stripe from "stripe";
import { CreateCheckoutSessionInputDTO } from "../../../application/dtos/user/requestDTOs/CreateCheckoutSessionInputDTO";
import { WebhookEventInputDTO } from "../../../application/dtos/user/requestDTOs/WebhookEventInputDTO";
import { GetSubscriptionInputDTO } from "../../../application/dtos/user/requestDTOs/GetSubscriptionInputDTO";

export interface IStripeService {
    createCheckoutSession(params: CreateCheckoutSessionInputDTO): Promise<string>;
    constructWebhookEvent(params: WebhookEventInputDTO): Promise<Stripe.Event>;
    getSubscription(params: GetSubscriptionInputDTO): Promise<Stripe.Subscription>;
}