import { IPlanEntity } from "../../../domain/entities/IPlanEntity";

export interface IGetAllPlansForUserUseCase {
    execute():Promise<IPlanEntity[]>
}
