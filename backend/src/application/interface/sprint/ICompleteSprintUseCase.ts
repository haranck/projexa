import { CompleteSprintDTO } from "../../dtos/issue/requestDTOs/CompleteSprintDTO";

export interface ICompleteSprintUseCase {
  execute(data: CompleteSprintDTO): Promise<void>;
}

