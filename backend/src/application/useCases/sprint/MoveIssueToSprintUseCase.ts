import { MoveIssueToSprintDTO } from "../../dtos/issue/requestDTOs/MoveIssueToSprintDTO";
import { IIssueEntity } from "../../../domain/entities/Issue/IIssueEntity";
import { IMoveIssueToSprintUseCase } from "../../interface/sprint/IMoveIssueToSprintUseCase";
import { IIssueRepository } from "../../../domain/interfaces/repositories/IssueRepo/IIssueRepository";
import { PROJECT_ERRORS } from "../../../domain/constants/errorMessages";
import { injectable, inject } from "tsyringe";
import { ISprintRepository } from "../../../domain/interfaces/repositories/SprintRepo/ISprintRepository";
import { SPRINT_ERRORS } from "../../../domain/constants/errorMessages";
import { SprintStatus } from "../../../domain/enums/SprintStatus";
import { IProjectMemberRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectMemberRepository";
import { IRoleRepository } from "../../../domain/interfaces/repositories/IRoleRepository";
import { ProjectRole } from "../../../domain/enums/ProjectRole";
import { ERROR_MESSAGES } from "../../../domain/constants/errorMessages";
import { ISendNotificationUseCase } from "../../interface/notification/ISendNotificationUseCase";
import { NotificationEventType } from "../../../domain/enums/NotificationEventType";
import { IssueDTOmapper } from "../../mappers/Issue/IssueDTOmapper";


@injectable()
export class MoveIssueToSprintUseCase implements IMoveIssueToSprintUseCase {
    constructor(
        @inject('IIssueRepository') private readonly _issueRepository: IIssueRepository,
        @inject('ISprintRepository') private readonly _sprintRepository: ISprintRepository,
        @inject('IProjectMemberRepository') private readonly _projectMemberRepo: IProjectMemberRepository,
        @inject('IRoleRepository') private readonly _roleRepo: IRoleRepository,
        @inject("ISendNotificationUseCase") private readonly _sendNotification: ISendNotificationUseCase
    ) { }

    async execute(dto: MoveIssueToSprintDTO, userId: string): Promise<IIssueEntity> {
        const issue = await this._issueRepository.findIssueById(dto.issueId)
        if (!issue) throw new Error(PROJECT_ERRORS.ISSUE_NOT_FOUND)

        let isProjectManager = false;

        const projectMember = await this._projectMemberRepo.findProjectAndUser(issue.projectId, userId);
        if (projectMember) {
            const role = await this._roleRepo.getRoleById(projectMember.roleId);
            if (role && role.name === ProjectRole.PROJECT_MANAGER) {
                isProjectManager = true;
            }
        }

        if (!isProjectManager) {
            if (issue.assigneeId?.toString() !== userId) {
                throw new Error(ERROR_MESSAGES.ONLY_PM_CAN_MOVE_ISSUE);
            }
        }

        const sprintId = dto.sprintId === "" ? null : dto.sprintId;

        if (sprintId) {
            const sprint = await this._sprintRepository.getSprintById(sprintId)
            if (!sprint) throw new Error(SPRINT_ERRORS.SPRINT_NOT_FOUND)

            if (sprint.projectId.toString() !== issue.projectId.toString()) throw new Error(PROJECT_ERRORS.PROJECT_NOT_FOUND)

            if (sprint.status === SprintStatus.COMPLETED) throw new Error(SPRINT_ERRORS.SPRINT_COMPLETED)
        }

        const updated = await this._issueRepository.updateIssue(issue._id.toString(), { sprintId: sprintId })
        if (!updated) throw new Error(PROJECT_ERRORS.FAILED_TO_UPDATE_ISSUE)

        if (updated.assigneeId) {
            let sprintName = "Backlog";
            if (sprintId) {
                const sprint = await this._sprintRepository.getSprintById(sprintId);
                sprintName = sprint?.name || "Sprint";
            }

            await this._sendNotification.execute({
                recipientId: updated.assigneeId,
                eventType: NotificationEventType.ISSUE_UPDATED,
                message: `Issue "${updated.title}" has been moved to ${sprintName}`,
                resourceId: updated._id,
                resourceType: "issue"
            }).catch(err => console.error("Failed to send movement notification:", err));
        }

        return IssueDTOmapper.toResponseDTO(updated)
    }
}
