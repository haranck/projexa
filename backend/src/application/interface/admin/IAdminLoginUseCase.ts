import { AdminLoginDTO } from "../../dtos/admin/requestDTOs/AdminLoginDTO";
import { AdminLoginResponseDTO } from "../../dtos/admin/responseDTOs/AdminLoginResponseDTO";

export interface IAdminLoginUseCase{
    execute(dto:AdminLoginDTO):Promise<AdminLoginResponseDTO>
}
