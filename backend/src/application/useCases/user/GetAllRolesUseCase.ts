import { IRoleEntity } from "../../../domain/entities/IRoleEntity";
import { injectable, inject } from "tsyringe";
import { IRoleRepository } from "../../../domain/interfaces/repositories/IRoleRepository"
import { IGetAllRolesUseCase } from "../../interface/user/IGetAllRolesUseCase"
import { USER_ERRORS } from "../../../domain/constants/errorMessages";

@injectable()
export class GetAllRolesUseCase implements IGetAllRolesUseCase {
    constructor(
        @inject('IRoleRepository') private _roleRepository: IRoleRepository
    ) { }
    async execute(): Promise<IRoleEntity[]> {
        const roles = await this._roleRepository.getAllRoles()
        if (!roles) throw new Error(USER_ERRORS.ROLE_FETCHING_FAILED)
        return roles
    }
}