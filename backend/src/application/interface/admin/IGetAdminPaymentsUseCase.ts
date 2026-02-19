import { GetAdminPaymentsDTO } from "../../dtos/admin/requestDTOs/GetAdminPaymentsDTO";
import { GetAdminPaymentsResponseDTO } from "../../dtos/admin/responseDTOs/AdminPaymentResponseDTO";

export interface IGetAdminPaymentsUseCase {
    execute(params: GetAdminPaymentsDTO): Promise<GetAdminPaymentsResponseDTO>;
}
