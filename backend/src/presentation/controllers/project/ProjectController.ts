import { Response } from "express";
import { injectable, inject } from "tsyringe";
import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import { ERROR_MESSAGES } from "../../../domain/constants/errorMessages";
import { MESSAGES } from "../../../domain/constants/messages";
import { AuthRequest } from "../../../presentation/middleware/auth/authMiddleware";
import { ICreateProjectUseCase } from "../../../application/interface/project/ICreateProjectUseCase";
import { IGetAllProjectsUseCase } from "../../../application/interface/project/IGetAllProjectsUseCase";
import { IUpdateProjectUseCase } from "../../../application/interface/project/IUpdateProjectUseCase";
import { IDeleteProjectUseCase } from "../../../application/interface/project/IDeleteProjectUseCase";
import { IAddProjectMemberUseCase } from "../../../application/interface/project/IAddProjectMemberUseCase";
import { IRemoveProjectMemberUseCase } from "../../../application/interface/project/IRemoveProjectMemberUseCase";
import { IUpdateProjectMemberRoleUseCase } from "../../../application/interface/project/IUpdateProjectMemberRoleUseCase";

@injectable() 
export class ProjectController {
    constructor(
        @inject("ICreateProjectUseCase") private readonly _createProjectUseCase: ICreateProjectUseCase,
        @inject("IGetAllProjectsUseCase") private readonly _getAllProjectsUseCase: IGetAllProjectsUseCase,
        @inject("IUpdateProjectUseCase") private readonly _updateProjectUseCase: IUpdateProjectUseCase,
        @inject("IDeleteProjectUseCase") private readonly _deleteProjectUseCase: IDeleteProjectUseCase,
        @inject("IAddProjectMemberUseCase") private readonly _addProjectMemberUseCase: IAddProjectMemberUseCase,
        @inject("IRemoveProjectMemberUseCase") private readonly _removeProjectMemberUseCase: IRemoveProjectMemberUseCase,
        @inject("IUpdateProjectMemberRoleUseCase") private readonly _updateProjectMemberRoleUseCase: IUpdateProjectMemberRoleUseCase
    ) { }

    createProject = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { projectName, key, description, workspaceId, members } = req.body;
            const createdBy = req.user?.userId;
            if (!createdBy) throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
            const result = await this._createProjectUseCase.execute({ projectName, key, description, createdBy, workspaceId, members });
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.PROJECT.PROJECT_CREATED_SUCCESSFULLY, data: result });
        } catch (error: unknown) {
            const err = error as { status?: number; message: string };
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }

    getAllProjects = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { page, limit, search } = req.query;
            const { workspaceId } = req.params
            const result = await this._getAllProjectsUseCase.execute({ workspaceId, page: page as string, limit: limit as string, search: search as string })

            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.PROJECT.GET_ALL_PROJECTS, data: result });
        } catch (error: unknown) {
            const err = error as { status?: number; message: string };
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }

    updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { projectId } = req.params
            const { projectName, description, key } = req.body
            const result = await this._updateProjectUseCase.execute({ projectId, projectName, description, key })
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.PROJECT.PROJECT_UPDATED_SUCCESSFULLY, data: result })
        } catch (error: unknown) {
            const err = error as { status?: number; message: string };
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }

    deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { projectId } = req.params
            await this._deleteProjectUseCase.execute(projectId)
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.PROJECT.PROJECT_DELETED_SUCCESSFULLY })
        } catch (error: unknown) {
            const err = error as { status?: number; message: string };
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }

    addProjectMember = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { projectId } = req.params
            const { userId, roleId } = req.body
            await this._addProjectMemberUseCase.execute({ projectId, userId, roleId })
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.PROJECT.PROJECT_MEMBER_ADDED_SUCCESSFULLY })
        } catch (error: unknown) {
            const err = error as { status?: number; message: string };
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }

    removeProjectMember = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { projectId, userId } = req.params
            await this._removeProjectMemberUseCase.execute({ projectId, userId })
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.PROJECT.PROJECT_MEMBER_REMOVED_SUCCESSFULLY })
        } catch (error: unknown) {
            const err = error as { status?: number; message: string };
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }

    updateProjectMemberRole = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { projectId } = req.params;
            const { userId, roleId } = req.body;
            const result = await this._updateProjectMemberRoleUseCase.execute({ projectId, userId, roleId });
            console.log('updated data', result)
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.PROJECT.PROJECT_MEMBER_UPDATED_SUCCESSFULLY, data: result });
        } catch (error: unknown) {
            const err = error as { status?: number; message: string };
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }
}
