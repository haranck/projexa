import { GetPlanResponseDTO } from "../../dtos/admin/responseDTOs/GetPlanResponseDTO";

export interface IGetPlanUseCase {
    execute(): Promise<{ data: GetPlanResponseDTO[] }>
}
