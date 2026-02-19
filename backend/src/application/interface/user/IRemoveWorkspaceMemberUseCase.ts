import { RemoveMemberDTO } from "../../dtos/user/requestDTOs/RemoveMemberDTO";

export interface IRemoveWorkspaceMemberUseCase {
    execute(dto: RemoveMemberDTO): Promise<void>
}