import { CreateRoleDTO } from "../../dtos/user/requestDTOs/CreateRoleDTO";
import { IRoleEntity } from "../../../domain/entities/IRoleEntity";

export interface ICreateRoleUseCase {
    execute(dto: CreateRoleDTO): Promise<IRoleEntity>;
}
