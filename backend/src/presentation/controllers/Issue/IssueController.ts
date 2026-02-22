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

@injectable()
export class IssueController {
    constructor(
        @inject('ICreateIssueUseCase') private readonly _createIssueUseCase: ICreateIssueUseCase,
        @inject('IAttachmentUploadUrlUseCase') private readonly _attachmentUploadUrlUseCase: IAttachmentUploadUrlUseCase
    ) { }

    createIssue = async (req: AuthRequest, res: Response) => {
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

    getAttachmentUploadUrl = async (req: AuthRequest, res: Response) => {
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
}
