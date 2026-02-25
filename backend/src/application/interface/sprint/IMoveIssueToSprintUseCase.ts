import { MoveIssueToSprintDTO } from "../../dtos/issue/requestDTOs/MoveIssueToSprintDTO";
import { IIssueEntity } from "../../../domain/entities/Issue/IIssueEntity";

export interface IMoveIssueToSprintUseCase {
    execute(dto:MoveIssueToSprintDTO):Promise<IIssueEntity>
}