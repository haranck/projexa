import { ICreateWorkspaceUseCase } from "../../../application/interface/user/ICreateWorkspaceUseCase";
import { injectable, inject } from "tsyringe";
import { AuthRequest } from "../../middleware/auth/authMiddleware";
import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import { MESSAGES } from "../../../domain/constants/messages";
import { Response } from "express";

@injectable()
export class WorkspaceController {
    constructor(
        @inject("ICreateWorkspaceUseCase") private _createWorkspaceUseCase: ICreateWorkspaceUseCase
    ) { }
    async createWorkspace(req: AuthRequest, res: Response) {
        const ownerId = req.user?.userId;
        const workspace = await this._createWorkspaceUseCase.execute({
            name: req.body.name,
            description: req.body.description,
            ownerId: ownerId!
        });
        res.status(HTTP_STATUS.CREATED).json({
            message: MESSAGES.WORKSPACE.WORKSPACE_CREATED_SUCCESSFULLY,
            workspace
        });
    }
}