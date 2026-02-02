import { injectable, inject } from "tsyringe";
import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import { Request, Response } from "express";
import { IStripeService } from "../../../domain/interfaces/services/IStripeService";
import { IWorkspaceRedisRepository } from "../../../domain/interfaces/repositories/IWorkspaceRedisRepository";
import { IWorkspaceRepository } from "../../../domain/interfaces/repositories/IWorkspaceRepository";
import { ISubscriptionRepository } from "../../../domain/interfaces/repositories/ISubscriptionRepository";
import { WORKSPACE_ERRORS } from "../../../domain/constants/errorMessages";
import { SubscriptionStatus } from "../../../domain/enums/SubscriptionStatus";
import Stripe from "stripe";

@injectable()
export class StripeWebhookController {
    constructor(
        @inject("IStripeService") private _stripeService: IStripeService,
        @inject("IWorkspaceRedisRepository") private _workspaceRedisRepository: IWorkspaceRedisRepository,
        @inject("IWorkspaceRepository") private _workspaceRepository: IWorkspaceRepository,
        @inject("ISubscriptionRepository") private _subscriptionRepository: ISubscriptionRepository,
    ) { }

    handleWebhook = async (req: Request, res: Response): Promise<void> => {
        const signature = req.headers['stripe-signature'] as string;

        try {
            const event = await this._stripeService.constructWebhookEvent({ payload: req.body, signature });

            if (event.type === 'checkout.session.completed') {
                const session = event.data.object as Stripe.Checkout.Session;
                const metadata = session.metadata;

                console.log("metadata:", metadata);

                if (!metadata) {
                    res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "Missing metadata" });
                    return;
                }

                const { workspaceName, userId, planId } = metadata;

                const stripeSubscriptionId = session.subscription as string;
                const stripeCustomerId = session.customer as string;

                const workspace = await this._workspaceRedisRepository.findByName(workspaceName);
                if (!workspace) {
                    res.status(HTTP_STATUS.NOT_FOUND).json({ error: WORKSPACE_ERRORS.WORKSPACE_NOT_FOUND });
                    return;
                }

                const savedWorkspace = await this._workspaceRepository.createWorkspace({
                    ...workspace,
                    members: [userId],
                    ownerId: userId,
                    planId,
                });

                const stripeSub = await this._stripeService.getSubscription({ subscriptionId: stripeSubscriptionId }) as Stripe.Subscription & { current_period_start: number; current_period_end: number };

                const startDate = stripeSub.current_period_start
                    ? new Date(stripeSub.current_period_start * 1000)
                    : new Date();

                const endDate = stripeSub.current_period_end
                    ? new Date(stripeSub.current_period_end * 1000)
                    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // default 30 days

                const subscription = await this._subscriptionRepository.createSubscription({
                    userId,
                    workspaceId: savedWorkspace._id!.toString(),
                    planId,
                    stripeSubscriptionId,
                    stripeCustomerId,
                    status: SubscriptionStatus.ACTIVE,
                    startDate,
                    endDate,
                });

                await this._workspaceRepository.updateWorkspace(savedWorkspace._id!.toString(), {
                    ...savedWorkspace,
                    subscriptionId: subscription._id!.toString()
                });

                await this._workspaceRedisRepository.delete(workspaceName);
            }
            console.log("Redis key deleted. Flow complete.");
            res.status(HTTP_STATUS.OK).json({ received: true });
        } catch (err: unknown) {
            if (err instanceof Error) {
                res.status(HTTP_STATUS.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
            }
        }
    }
}