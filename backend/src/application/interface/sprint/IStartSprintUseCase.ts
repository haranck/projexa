import { StartSprintDTO } from "../../dtos/issue/requestDTOs/StartSprintDTO";
import { ISprintEntity } from "../../../domain/entities/Sprint/ISprintEntity";

export interface IStartSprintUseCase {
    execute(dto: StartSprintDTO): Promise<ISprintEntity>;
}