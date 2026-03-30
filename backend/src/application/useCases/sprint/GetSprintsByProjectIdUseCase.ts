import { injectable, inject } from "tsyringe";
import { IGetSprintsByProjectIdUseCase } from "../../interface/sprint/IGetSprintsByProjectIdUseCase";
import { ISprintRepository } from "../../../domain/interfaces/repositories/SprintRepo/ISprintRepository";
import { ISprintEntity } from "../../../domain/entities/Sprint/ISprintEntity";

import { SprintDTOmapper } from "../../mappers/Sprint/SprintDTOmapper";

@injectable()
export class GetSprintsByProjectIdUseCase implements IGetSprintsByProjectIdUseCase {
    constructor(
        @inject('ISprintRepository') private readonly _sprintRepository: ISprintRepository
    ) { }

    async execute(projectId: string): Promise<ISprintEntity[]> {
        const sprints = await this._sprintRepository.getSprintsByProjectId(projectId);
        return SprintDTOmapper.toResponseDTOs(sprints);
    }
}
