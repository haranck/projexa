import { ISelectPlanUseCase } from "../../interface/user/ISelectPlanUseCase";
import { IWorkspaceRedisRepository } from "../../../domain/interfaces/repositories/IWorkspaceRedisRepository";
import { injectable, inject } from "tsyringe";
import { SelectPlanDTO } from "../../dtos/user/requestDTOs/SelectPlanDTO";
import { IWorkspaceEntity } from "../../../domain/entities/IWorkspaceEntity";
import { IPlanRepository } from "../../../domain/interfaces/repositories/IPlanRepository";
import { SUBSCRIPTION_ERRORS, WORKSPACE_ERRORS } from "../../../domain/constants/errorMessages";
import { IWorkspaceRepository } from "../../../domain/interfaces/repositories/IWorkspaceRepository";

@injectable()
export class SelectPlanUseCase implements ISelectPlanUseCase {
    constructor(
        @inject("IWorkspaceRedisRepository") private _workspaceRedisRepository: IWorkspaceRedisRepository,
        @inject("IPlanRepository") private _planRepository: IPlanRepository,
        @inject("IWorkspaceRepository") private _workspaceRepository: IWorkspaceRepository
    ) { }

    async execute(dto: SelectPlanDTO): Promise<IWorkspaceEntity> {
        const { workspaceName, planId, userId } = dto

        const plan = await this._planRepository.getPlanById(planId);
        if (!plan) throw new Error(SUBSCRIPTION_ERRORS.PLAN_NOT_FOUND)

        if (!plan.stripePriceId && !process.env.STRIPE_DEFAULT_PRICE_ID) {
            console.error(`Plan ${planId} is missing stripePriceId and no default found`);
            throw new Error(SUBSCRIPTION_ERRORS.STRIPE_PRICE_ID_MISSING);
        }
        let workspace = await this._workspaceRedisRepository.findByName(workspaceName);

        if (!workspace) {
            workspace = await this._workspaceRepository.getWorkspaceByName(workspaceName);
        }

        if (!workspace) throw new Error(WORKSPACE_ERRORS.WORKSPACE_NOT_FOUND)

        if (workspace.ownerId !== userId) throw new Error(WORKSPACE_ERRORS.UNAUTHORIZED_TO_SELECT_PLAN_FOR_WORKSPACE)

        workspace.planId = planId;

        return await this._workspaceRedisRepository.save(workspace);
    }
}
