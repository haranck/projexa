import { injectable, inject } from "tsyringe";
import { IRoleRepository } from "../../../domain/interfaces/repositories/IRoleRepository"
import { IDeleteRoleUseCase } from "../../interface/user/IDeleteRoleUseCase"
import { USER_ERRORS } from "../../../domain/constants/errorMessages"

@injectable()
export class DeleteRoleUseCase implements IDeleteRoleUseCase {
    constructor(@inject("IRoleRepository") private _roleRepository: IRoleRepository) { }

    async execute(roleId: string): Promise<void> {
        const role = await this._roleRepository.getRoleById(roleId);
        if (!role) throw new Error(USER_ERRORS.ROLE_NOT_FOUND);

        /*
        if role is assigned to any project member

        const assigned = await this.projectMemberRepo.existsByRoleId(roleId);

        if (assigned) {
            throw new Error(
                "Cannot delete role. It is assigned to project members."
            );
        }
        */
        
        const deleted = await this._roleRepository.deleteRole(roleId)
        if(!deleted) throw new Error(USER_ERRORS.ROLE_NOT_FOUND)

    }
}

