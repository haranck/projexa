export interface AdminPaymentResponseDTO {
    invoiceId: string;
    userName: string;
    workspaceName: string;
    amount: number;
    currency: string;
    status: string;
    paymentMethod: string;
    paidAt: Date;
    stripeCustomerId?: string;
}

export interface GetAdminPaymentsResponseDTO {
    data: AdminPaymentResponseDTO[];
    meta: {
        totalDocs: number;
        totalPages: number;
        page: number;
        limit: number;
    };
}
