import { WorkspaceInvoicesResponseDTO } from "../../dtos/user/responseDTOs/WorkspaceInvoicesResponseDTO";

export interface IGetWorkspaceInvoicesUseCase {
    execute(workspaceId: string): Promise<WorkspaceInvoicesResponseDTO>;
}