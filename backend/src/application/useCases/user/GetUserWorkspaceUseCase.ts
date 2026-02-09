import { IGetUserWorkspaceUseCase } from "../../interface/user/IGetUserWorkspaceUseCase";
import { IWorkspaceRepository } from "../../../domain/interfaces/repositories/IWorkspaceRepository";
import { injectable, inject } from "tsyringe";
import { IWorkspaceEntity } from "../../../domain/entities/IWorkspaceEntity";

@injectable()
export class GetUserWorkspaceUseCase implements IGetUserWorkspaceUseCase {
    constructor(
        @inject('IWorkspaceRepository') private _workSpaceRepository:IWorkspaceRepository
    ){} 
    async execute(userId: string): Promise<IWorkspaceEntity[]> {
        const workspaces = await this._workSpaceRepository.getWorkspacesByUserId(userId)
        return workspaces;
    }
}