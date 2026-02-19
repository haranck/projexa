import { IRoleEntity } from "../../../domain/entities/IRoleEntity";

export interface IGetAllRolesUseCase {
    execute(): Promise<IRoleEntity[]>
}