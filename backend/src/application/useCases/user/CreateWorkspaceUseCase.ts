import { ICreateWorkspaceUseCase } from "../../interface/user/ICreateWorkspaceUseCase";
import { WorkspaceResponseDTO } from "../../dtos/user/responseDTOs/WorkspaceResponseDTO";
import { CreateWorkspaceDTO } from "../../../application/dtos/user/requestDTOs/CreateWorkspaceDTO";
import { IWorkspaceRedisRepository } from "../../../domain/interfaces/repositories/IWorkspaceRedisRepository";
import { injectable, inject } from "tsyringe";
import { UserDTOmapper } from "../../mappers/User/UserDTOmapper";

@injectable()
export class CreateWorkspaceUseCase implements ICreateWorkspaceUseCase {
    constructor(
        @inject('IWorkspaceRedisRepository') private _workspaceRedisRepository: IWorkspaceRedisRepository,
    ) { }
    async execute(workspace: CreateWorkspaceDTO): Promise<WorkspaceResponseDTO> {
        const saved = await this._workspaceRedisRepository.save(workspace);
        return UserDTOmapper.toWorkspaceResponseDTO(saved);
    }
}


