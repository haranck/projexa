import { IStripeWebhookHandler } from "../../interface/stripe/IStripeWebhookHandler";
import { Stripe } from "stripe";
import { injectable, inject } from 'tsyringe'
import { IWorkspaceRedisRepository } from "../../../domain/interfaces/repositories/IWorkspaceRedisRepository";
import { IWorkspaceRepository } from "../../../domain/interfaces/repositories/IWorkspaceRepository";
import { ISubscriptionRepository } from "../../../domain/interfaces/repositories/ISubscriptionRepository";
import { IStripeService } from "../../../domain/interfaces/services/IStripeService";
import { WORKSPACE_ERRORS } from "../../../domain/constants/errorMessages";
import { SubscriptionStatus } from "../../../domain/enums/SubscriptionStatus";

@injectable()
export class CheckoutCompleteHandler implements IStripeWebhookHandler {
    constructor(
        @inject("IWorkspaceRedisRepository") private _workspaceRedisRepository: IWorkspaceRedisRepository,
        @inject("IWorkspaceRepository") private _workspaceRepository: IWorkspaceRepository,
        @inject("ISubscriptionRepository") private _subscriptionRepository: ISubscriptionRepository,
        @inject("IStripeService") private _stripeService: IStripeService,
    ) { }

    supports(eventType: string): boolean {
        return eventType === 'checkout.session.completed';
    }

    async handle(event: Stripe.Event): Promise<void> {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata;

        if (!metadata) throw new Error("Missing Metadata")

        const { workspaceName,userId,planId} = metadata;

        const stripeSubscriptionId = session.subscription as string;
        const stripeCustomerId = session.customer as string;

        const workspace = await this._workspaceRedisRepository.findByName(workspaceName);
        if(!workspace) throw new Error(WORKSPACE_ERRORS.WORKSPACE_NOT_FOUND)
        
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
            console.log("Redis key deleted. Flow complete.");
    }
}