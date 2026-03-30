import { injectable, inject } from "tsyringe";
import { IStartSprintUseCase } from "../../interface/sprint/IStartSprintUseCase";
import { ISprintRepository } from "../../../domain/interfaces/repositories/SprintRepo/ISprintRepository";
import { StartSprintDTO } from "../../dtos/issue/requestDTOs/StartSprintDTO";
import { ISprintEntity } from "../../../domain/entities/Sprint/ISprintEntity";
import { SprintStatus } from "../../../domain/enums/SprintStatus";
import {
  ERROR_MESSAGES,
  SPRINT_ERRORS,
  PROJECT_ERRORS,
} from "../../../domain/constants/errorMessages";
import { IProjectMemberRepository } from "../../../domain/interfaces/repositories/ProjectRepo/IProjectMemberRepository";
import { IRoleRepository } from "../../../domain/interfaces/repositories/IRoleRepository";
import { ProjectRole } from "../../../domain/enums/ProjectRole";
import { ISendNotificationUseCase } from "../../interface/notification/ISendNotificationUseCase";
import { NotificationEventType } from "../../../domain/enums/NotificationEventType";

import { SprintDTOmapper } from "../../mappers/Sprint/SprintDTOmapper";

@injectable()
export class StartSprintUseCase implements IStartSprintUseCase {
  constructor(
    @inject("ISprintRepository") private readonly _sprintRepository: ISprintRepository,
    @inject("IProjectMemberRepository") private readonly _projectMemberRepo: IProjectMemberRepository,
    @inject("IRoleRepository") private readonly _roleRepo: IRoleRepository,
    @inject("ISendNotificationUseCase") private readonly _sendNotification: ISendNotificationUseCase
  ) { }
  async execute(dto: StartSprintDTO, userId: string): Promise<ISprintEntity> {

    const sprint = await this._sprintRepository.getSprintById(dto.sprintId);
    if (!sprint) throw new Error(SPRINT_ERRORS.SPRINT_NOT_FOUND);

    const projectMember = await this._projectMemberRepo.findProjectAndUser(sprint.projectId, userId);
    if (!projectMember) throw new Error(PROJECT_ERRORS.PROJECT_MEMBER_NOT_FOUND);

    const role = await this._roleRepo.getRoleById(projectMember.roleId);

    if (!role || role.name !== ProjectRole.PROJECT_MANAGER) {
      throw new Error(PROJECT_ERRORS.ONLY_PROJECT_MANAGER_CAN_START_SPRINT);
    }

    if (sprint.status === SprintStatus.ACTIVE)
      throw new Error(SPRINT_ERRORS.SPRINT_ALREADY_ACTIVE);
    if (sprint.status === SprintStatus.COMPLETED)
      throw new Error(SPRINT_ERRORS.SPRINT_COMPLETED);

    if (!dto.startDate || !dto.endDate)
      throw new Error(ERROR_MESSAGES.DATE_REQUIRED);

    if (dto.startDate > dto.endDate)
      throw new Error(ERROR_MESSAGES.INVALID_DATES);

    const updatedSprint = await this._sprintRepository.updateSprint(
      dto.sprintId,
      {
        status: SprintStatus.ACTIVE,
        startDate: dto.startDate,
        endDate: dto.endDate,
        goal: dto.goal,
      },
    );
    if (!updatedSprint) throw new Error(SPRINT_ERRORS.SPRINT_UPDATE_FAILED);

    await this._sendNotification.execute({
      recipientId: sprint.projectId,
      eventType: NotificationEventType.SPRINT_STARTED,
      message: `Sprint "${sprint.name}" has been started`,
      resourceId: sprint._id,
      resourceType: "sprint"
    })

    return SprintDTOmapper.toResponseDTO(updatedSprint);
  }
}
