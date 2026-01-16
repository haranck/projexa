import { GetUsersRequestDTO } from "../../dtos/admin/requestDTOs/GetUsersRequestDTO";
import { GetUsersResponseDTO } from "../../dtos/admin/responseDTOs/GetUsersResponseDTO";

export interface IGetUsersUseCase {
    execute(dto:GetUsersRequestDTO):Promise<GetUsersResponseDTO>;
} 