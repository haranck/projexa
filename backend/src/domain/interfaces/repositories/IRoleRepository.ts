import { IRoleEntity } from "../../entities/IRoleEntity";
import { CreateRoleDTO } from "../../../application/dtos/user/requestDTOs/CreateRoleDTO";
import { UpdateRoleDTO } from "../../../application/dtos/user/requestDTOs/UpdateRoleDTO";

export interface IRoleRepository {
    createRole(role: CreateRoleDTO): Promise<IRoleEntity>;
    getRoleById(id: string): Promise<IRoleEntity | null>;
    getRoleByName(name: string): Promise<IRoleEntity | null>;
    getAllRoles(): Promise<IRoleEntity[]>;
    updateRole(id: string, role: UpdateRoleDTO): Promise<IRoleEntity | null>;
    deleteRole(id: string): Promise<IRoleEntity | null>;
}