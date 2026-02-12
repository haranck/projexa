export interface IExportAdminPaymentsPDFUseCase {
    execute(params: { startDate?: string; endDate?: string; search?: string; }): Promise<Buffer>;
}
