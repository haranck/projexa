import { IRoleEntity } from "../../domain/entities/IRoleEntity";
import { RoleDocument } from "../database/mongo/models/RoleModel";
import { Types } from "mongoose";
import { CreateRoleDTO } from "../../application/dtos/user/requestDTOs/CreateRoleDTO";
import { UpdateRoleDTO } from "../../application/dtos/user/requestDTOs/UpdateRoleDTO";

export class RoleMapper {
    static toEntity(doc: RoleDocument): IRoleEntity {
        return {
            id: doc._id.toString(),
            name: doc.name,
            permissions: doc.permissions,
            createdBy: doc.createdBy,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        };
    }

    static toPersistence(entity: Partial<IRoleEntity> | CreateRoleDTO): Partial<RoleDocument> {
        return {
            name: entity.name,
            permissions: entity.permissions,
            createdBy: entity.createdBy ? new Types.ObjectId(entity.createdBy) : undefined,
        };
    }

    static toUpdatePersistence(dto: UpdateRoleDTO): Partial<RoleDocument> {
        return {
            name: dto.name,
            permissions: dto.permissions,
        };
    }
}
