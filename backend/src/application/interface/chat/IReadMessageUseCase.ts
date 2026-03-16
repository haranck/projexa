export interface IReadMessageUseCase {
    execute(messageId: string, userId: string): Promise<void>;
}
