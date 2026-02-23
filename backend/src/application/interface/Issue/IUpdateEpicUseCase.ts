import { IIssueEntity } from "../../../domain/entities/Issue/IIssueEntity";
import { UpdateEpicDTO } from "../../dtos/issue/requestDTOs/UpdateEpicDTO";

export interface IUpdateEpicUseCase {
    execute(issueId:string,dto:UpdateEpicDTO):Promise<IIssueEntity>
}
