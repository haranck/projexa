import { Response } from "express";
import { injectable, inject } from "tsyringe";
import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import { MESSAGES } from "../../../domain/constants/messages";
import { AuthRequest } from "../../../presentation/middleware/auth/authMiddleware";
import { IMoveIssueToSprintUseCase } from "../../../application/interface/sprint/IMoveIssueToSprintUseCase";
import { ERROR_MESSAGES } from "../../../domain/constants/errorMessages";
import { ICreateSprintUseCase } from "../../../application/interface/sprint/ICreateSprintuseCase";
import { IDeleteSprintUseCase } from "../../../application/interface/sprint/IDeleteSprintUseCase";
import { IStartSprintUseCase } from "../../../application/interface/sprint/IStartSprintUseCase";
import { IGetSprintsByProjectIdUseCase } from "../../../application/interface/sprint/IGetSprintsByProjectIdUseCase";
import { ICompleteSprintUseCase } from "../../../application/interface/sprint/ICompleteSprintUseCase";

@injectable()
export class SprintController {
    constructor(
        @inject('IMoveIssueToSprintUseCase') private readonly _moveIssueToSprintUseCase: IMoveIssueToSprintUseCase,
        @inject('ICreateSprintUseCase') private readonly _createSprintUseCase: ICreateSprintUseCase,
        @inject('IDeleteSprintUseCase') private readonly _deleteSprintUseCase: IDeleteSprintUseCase,
        @inject('IStartSprintUseCase') private readonly _startSprintUseCase: IStartSprintUseCase,
        @inject('IGetSprintsByProjectIdUseCase') private readonly _getSprintsByProjectIdUseCase: IGetSprintsByProjectIdUseCase,
        @inject('ICompleteSprintUseCase') private readonly _completeSprintUseCase: ICompleteSprintUseCase
    ) { }

    moveIssueToSprint = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { issueId } = req.params
            const { sprintId } = req.body
            const userId = req.user?.userId
            if (!userId) {
                throw new Error(ERROR_MESSAGES.UNAUTHORIZED)
            }
            const result = await this._moveIssueToSprintUseCase.execute({ issueId: issueId as string, sprintId: sprintId as string }, userId)
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.ISSUE.ISSUE_MOVED_TO_SPRINT_SUCCESSFULLY, data: result })
        } catch (error: unknown) {
            const err = error as { status?: number; message: string }
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message })
        }
    }

    createSprint = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { workspaceId, projectId } = req.body
            const userId = req.user?.userId
            if (!userId) {
                throw new Error(ERROR_MESSAGES.UNAUTHORIZED)
            }
            if (!workspaceId || !projectId) {
                throw new Error(ERROR_MESSAGES.INVALID_REQUEST)
            }
            const result = await this._createSprintUseCase.execute({ workspaceId: workspaceId, projectId, createdBy: userId }, userId)
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.SPRINT.SPRINT_CREATED_SUCCESSFULLY, data: result })
        } catch (error: unknown) {
            const err = error as { status?: number; message: string }
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message })
        }
    }

    deleteSprint = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { sprintId } = req.params
            const result = await this._deleteSprintUseCase.execute(sprintId as string)
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.SPRINT.SPRINT_DELETED_SUCCESSFULLY, data: result })
        } catch (error: unknown) {
            const err = error as { status?: number; message: string }
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message })
        }
    }

    startSprint = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { sprintId } = req.params
            const userId = req.user?.userId
            const { startDate, endDate, goal } = req.body
            const result = await this._startSprintUseCase.execute({ sprintId: sprintId as string, startDate, endDate, goal }, userId!)
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.SPRINT.SPRINT_STARTED_SUCCESSFULLY, data: result })
        } catch (error: unknown) {
            const err = error as { status?: number; message: string }
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message })
        }
    }

    getSprintsByProjectId = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { projectId } = req.params
            const result = await this._getSprintsByProjectIdUseCase.execute(projectId as string)
            res.status(HTTP_STATUS.OK).json({ message: "Sprints fetched successfully", data: result })
        } catch (error: unknown) {
            const err = error as { status?: number; message: string }
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message })
        }
    }

    completeSprint = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { sprintId } = req.params
            const { moveIncompleteIssuesToSprintId } = req.body
            const result = await this._completeSprintUseCase.execute({ sprintId: sprintId as string, moveIncompleteIssuesToSprintId })
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.SPRINT.SPRINT_COMPLETED_SUCCESSFULLY, data: result })
        } catch (error: unknown) {
            const err = error as { status?: number; message: string }
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message })
        }
    }

}