import { ISprintEntity } from "../../domain/entities/Sprint/ISprintEntity"
import { CreateSprintDTO } from "../dtos/issue/requestDTOs/CreateSprintDTO";
import { SprintStatus } from "../../domain/enums/SprintStatus";

export class SprintMapper {
    static toDomain(dto: CreateSprintDTO, name: string): ISprintEntity {
        return {
            workspaceId: dto.workspaceId,
            projectId: dto.projectId,
            name: name,
            status: SprintStatus.PLANNED,
            createdBy: dto.createdBy,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    }
}