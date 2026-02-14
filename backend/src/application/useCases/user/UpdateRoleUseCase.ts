import { UpdateRoleDTO } from "../../dtos/user/requestDTOs/UpdateRoleDTO";
import { IRoleEntity } from "../../../domain/entities/IRoleEntity";
import { IRoleRepository } from "../../../domain/interfaces/repositories/IRoleRepository";
import { injectable, inject } from "tsyringe";
import { IUpdateRoleUseCase } from "../../interface/user/IUpdateRoleUseCase";
import { USER_ERRORS } from "../../../domain/constants/errorMessages";

@injectable()
export class UpdateRoleUseCase implements IUpdateRoleUseCase {
    constructor(
        @inject("IRoleRepository") private _roleRepository: IRoleRepository
    ) { }

    async execute(dto: UpdateRoleDTO): Promise<IRoleEntity> {
        const existingRole = await this._roleRepository.getRoleById(dto.roleId)
        if (!existingRole) throw new Error(USER_ERRORS.ROLE_NOT_FOUND)

        if (!dto.permissions || dto.permissions.length === 0) throw new Error(USER_ERRORS.PERMISSION_CANNOT_EMPTY)

        if (existingRole.name !== dto.name) {

            const duplicate = await this._roleRepository.getRoleByName(dto.name!);

            if (duplicate) {
                throw new Error(USER_ERRORS.ROLE_NAME_ALREADY_EXISTS);
            }
        }

        const updatedRole = await this._roleRepository.updateRole(dto.roleId, dto);
        if (!updatedRole) throw new Error(USER_ERRORS.ROLE_NOT_FOUND)

        return updatedRole;
    }
}
