import { CreateIssueDTO } from "../../dtos/issue/requestDTOs/CreateIssueDTO";
import { IIssueEntity } from "../../../domain/entities/Issue/IIssueEntity";

export interface ICreateIssueUseCase{
    execute(dto:CreateIssueDTO,userId:string):Promise<IIssueEntity>
}
