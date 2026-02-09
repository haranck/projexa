export interface CreateCheckoutSessionInputDTO {
  priceId: string;
  customerEmail: string;
  customerId?: string;
  metadata?: Record<string, string>;
  successUrl: string;
  cancelUrl: string;
}