import { injectable, inject } from "tsyringe";
import { IGetSprintsByProjectIdUseCase } from "../../interface/sprint/IGetSprintsByProjectIdUseCase";
import { ISprintRepository } from "../../../domain/interfaces/repositories/SprintRepo/ISprintRepository";
import { ISprintEntity } from "../../../domain/entities/Sprint/ISprintEntity";

@injectable()
export class GetSprintsByProjectIdUseCase implements IGetSprintsByProjectIdUseCase {
    constructor(
        @inject('ISprintRepository') private readonly _sprintRepository: ISprintRepository
    ) { }

    async execute(projectId: string): Promise<ISprintEntity[]> {
        return await this._sprintRepository.getSprintsByProjectId(projectId);
    }
}
