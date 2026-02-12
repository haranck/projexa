export interface GetAdminPaymentsDTO {
  startDate?: string;
  endDate?: string;
  workspaceId?: string;
  page?: number;
  limit?: number;
  search?: string;
}
