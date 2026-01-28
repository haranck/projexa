export interface CreateCheckoutSessionInputDTO {
  priceId: string;
  customerEmail: string;
  metadata?: Record<string, string>;
  successUrl: string;
  cancelUrl: string;
}