export interface WebhookEventInputDTO {
    payload: Buffer;
    signature: string;
}