import { InviteMemberDTO } from "../../dtos/user/requestDTOs/InviteMemberDTO";

export interface IInviteMemberUseCase {
    execute(inviterId: string, dto: InviteMemberDTO): Promise<void>;
}
