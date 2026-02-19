export interface CreateProjectDTO {
    projectName: string;
    key: string;
    description: string;
    workspaceId: string;
    createdBy: string;
    members?:{
        userId:string;
        roleId:string;
    }[]
}