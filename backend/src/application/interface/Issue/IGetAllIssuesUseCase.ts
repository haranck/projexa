import { IIssueEntity } from "../../../domain/entities/Issue/IIssueEntity";

export interface IGetAllIssuesUseCase {
    execute(projectId: string): Promise<IIssueEntity[]>;
}
