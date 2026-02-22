import { CreateIssueDTO } from "../dtos/issue/requestDTOs/CreateIssueDTO";
import { IIssueEntity } from "../../domain/entities/Issue/IIssueEntity";
import { IssueStatus } from "../../domain/enums/IssueEnums";

export class IssueDTOmapper {
    static toDomain(dto: CreateIssueDTO, userId: string, key: string): Omit<IIssueEntity, "_id" | "createdAt" | "updatedAt"> {
        return {
            workspaceId: dto.workspaceId,
            projectId: dto.projectId,
            parentIssueId: dto.parentIssueId ?? null,
            sprintId: dto.sprintId ?? null,
            key,
            title: dto.title,
            description: dto.description ?? "",
            issueType: dto.issueType,
            status: IssueStatus.TODO,
            attachements: dto.attachments?.map(attachement => ({
                type: attachement.type,
                url: attachement.url,
                fileName: attachement.fileName
            })) ?? [],
            assigneeId: dto.assigneeId ?? null,
            startDate: dto.startDate ?? null,
            endDate: dto.endDate ?? null,
            createdBy: userId
        }
    }
}