import { IStripeWebhookHandler } from "../../interface/stripe/IStripeWebhookHandler";
import { Stripe } from "stripe";
import { injectable, inject } from 'tsyringe';
import { IWorkspaceRepository } from "../../../domain/interfaces/repositories/IWorkspaceRepository";
import { ISubscriptionRepository } from "../../../domain/interfaces/repositories/ISubscriptionRepository";
import { IPlanRepository } from "../../../domain/interfaces/repositories/IPlanRepository";
import { SubscriptionStatus } from "../../../domain/enums/SubscriptionStatus";

@injectable()
export class SubscriptionUpdateHandler implements IStripeWebhookHandler {
    constructor(
        @inject('ISubscriptionRepository') private _subscriptionRepository: ISubscriptionRepository,
        @inject('IWorkspaceRepository') private _workspaceRepository: IWorkspaceRepository,
        @inject('IPlanRepository') private _planRepository: IPlanRepository,
    ) { }

    supports(eventType: string): boolean {
        return eventType === 'customer.subscription.updated';
    }

    async handle(event: Stripe.Event): Promise<void> {
        const subscription = event.data.object as Stripe.Subscription & { current_period_start: number; current_period_end: number };
        const stripeSubscriptionId = subscription.id;

        const existingSubscription = await this._subscriptionRepository.findByStripeSubscriptionId(stripeSubscriptionId);
        if (!existingSubscription) return;

        const newPriceId = subscription.items.data[0].price.id;

        const newPlan = await this._planRepository.getPlanByStripePriceId(newPriceId);
        if (!newPlan) {
            console.error(`Plan not found for Stripe Price ID: ${newPriceId}`);
            return;
        }

        const startDate = subscription.current_period_start
            ? new Date(subscription.current_period_start * 1000)
            : existingSubscription.startDate || new Date();

        const endDate = subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000)
            : existingSubscription.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        await this._subscriptionRepository.updateSubscription(existingSubscription._id!.toString(), {
            planId: newPlan._id!.toString(),
            endDate,
            startDate,
            status: SubscriptionStatus.ACTIVE,
        });

        if (existingSubscription.workspaceId) {
            const workspace = await this._workspaceRepository.getWorkspaceById(existingSubscription.workspaceId);
            if (workspace) {
                await this._workspaceRepository.updateWorkspace(workspace._id!.toString(), {
                    ...workspace,
                    planId: newPlan._id!.toString()
                });
            }
        }

        console.log("Subscription updated successfully", stripeSubscriptionId);
    }
}