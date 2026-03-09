import { IIssueEntity } from "../../../domain/entities/Issue/IIssueEntity";
import { GetAllIssuesFilterDTO } from "../../dtos/issue/requestDTOs/GetAllIssuesFilterDTO";

export interface IGetAllIssuesUseCase {
    execute(filter:GetAllIssuesFilterDTO): Promise<IIssueEntity[]>;
}
