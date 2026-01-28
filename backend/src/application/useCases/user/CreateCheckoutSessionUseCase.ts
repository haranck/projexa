import { CreateCheckoutSessionUseCaseDTO } from "../../dtos/user/requestDTOs/CreateCheckoutSessionUseCaseDTO";
import { ICreateCheckoutSessionUseCase } from "../../interface/user/ICreateCheckoutSessionUseCase";
import { IStripeService } from "../../../domain/interfaces/services/IStripeService";
import { inject, injectable } from "tsyringe";
import { IPlanRepository } from "../../../domain/interfaces/repositories/IPlanRepository";
import { IWorkspaceRedisRepository } from "../../../domain/interfaces/repositories/IWorkspaceRedisRepository";
import { WORKSPACE_ERRORS, SUBSCRIPTION_ERRORS } from "../../../domain/constants/errorMessages";
import { IWorkspaceRepository } from "../../../domain/interfaces/repositories/IWorkspaceRepository";

@injectable()
export class CreateCheckoutSessionUseCase implements ICreateCheckoutSessionUseCase {
    constructor(
        @inject('IStripeService') private _stripeService: IStripeService,
        @inject('IPlanRepository') private _planRepository: IPlanRepository,
        @inject('IWorkspaceRedisRepository') private _workspaceRedisRepository: IWorkspaceRedisRepository,
        @inject('IWorkspaceRepository') private _workspaceRepository: IWorkspaceRepository
    ) { }

    async execute(dto: CreateCheckoutSessionUseCaseDTO): Promise<string> {
        let workspace = await this._workspaceRedisRepository.findByName(dto.workspaceName)

        if (!workspace) {
            workspace = await this._workspaceRepository.getWorkspaceByName(dto.workspaceName);
        }

        if (!workspace) throw new Error(WORKSPACE_ERRORS.WORKSPACE_NOT_FOUND);

        const planId = dto.planId || workspace.planId;

        if (!planId) {
            throw new Error("Plan not selected and no price available");
        }

        const plan = planId ? await this._planRepository.getPlanById(planId) : null;
        const priceId = plan?.stripePriceId;

        if (!priceId) {
            throw new Error(SUBSCRIPTION_ERRORS.STRIPE_PRICE_ID_MISSING);
        }

        const session = await this._stripeService.createCheckoutSession({
            priceId: priceId,
            customerEmail: dto.userEmail,
            successUrl: dto.successUrl,
            cancelUrl: dto.cancelUrl,
            metadata: {
                workspaceName: workspace.name,
                userId: dto.userId,
                planId: planId || ""
            }
        })

        return session;
    }
}
