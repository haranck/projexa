import { AdminLoginResponseDTO } from "../../dtos/admin/responseDTOs/AdminLoginResponseDTO";
import { CreatePlanResponseDTO } from "../../dtos/admin/responseDTOs/CreatePlanResponseDTO";
import { GetPlanResponseDTO } from "../../dtos/admin/responseDTOs/GetPlanResponseDTO";
import { UpdatePlanResponseDTO } from "../../dtos/admin/responseDTOs/UpdatePlanResponseDTO";
import { IPlanEntity } from "../../../domain/entities/IPlanEntity";
import { AdminPaymentResponseDTO, GetAdminPaymentsResponseDTO } from "../../dtos/admin/responseDTOs/AdminPaymentResponseDTO";

export class AdminDTOmapper {
    static toLoginResponseDTO(accessToken: string, refreshToken: string, email: string): AdminLoginResponseDTO {
        return {
            accessToken,
            refreshToken,
            admin: {
                id: 'ADMIN',
                email
            }
        };
    }

    static toCreatePlanResponseDTO(plan: IPlanEntity): CreatePlanResponseDTO {
        return {
            id: plan._id!,
            name: plan.name,
            price: plan.price,
            maxMembers: plan.maxMembers,
            maxProjects: plan.maxProjects,
            interval: plan.interval,
            features: plan.features,
            isActive: plan.isActive,
            createdAt: plan.createdAt!,
            updatedAt: plan.updatedAt!
        };
    }

    static toUpdatePlanResponseDTO(plan: IPlanEntity): UpdatePlanResponseDTO {
        return {
            id: plan._id!,
            name: plan.name,
            price: plan.price,
            maxMembers: plan.maxMembers,
            maxProjects: plan.maxProjects,
            interval: plan.interval,
            features: plan.features,
            isActive: plan.isActive,
            createdAt: plan.createdAt!,
            updatedAt: plan.updatedAt!
        };
    }

    static toGetPlanResponseDTO(plans: IPlanEntity[]): GetPlanResponseDTO[] {
        return plans.map(plan => ({
            id: plan._id?.toString(),
            name: plan.name,
            price: plan.price,
            maxMembers: plan.maxMembers,
            maxProjects: plan.maxProjects,
            interval: plan.interval,
            features: plan.features,
            isActive: plan.isActive
        }));
    }

    static toGetAdminPaymentsResponseDTO(data: AdminPaymentResponseDTO[], meta: { totalDocs: number; totalPages: number; page: number; limit: number }): GetAdminPaymentsResponseDTO {
        return {
            data,
            meta
        };
    }
}
