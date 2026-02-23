import { IAttachement } from "../../../../domain/entities/Issue/IIssueEntity";
import { IssueStatus } from "../../../../domain/enums/IssueEnums";

export interface UpdateEpicDTO {
    title?: string;
    description?: string;
    status?: IssueStatus;
    attachments?: IAttachement[];
    startDate?: Date | null;
    endDate?: Date | null;
}