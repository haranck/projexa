import { IRoleRepository } from "../../../domain/interfaces/repositories/IRoleRepository";
import { CreateRoleDTO } from "../../dtos/user/requestDTOs/CreateRoleDTO";
import { IRoleEntity } from "../../../domain/entities/IRoleEntity";
import { injectable, inject } from "tsyringe";
import { ICreateRoleUseCase } from "../../interface/user/ICreateRoleUseCase";
import { USER_ERRORS } from "../../../domain/constants/errorMessages";

@injectable()
export class CreateRoleUseCase implements ICreateRoleUseCase {
    constructor(@inject("IRoleRepository") private _roleRepository: IRoleRepository) { }

    async execute(dto: CreateRoleDTO): Promise<IRoleEntity> {

        const existing = await this._roleRepository.getRoleByName(dto.name)
        if (existing) throw new Error(USER_ERRORS.ROLE_ALREADY_EXISTS)
        const role = await this._roleRepository.createRole(dto)
        return role
    }
}