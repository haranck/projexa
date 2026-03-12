export interface IDeleteMessageUseCase {
    execute(messageId: string, requesterId: string): Promise<void>;
}
