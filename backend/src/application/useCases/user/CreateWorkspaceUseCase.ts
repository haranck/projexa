import { ICreateWorkspaceUseCase } from "../../interface/user/ICreateWorkspaceUseCase";
import { IWorkspaceEntity } from "../../../domain/entities/IWorkspaceEntity";
import { CreateWorkspaceDTO } from "../../../application/dtos/user/requestDTOs/CreateWorkspaceDTO";
import { IWorkspaceRedisRepository } from "../../../domain/interfaces/repositories/IWorkspaceRedisRepository";
import { injectable, inject } from "tsyringe";

@injectable()
export class CreateWorkspaceUseCase implements ICreateWorkspaceUseCase {
    constructor(
        @inject('IWorkspaceRedisRepository') private _workspaceRedisRepository:IWorkspaceRedisRepository,
    ){}
    async execute(workspace:CreateWorkspaceDTO):Promise<IWorkspaceEntity>{
        return await this._workspaceRedisRepository.save(workspace);
    }
}

