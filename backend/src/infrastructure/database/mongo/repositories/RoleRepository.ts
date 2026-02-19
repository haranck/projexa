import { IRoleRepository } from "../../../../domain/interfaces/repositories/IRoleRepository";
import { IRoleEntity } from "../../../../domain/entities/IRoleEntity";
import { BaseRepo } from "./base/BaseRepo";
import { RoleModel, RoleDocument } from "../models/RoleModel";
import { injectable } from "tsyringe";
import { WORKSPACE_ERRORS } from "../../../../domain/constants/errorMessages";
import { CreateRoleDTO } from "../../../../application/dtos/user/requestDTOs/CreateRoleDTO";
import { RoleMapper } from "../../../mappers/RoleMapper";
import { Model } from "mongoose";
import { UpdateRoleDTO } from "../../../../application/dtos/user/requestDTOs/UpdateRoleDTO";

@injectable()
export class RoleRepository extends BaseRepo<IRoleEntity> implements IRoleRepository {
    constructor() {
        super(RoleModel as unknown as Model<IRoleEntity>)
    }

    async createRole(role: CreateRoleDTO): Promise<IRoleEntity> {
        const id = await super.create({
            name: role.name,
            permissions: role.permissions,
            createdBy: role.createdBy
        } as IRoleEntity)
        const doc = await super.findById(id)
        if (!doc) throw new Error(WORKSPACE_ERRORS.WORKSPACE_NOT_FOUND);
        return RoleMapper.toEntity(doc as unknown as RoleDocument)
    }

    async getRoleById(id: string): Promise<IRoleEntity | null> {
        const doc = await super.findById(id)
        return doc ? RoleMapper.toEntity(doc as unknown as RoleDocument) : null
    }

    async getRoleByName(name: string): Promise<IRoleEntity | null> {
        const doc = await RoleModel.findOne({ name })
        return doc ? RoleMapper.toEntity(doc) : null
    }

    async getAllRoles(): Promise<IRoleEntity[]> {
        const docs = await RoleModel.find()
        return docs.map(doc => RoleMapper.toEntity(doc))
    }

    async updateRole(id: string, role: UpdateRoleDTO): Promise<IRoleEntity | null> {
        const doc = await super.update({
            name: role.name,
            permissions: role.permissions
        } as Partial<IRoleEntity>, id)
        return doc ? RoleMapper.toEntity(doc as unknown as RoleDocument) : null
    }

    async deleteRole(id: string): Promise<IRoleEntity | null> {
        const doc = await super.deleteById(id)
        return doc ? RoleMapper.toEntity(doc as unknown as RoleDocument) : null
    }
}

