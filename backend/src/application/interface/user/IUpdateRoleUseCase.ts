import { UpdateRoleDTO } from "../../dtos/user/requestDTOs/UpdateRoleDTO";
import { IRoleEntity } from "../../../domain/entities/IRoleEntity";

export interface IUpdateRoleUseCase {
    execute(dto: UpdateRoleDTO): Promise<IRoleEntity>
}

