import { RoleResponseDTO } from "../../dtos/user/responseDTOs/RoleResponseDTO";
import { injectable, inject } from "tsyringe";
import { IRoleRepository } from "../../../domain/interfaces/repositories/IRoleRepository"
import { IGetAllRolesUseCase } from "../../interface/user/IGetAllRolesUseCase"
import { USER_ERRORS } from "../../../domain/constants/errorMessages";
import { UserDTOmapper } from "../../mappers/User/UserDTOmapper";

@injectable()
export class GetAllRolesUseCase implements IGetAllRolesUseCase {
    constructor(
        @inject('IRoleRepository') private _roleRepository: IRoleRepository
    ) { }
    async execute(): Promise<RoleResponseDTO[]> {
        const roles = await this._roleRepository.getAllRoles()
        if (!roles) throw new Error(USER_ERRORS.ROLE_FETCHING_FAILED)
        return UserDTOmapper.toRoleListResponseDTO(roles)
    }
}