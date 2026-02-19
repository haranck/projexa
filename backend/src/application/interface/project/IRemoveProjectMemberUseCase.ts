export interface IRemoveProjectMemberUseCase {
    execute(data: { projectId: string; userId: string }): Promise<void>
}