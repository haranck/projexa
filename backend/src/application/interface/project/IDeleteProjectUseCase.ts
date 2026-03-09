export interface IDeleteProjectUseCase {
    execute(projectId: string, requesterId: string): Promise<void>;
}