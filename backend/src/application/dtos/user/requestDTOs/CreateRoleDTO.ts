import { ProjectPermission } from "../../../../domain/enums/ProjectPermission";

export interface CreateRoleDTO {
    name: string;
    permissions: ProjectPermission[];
    createdBy: string;
}