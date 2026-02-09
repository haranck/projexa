import { IInviteMemberUseCase } from '../../interface/user/IInviteMemberUseCase';
import { injectable, inject } from 'tsyringe'
import { IWorkspaceInviteRepository } from "../../../domain/interfaces/repositories/IWorkspaceInviteRepository";
import { IEmailService } from "../../../domain/interfaces/services/IEmailService";
import { InviteMemberDTO } from "../../dtos/user/requestDTOs/InviteMemberDTO";
import { USER_ERRORS } from "../../../domain/constants/errorMessages";
import { IWorkspaceInviteEntity } from "../../../domain/entities/IWorkspaceInviteEntity";
import crypto from 'crypto'
import { IWorkspaceRepository } from "../../../domain/interfaces/repositories/IWorkspaceRepository";

@injectable()
export class InviteMemberUseCase implements IInviteMemberUseCase {
    constructor(
        @inject('IWorkspaceInviteRepository') private readonly _workspaceInviteRepo: IWorkspaceInviteRepository,
        @inject('IEmailService') private readonly _emailService: IEmailService,
        @inject('IWorkspaceRepository') private readonly _workspaceRepo: IWorkspaceRepository
    ) { }

    async execute(inviterId: string, dto: InviteMemberDTO): Promise<void> {
        const workspaces = await this._workspaceRepo.getWorkspacesByUserId(inviterId)
        const targetWorkspace = workspaces.find(w => w._id?.toString() === dto.workspaceId);

        if (!targetWorkspace || targetWorkspace.ownerId?.toString() !== inviterId) {
            throw new Error("Only workspace owner can do Inviting people");
        }

        const existing = await this._workspaceInviteRepo.findValidInvite(dto.workspaceId, dto.email)
        if (existing) throw new Error(USER_ERRORS.ALREADY_INVITED)

        const token = crypto.randomBytes(64).toString('hex')

        const inviteEntity: IWorkspaceInviteEntity = {
            id: '',
            workspaceId: dto.workspaceId,
            email: dto.email,
            role: 'MEMBER',
            token: token,
            invitedBy: inviterId,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            used: false,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        await this._workspaceInviteRepo.createInvite(inviteEntity)
        await this._emailService.sendInvitationEmail(dto.email, token)
    }
}
