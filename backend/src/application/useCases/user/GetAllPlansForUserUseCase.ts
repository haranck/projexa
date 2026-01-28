import { IGetAllPlansForUserUseCase } from "../../interface/user/IGetAllPlansForUserUseCase";
import { IPlanEntity } from "../../../domain/entities/IPlanEntity";
import { injectable, inject } from "tsyringe";
import { IPlanRepository } from "../../../domain/interfaces/repositories/IPlanRepository";

@injectable()
export class GetAllPlansForUserUseCase implements IGetAllPlansForUserUseCase {
    constructor(
        @inject("IPlanRepository") private _planRepository:IPlanRepository
    ){}
    async execute(): Promise<IPlanEntity[]> {
        const plans =  await this._planRepository.getAllPlans();
        return plans.filter(plan=>plan.isActive);
    }
}