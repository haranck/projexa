import { GetAdminPaymentsDTO } from "../../dtos/admin/requestDTOs/GetAdminPaymentsDTO";
import { AdminPaymentResponseDTO } from "../../dtos/admin/responseDTOs/AdminPaymentResponseDTO";

export interface IGetAdminPaymentsUseCase {
    execute(params: GetAdminPaymentsDTO): Promise<AdminPaymentResponseDTO[]>
}