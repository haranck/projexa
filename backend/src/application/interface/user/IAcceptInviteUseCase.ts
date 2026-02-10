import { AcceptInviteResponseDTO } from "../../dtos/user/responseDTOs/AcceptInviteResponseDTO";

export interface IAcceptInviteUseCase {
    execute(token:string): Promise<AcceptInviteResponseDTO>;
}