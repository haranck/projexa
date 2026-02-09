import { IStripeWebhookUseCase } from "../../interface/stripe/IStripeWebhookUseCase";
import { injectable, inject, injectAll } from "tsyringe";
import { IStripeService } from "../../../domain/interfaces/services/IStripeService";
import { IStripeWebhookHandler } from "../../interface/stripe/IStripeWebhookHandler";


@injectable()
export class StripeWebhookUseCase implements IStripeWebhookUseCase {
    constructor(
        @inject("IStripeService") private _stripeService: IStripeService,
        @injectAll("IStripeWebhookHandler") private _stripeWebhookHandlers: IStripeWebhookHandler[],
    ) { }

    async execute(payload: Buffer, signature: string): Promise<void> {
        const event = await this._stripeService.constructWebhookEvent({ payload, signature });

        const handler = this._stripeWebhookHandlers.find(h => h.supports(event.type));

        if (handler) {
            await handler.handle(event);
        }
    }
}
