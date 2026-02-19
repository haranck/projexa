import { IProjectEntity } from "../../../entities/Project/IProjectEntity";
import { CreateProjectDTO } from "../../../../application/dtos/project/requestDTOs/CreateProjectDTO";
import { UpdateProjectDTO } from "../../../../application/dtos/project/requestDTOs/UpdateProjectDTO";
import { GetAllProjectsDTO } from "../../../../application/dtos/project/requestDTOs/GetAllProjectsDTO";
import { GetAllProjectsResponseDTO } from "../../../../application/dtos/project/responseDTOs/GetAllProjectsResponseDTO";

export interface IProjectRepository {
    createProject(project: CreateProjectDTO): Promise<IProjectEntity>;
    getProjectById(id: string): Promise<IProjectEntity | null>;
    getProjectByWorkspaceId(workspaceId: string): Promise<IProjectEntity[]>
    updateProject(id: string, project: UpdateProjectDTO): Promise<IProjectEntity | null>;
    getProjectByKey(workspaceId: string, key: string): Promise<IProjectEntity | null>;
    deleteProject(id: string): Promise<IProjectEntity | null>;
    getAllProjects(params: GetAllProjectsDTO): Promise<GetAllProjectsResponseDTO>;
}
