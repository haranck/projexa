import { IAcceptInviteUseCase } from '../../interface/user/IAcceptInviteUseCase';
import { injectable, inject } from 'tsyringe';
import { IWorkspaceInviteRepository } from '../../../domain/interfaces/repositories/IWorkspaceInviteRepository';
import { IWorkspaceRepository } from '../../../domain/interfaces/repositories/IWorkspaceRepository';
import { IUserRepository } from '../../../domain/interfaces/repositories/IUserRepository';
import { USER_ERRORS } from '../../../domain/constants/errorMessages';
import { AcceptInviteResponseDTO } from '../../dtos/user/responseDTOs/AcceptInviteResponseDTO';
import { IJwtService } from '../../../domain/interfaces/services/IJwtService';

@injectable()
export class AcceptInviteUseCase implements IAcceptInviteUseCase {
    constructor(
        @inject('IWorkspaceInviteRepository') private readonly _workspaceInviteRepo: IWorkspaceInviteRepository,
        @inject('IWorkspaceRepository') private readonly _workspaceRepo: IWorkspaceRepository,
        @inject('IUserRepository') private readonly _userRepository: IUserRepository,
        @inject('IJwtService') private readonly _tokenService: IJwtService
    ) { }

    async execute(token: string): Promise<AcceptInviteResponseDTO> {
        const invite = await this._workspaceInviteRepo.findByToken(token)
        if (!invite) throw new Error(USER_ERRORS.INVITE_INVALIDATION)
        if (invite.expiresAt < new Date()) throw new Error(USER_ERRORS.INVITE_EXPIRED)

        let user = await this._userRepository.findByEmail(invite.email)

        if (invite.used) {
            if (!user) throw new Error(USER_ERRORS.INVITE_ALREADY_USED)

            const workspace = await this._workspaceRepo.getWorkspaceById(invite.workspaceId)
            const isMember = workspace?.members?.includes(user.id!)

            if (!isMember) {
                throw new Error(USER_ERRORS.INVITE_ALREADY_USED)
            }
        } else {
            if (!user) {
                user = await this._userRepository.createUser({ email: invite.email })
            }

            await this._workspaceRepo.addMemberToWorkspace(invite.workspaceId, user.id!)
            await this._workspaceInviteRepo.markAsUsed(invite.id)
        }

        const acccessToken = this._tokenService.signAccessToken({ userId: user!.id!, email: user!.email })
        const refreshToken = this._tokenService.signRefreshToken({ userId: user!.id!, email: user!.email })

        return {
            accessToken: acccessToken,
            refreshToken: refreshToken,
            workspaceId: invite.workspaceId,
            user: {
                id: user!.id!,
                email: user!.email,
                firstName: user!.firstName,
                lastName: user!.lastName,
                avatarUrl: user!.avatarUrl
            }
        }
    }
}