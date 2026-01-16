export interface IUnblockUserUseCase {
    execute(userId: string): Promise<void>;
}