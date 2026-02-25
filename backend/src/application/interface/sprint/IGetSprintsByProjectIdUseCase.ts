import { ISprintEntity } from "../../../domain/entities/Sprint/ISprintEntity";

export interface IGetSprintsByProjectIdUseCase {
    execute(projectId: string): Promise<ISprintEntity[]>;
}
