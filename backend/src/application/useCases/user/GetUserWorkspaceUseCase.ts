import { IGetUserWorkspaceUseCase } from "../../interface/user/IGetUserWorkspaceUseCase";
import { IWorkspaceRepository } from "../../../domain/interfaces/repositories/IWorkspaceRepository";
import { injectable, inject } from "tsyringe";
import { WorkspaceResponseDTO } from "../../dtos/user/responseDTOs/WorkspaceResponseDTO";
import { UserDTOmapper } from "../../mappers/User/UserDTOmapper";

@injectable()
export class GetUserWorkspaceUseCase implements IGetUserWorkspaceUseCase {
    constructor(
        @inject('IWorkspaceRepository') private _workSpaceRepository: IWorkspaceRepository
    ) {}
    async execute(userId: string): Promise<WorkspaceResponseDTO[]> {
        const workspaces = await this._workSpaceRepository.getWorkspacesByUserId(userId)
        return UserDTOmapper.toWorkspaceListResponseDTO(workspaces);
    }
}