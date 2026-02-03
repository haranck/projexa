import { injectable, inject } from "tsyringe";
import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import { Request, Response } from "express";
import { IStripeWebhookUseCase } from "../../../application/interface/stripe/IStripeWebhookUseCase";

@injectable()
export class StripeWebhookController {
    constructor(
        @inject("IStripeWebhookUseCase") private _stripeWebhookUseCase: IStripeWebhookUseCase,
    ) { }

    handleWebhook = async (req: Request, res: Response): Promise<void> => {
        const signature = req.headers['stripe-signature'] as string;
        try {
            await this._stripeWebhookUseCase.execute(req.body, signature);
            res.status(HTTP_STATUS.OK).json({ received: true });
        } catch (err: unknown) {
            console.error("Webhook Error:", err);
            if (err instanceof Error) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ error: `Webhook Error: ${err.message}` });
            } else {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "Unknown Webhook Error" });
            }
        }
    }
}