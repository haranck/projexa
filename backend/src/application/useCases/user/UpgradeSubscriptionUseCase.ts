import { injectable, inject } from 'tsyringe'
import { IUpgradeSubscriptionUseCase } from '../../interface/user/IUpgradeSubscriptionUseCase'
import { UpgradeSubscriptionInputDTO } from '../../dtos/user/requestDTOs/UpgradeSubscriptionDTO'
import { ISubscriptionRepository } from '../../../domain/interfaces/repositories/ISubscriptionRepository'
import { IStripeService } from '../../../domain/interfaces/services/IStripeService'
import { Stripe } from 'stripe'
import { IWorkspaceRepository } from '../../../domain/interfaces/repositories/IWorkspaceRepository'
import { SUBSCRIPTION_ERRORS, WORKSPACE_ERRORS } from '../../../domain/constants/errorMessages'
import { IPlanRepository } from '../../../domain/interfaces/repositories/IPlanRepository'
import { SubscriptionStatus } from '../../../domain/enums/SubscriptionStatus'

@injectable()
export class UpgradeSubscriptionUseCase implements IUpgradeSubscriptionUseCase {
    constructor(
        @inject('ISubscriptionRepository') private _subscriptionRepository: ISubscriptionRepository,
        @inject('IStripeService') private _stripeService: IStripeService,
        @inject('IWorkspaceRepository') private _workspaceRepository: IWorkspaceRepository,
        @inject('IPlanRepository') private _planRepository: IPlanRepository,
    ) { }

    async execute(dto: UpgradeSubscriptionInputDTO): Promise<void> {
        const { workspaceId, userId, newPriceId } = dto

        const plan = await this._planRepository.getPlanById(newPriceId)
        if (!plan) throw new Error(SUBSCRIPTION_ERRORS.PLAN_NOT_FOUND)
        if (!plan.stripePriceId) throw new Error(SUBSCRIPTION_ERRORS.STRIPE_PRICE_ID_MISSING)

        const workspace = await this._workspaceRepository.getWorkspaceById(workspaceId)
        if (!workspace) throw new Error(WORKSPACE_ERRORS.WORKSPACE_NOT_FOUND)
        if (workspace.ownerId?.toString() !== userId) throw new Error('Unauthorized')

        const subscription = await this._subscriptionRepository.findById(workspace.subscriptionId!.toString())
        if (!subscription) throw new Error(SUBSCRIPTION_ERRORS.SUBSCRIPTION_NOT_FOUND)

        const updatedStripeSub = await this._stripeService.updateSubscriptionPlan({
            stripeSubscriptionId: subscription.stripeSubscriptionId,
            newPriceId: plan.stripePriceId
        }) as Stripe.Subscription & { current_period_start: number; current_period_end: number };

        // 1. Update local subscription record immediately
        const startDate = updatedStripeSub.current_period_start
            ? new Date(updatedStripeSub.current_period_start * 1000)
            : subscription.startDate || new Date();

        const endDate = updatedStripeSub.current_period_end
            ? new Date(updatedStripeSub.current_period_end * 1000)
            : subscription.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        await this._subscriptionRepository.updateSubscription(subscription._id!.toString(), {
            planId: plan._id!.toString(),
            endDate,
            startDate,
            status: SubscriptionStatus.ACTIVE,
        })

        // 2. Update workspace record immediately
        await this._workspaceRepository.updateWorkspace(workspaceId, {
            ...workspace,
            planId: plan._id!.toString()
        })
    }

}
