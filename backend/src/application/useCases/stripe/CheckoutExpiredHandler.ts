import { IStripeWebhookHandler } from "../../interface/stripe/IStripeWebhookHandler";
import { Stripe } from "stripe";
import { injectable, inject } from 'tsyringe'
import { IRedisLockService } from "../../../domain/interfaces/services/IRedisLockService";

@injectable()
export class CheckoutExpiredHandler implements IStripeWebhookHandler {
    constructor(
        @inject("IRedisLockService") private _redisLockService: IRedisLockService,
    ) { }

    supports(eventType: string): boolean {
        return eventType === 'checkout.session.expired';
    }

    async handle(event: Stripe.Event): Promise<void> {
        console.log("checkout.session.expired webhook received");
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata;

        if (!metadata || !metadata.userId) {
            console.warn("Missing userId in metadata for checkout.session.expired");
            return;
        }

        const lockKey = `payment_lock:${metadata.userId}`;
        await this._redisLockService.releaseLock(lockKey);
        console.log(`Payment lock released for user ${metadata.userId} due to session expiration.`);
    }
}