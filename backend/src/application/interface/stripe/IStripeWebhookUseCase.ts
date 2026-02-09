export interface IStripeWebhookUseCase {
    execute(payload: Buffer, signature: string): Promise<void>;
}