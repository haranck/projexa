export interface IRemoveProjectMemberUseCase {
    execute(data: { projectId: string; userId: string }, requesterId: string): Promise<void>
}