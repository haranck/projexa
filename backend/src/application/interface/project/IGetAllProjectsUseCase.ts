import { GetAllProjectsDTO } from "../../dtos/project/requestDTOs/GetAllProjectsDTO";
import { GetAllProjectsResponseDTO } from "../../dtos/project/responseDTOs/GetAllProjectsResponseDTO";

export interface IGetAllProjectsUseCase {
    execute(params: GetAllProjectsDTO): Promise<GetAllProjectsResponseDTO>;
}