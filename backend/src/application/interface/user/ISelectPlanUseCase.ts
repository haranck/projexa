import { SelectPlanDTO } from "../../dtos/user/requestDTOs/SelectPlanDTO";
import { IWorkspaceEntity } from "../../../domain/entities/IWorkspaceEntity";

export interface ISelectPlanUseCase {
    execute(dto: SelectPlanDTO): Promise<IWorkspaceEntity>
}
