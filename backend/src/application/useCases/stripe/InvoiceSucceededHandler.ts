
import { IStripeWebhookHandler } from "../../interface/stripe/IStripeWebhookHandler";
import { Stripe } from "stripe";
import { injectable, inject } from "tsyringe";
import { ISubscriptionRepository } from "../../../domain/interfaces/repositories/ISubscriptionRepository";
import { IStripeService } from "../../../domain/interfaces/services/IStripeService";
import { SubscriptionStatus } from "../../../domain/enums/SubscriptionStatus";

@injectable()
export class InvoiceSucceededHandler implements IStripeWebhookHandler {
    constructor(
        @inject('IStripeService') private _stripeService: IStripeService,
        @inject('ISubscriptionRepository') private _subscriptionRepository: ISubscriptionRepository,
    ) { }

    supports(eventType: string): boolean {
        return eventType === "invoice.payment_succeeded";
    }

    async handle(event: Stripe.Event): Promise<void> {
        console.log("🔥 invoice.payment_succeeded webhook received");

        const invoice = event.data.object as Stripe.Invoice & { subscription?: string | Stripe.Subscription };

        if (!invoice.subscription) return;

        const stripeSubscriptionId = typeof invoice.subscription === 'string'
            ? invoice.subscription
            : invoice.subscription.id;

        const stripeSub = await this._stripeService.getSubscription({
            subscriptionId: stripeSubscriptionId,
        }) as Stripe.Subscription & {
            current_period_start: number;
            current_period_end: number;
        };

        const startDate = stripeSub.current_period_start
            ? new Date(stripeSub.current_period_start * 1000)
            : new Date();

        const endDate = stripeSub.current_period_end
            ? new Date(stripeSub.current_period_end * 1000)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        const existingSub = await this._subscriptionRepository.findByStripeSubscriptionId(stripeSubscriptionId);
        if (!existingSub) return;

        await this._subscriptionRepository.updateSubscription(existingSub._id!.toString(), {
            startDate,
            endDate,
            status: SubscriptionStatus.ACTIVE,
        });

        console.log("✅ Subscription updated in DB for renewal:", stripeSubscriptionId);

    }

}