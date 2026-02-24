import { Response } from "express";
import { injectable, inject } from "tsyringe";
import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import { ERROR_MESSAGES } from "../../../domain/constants/errorMessages";
import { MESSAGES } from "../../../domain/constants/messages";
import { AuthRequest } from "../../../presentation/middleware/auth/authMiddleware";
import { ICreateIssueUseCase } from "../../../application/interface/Issue/ICreateIssueUseCase";
import { CreateIssueDTO } from "../../../application/dtos/issue/requestDTOs/CreateIssueDTO";
import { IAttachmentUploadUrlUseCase } from "../../../application/interface/Issue/IAttachementUploadUrlUseCase";
import { AttachmentUploadUrlDTO } from "../../../application/dtos/issue/requestDTOs/AttachmentUploadUrlDTO";
import { IUpdateEpicUseCase } from "../../../application/interface/Issue/IUpdateEpicUseCase"
import { UpdateEpicDTO } from "../../../application/dtos/issue/requestDTOs/UpdateEpicDTO";
import { IDeleteIssueUseCase } from "../../../application/interface/Issue/IDeleteIssueUseCase";
import { IGetAllIssuesUseCase } from "../../../application/interface/Issue/IGetAllIssuesUseCase";
import { IMoveIssueToSprintUseCase } from "../../../application/interface/Issue/IMoveIssueToSprintUseCase";


@injectable()
export class IssueController {
    constructor(
        @inject('ICreateIssueUseCase') private readonly _createIssueUseCase: ICreateIssueUseCase,
        @inject('IAttachmentUploadUrlUseCase') private readonly _attachmentUploadUrlUseCase: IAttachmentUploadUrlUseCase,
        @inject('IUpdateEpicUseCase') private readonly _updateEpicUseCase: IUpdateEpicUseCase,
        @inject('IDeleteIssueUseCase') private readonly _deleteIssueUseCase: IDeleteIssueUseCase,
        @inject('IGetAllIssuesUseCase') private readonly _getAllIssuesUseCase: IGetAllIssuesUseCase,
        @inject('IMoveIssueToSprintUseCase') private readonly _moveIssueToSprintUseCase: IMoveIssueToSprintUseCase
    ) { }


    createIssue = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { projectId } = req.params
            const userId = req.user?.userId
            const dto: CreateIssueDTO = {
                ...req.body,
                projectId
            }
            if (!userId) throw new Error(ERROR_MESSAGES.UNAUTHORIZED)
            const result = await this._createIssueUseCase.execute(dto, userId)
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.ISSUE.ISSUE_CREATED_SUCCESSFULLY, data: result });
        } catch (error: unknown) {
            const err = error as { status?: number; message: string };
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }

    getAttachmentUploadUrl = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const dto: AttachmentUploadUrlDTO = req.body
            const userId = req.user?.userId
            if (!userId) throw new Error(ERROR_MESSAGES.UNAUTHORIZED)
            const result = await this._attachmentUploadUrlUseCase.execute(dto, userId)
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.ISSUE.ATTACHMENT_UPLOAD_URL_GENERATED_SUCCESSFULLY, data: result });
        } catch (error: unknown) {
            const err = error as { status?: number; message: string };
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }

    updateEpic = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { issueId } = req.params
            const dto: UpdateEpicDTO = req.body
            const result = await this._updateEpicUseCase.execute(issueId, dto)
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.ISSUE.EPIC_UPDATED_SUCCESSFULLY, data: result })
        } catch (error: unknown) {
            const err = error as { status?: number; message: string };
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }

    deleteIssue = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { issueId } = req.params
            const userId = req.user?.userId
            if (!userId) throw new Error(ERROR_MESSAGES.UNAUTHORIZED)
            const result = await this._deleteIssueUseCase.execute(issueId, userId)
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.ISSUE.EPIC_DELETED_SUCCESSFULLY, data: result })
        } catch (error: unknown) {
            const err = error as { status?: number; message: string };
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }

    getAllIssues = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { projectId } = req.params;
            const result = await this._getAllIssuesUseCase.execute(projectId);
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.ISSUE.ISSUES_FETCHED_SUCCESSFULLY, data: result });
        } catch (error: unknown) {
            const err = error as { status?: number; message: string };
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }

    moveIssueToSprint = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const {issueId} = req.params
            const{sprintId} = req.body
            const result = await this._moveIssueToSprintUseCase.execute({issueId,sprintId})
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.ISSUE.ISSUE_MOVED_TO_SPRINT_SUCCESSFULLY, data: result })
        } catch (error: unknown) {
            const err = error as { status?: number; message: string }
            res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message })
        }
    }
}
