import { injectable, inject } from 'tsyringe'
import { IUpgradeSubscriptionUseCase } from '../../interface/user/IUpgradeSubscriptionUseCase'
import { UpgradeSubscriptionInputDTO } from '../../dtos/user/requestDTOs/UpgradeSubscriptionDTO'
import { ISubscriptionRepository } from '../../../domain/interfaces/repositories/ISubscriptionRepository'
import { IStripeService } from '../../../domain/interfaces/services/IStripeService'
import { IWorkspaceRepository } from '../../../domain/interfaces/repositories/IWorkspaceRepository'
import { SUBSCRIPTION_ERRORS, WORKSPACE_ERRORS } from '../../../domain/constants/errorMessages'
import { IPlanRepository } from '../../../domain/interfaces/repositories/IPlanRepository'

@injectable()
export class UpgradeSubscriptionUseCase implements IUpgradeSubscriptionUseCase {
    constructor(
        @inject('ISubscriptionRepository') private _subscriptionRepository: ISubscriptionRepository,
        @inject('IStripeService') private _stripeService: IStripeService,
        @inject('IWorkspaceRepository') private _workspaceRepository: IWorkspaceRepository,
        @inject('IPlanRepository') private _planRepository: IPlanRepository,
    ) { }

    async execute(dto: UpgradeSubscriptionInputDTO): Promise<string> {
        const { workspaceId, userId, newPriceId } = dto

        const plan = await this._planRepository.getPlanById(newPriceId)
        if (!plan) throw new Error(SUBSCRIPTION_ERRORS.PLAN_NOT_FOUND)
        if (!plan.stripePriceId) throw new Error(SUBSCRIPTION_ERRORS.STRIPE_PRICE_ID_MISSING)

        const workspace = await this._workspaceRepository.getWorkspaceById(workspaceId)
        if (!workspace) throw new Error(WORKSPACE_ERRORS.WORKSPACE_NOT_FOUND)
        if (workspace.ownerId?.toString() !== userId) throw new Error('Unauthorized')

        const subscription = await this._subscriptionRepository.findById(workspace.subscriptionId!.toString())
        if (!subscription) throw new Error(SUBSCRIPTION_ERRORS.SUBSCRIPTION_NOT_FOUND)

        const checkoutUrl = await this._stripeService.createCheckoutSession({
            priceId: plan.stripePriceId,
            customerEmail: "",
            customerId: subscription.stripeCustomerId,
            metadata: {
                workspaceId: workspaceId,
                userId: userId,
                planId: plan._id!.toString(),
                isUpgrade: "true"
            },
            successUrl: `${process.env.FRONTEND_URL}/payment-success`,
            cancelUrl: `${process.env.FRONTEND_URL}/payment-cancel`
        })

        return checkoutUrl;
    }

}
