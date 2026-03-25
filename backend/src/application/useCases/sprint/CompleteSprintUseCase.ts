import { injectable, inject } from 'tsyringe'
import { ICompleteSprintUseCase } from '../../interface/sprint/ICompleteSprintUseCase'
import { CompleteSprintDTO } from '../../dtos/issue/requestDTOs/CompleteSprintDTO'
import { ISprintRepository } from '../../../domain/interfaces/repositories/SprintRepo/ISprintRepository'
import { IIssueRepository } from '../../../domain/interfaces/repositories/IssueRepo/IIssueRepository'
import { SPRINT_ERRORS } from '../../../domain/constants/errorMessages'
import { SprintStatus } from '../../../domain/enums/SprintStatus'
import { IssueStatus } from '../../../domain/enums/IssueEnums'
import { ISendNotificationUseCase } from '../../interface/notification/ISendNotificationUseCase'
import { NotificationEventType } from '../../../domain/enums/NotificationEventType'

import { IProjectRepository } from '../../../domain/interfaces/repositories/ProjectRepo/IProjectRepository'

@injectable()
export class CompleteSprintUseCase implements ICompleteSprintUseCase {
    constructor(
        @inject('ISprintRepository') private readonly _sprintRepo: ISprintRepository,
        @inject('IIssueRepository') private readonly _issueRepo: IIssueRepository,
        @inject("ISendNotificationUseCase") private readonly _sendNotification: ISendNotificationUseCase,
        @inject('IProjectRepository') private readonly _projectRepo: IProjectRepository
    ) { }

    async execute(data: CompleteSprintDTO): Promise<void> {
        const { sprintId, moveIncompleteIssuesToSprintId, requesterId } = data
        const sprint = await this._sprintRepo.getSprintById(sprintId)
        if (!sprint) throw new Error(SPRINT_ERRORS.SPRINT_NOT_FOUND)

        const project = await this._projectRepo.getProjectById(sprint.projectId)
        if (!project) throw new Error(SPRINT_ERRORS.SPRINT_NOT_FOUND)

        if (project.createdBy.toString() !== requesterId.toString()) {
            throw new Error(SPRINT_ERRORS.ONLY_PROJECT_MANAGER_CAN_COMPLETE_SPRINT)
        }

        if (sprint.status !== SprintStatus.ACTIVE) throw new Error(SPRINT_ERRORS.ONLY_ACTIVE_SPRINT_CAN_BE_COMPLETED)

        const issues = await this._issueRepo.getIssuesBySprintId(sprintId)

        const incompleteIssues = issues.filter((issue) => issue.status?.toString().toUpperCase() !== IssueStatus.DONE.toUpperCase())

        for (const issue of incompleteIssues) {
            if (moveIncompleteIssuesToSprintId) {
                await this._issueRepo.updateSprint(issue._id.toString(), moveIncompleteIssuesToSprintId)
            }
            else {
                await this._issueRepo.updateSprint(issue._id.toString(), null)
            }
        }

        await this._sprintRepo.updateSprint(sprintId, { status: SprintStatus.COMPLETED })

        await this._sendNotification.execute({
            recipientId: sprint.projectId,
            eventType: NotificationEventType.SPRINT_COMPLETED,
            message: `Sprint "${sprint.name}" has been completed`,
            resourceId: sprint._id,
            resourceType: "sprint"
        })

    }
}