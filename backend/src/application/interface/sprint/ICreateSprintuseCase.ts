import { ISprintEntity } from "../../../domain/entities/Sprint/ISprintEntity";
import { CreateSprintDTO } from "../../dtos/issue/requestDTOs/CreateSprintDTO";

export interface ICreateSprintUseCase {
  execute(dto: CreateSprintDTO): Promise<ISprintEntity>;
}