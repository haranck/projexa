import { API_ROUTES } from "../../constants/apiRoutes";
import { AxiosInstance } from "../../axios/axios";

interface createWorkspacePayload {
    workspaceName: string,
    description: string
}

interface selectPlanPayload {
    workspaceName: string,
    planId: string
}

interface createCheckoutSessionPayload {
    workspaceName: string,
    successUrl: string,
    cancelUrl: string,
    planId: string
}

interface upgradePlanPayload {
    workspaceId: string,
    newPriceId: string
}

interface inviteMembersPayload {
    workspaceId: string,
    email: string
}

interface completeProfilePayload {
    firstName: string,
    lastName: string,
    password: string,
}

interface removeWorkspaceMemberPayload {
    workspaceId: string,
    memberId: string
}

interface createRolePayload {
    name: string,
    permissions: string[]
}

interface updateRolePayload {
    roleId: string,
    name: string,
    permissions: string[]
}

export const createWorkspace = async (data: createWorkspacePayload) => {
    const response = await AxiosInstance.post(API_ROUTES.WORKSPACE.CREATE_WORKSPACE, {
        name: data.workspaceName,
        description: data.description
    })
    return response.data;
}

export const getPlans = async () => {
    const response = await AxiosInstance.get(API_ROUTES.WORKSPACE.GET_PLANS)
    return response.data;
}

export const selectPlan = async (data: selectPlanPayload) => {
    const response = await AxiosInstance.post(API_ROUTES.WORKSPACE.SELECT_PLAN, data)
    return response.data;
}

export const createCheckoutSession = async (data: createCheckoutSessionPayload) => {
    const response = await AxiosInstance.post(API_ROUTES.WORKSPACE.CREATE_CHECKOUT_SESSION, data)
    return response.data;
}

export const getUserWorkspaces = async () => {
    const response = await AxiosInstance.get(API_ROUTES.WORKSPACE.GET_USER_WORKSPACES)
    return response.data;
}

export const upgradePlan = async (data: upgradePlanPayload) => {
    const response = await AxiosInstance.post(API_ROUTES.WORKSPACE.UPGRADE_PLAN, data)
    return response.data;
}

export const getWorkspaceInvoices = async (workspaceId: string) => {
    const response = await AxiosInstance.get(API_ROUTES.WORKSPACE.GET_WORKSPACE_INVOICES.replace(":workspaceId", workspaceId))
    return response.data;
}

export const inviteMembers = async (data: inviteMembersPayload) => {
    const response = await AxiosInstance.post(API_ROUTES.WORKSPACE.INVITE_MEMBER.replace(":id", data.workspaceId), { email: data.email })
    return response.data;
}

export const acceptInvite = async (token: string) => {
    const response = await AxiosInstance.get(API_ROUTES.WORKSPACE.ACCEPT_INVITE.replace(":token", token))
    return response.data;
}

export const completeProfile = async (data: completeProfilePayload) => {
    const response = await AxiosInstance.post(API_ROUTES.WORKSPACE.COMPLETE_PROFILE, data)
    return response.data;
}

export const getWorkspaceMembers = async (workspaceId: string) => { 
    const response = await AxiosInstance.get(API_ROUTES.WORKSPACE.GET_WORKSPACE_MEMBERS.replace(":workspaceId", workspaceId))
    return response.data;
}

export const removeWorkspaceMember = async (data: removeWorkspaceMemberPayload) => {
    const response = await AxiosInstance.delete(API_ROUTES.WORKSPACE.REMOVE_MEMBER.replace(":workspaceId", data.workspaceId), { data: { memberId: data.memberId } })
    return response.data;
}

export const createRole = async (data: createRolePayload) => {
    const response = await AxiosInstance.post(API_ROUTES.WORKSPACE.CREATE_ROLE, data)
    return response.data;
}

export const updateRole = async (data: updateRolePayload) => {
    const response = await AxiosInstance.put(API_ROUTES.WORKSPACE.UPDATE_ROLE.replace(":roleId", data.roleId), data)
    return response.data;
}

export const deleteRole = async (roleId: string) => {
    const response = await AxiosInstance.delete(API_ROUTES.WORKSPACE.DELETE_ROLE.replace(":roleId", roleId))
    return response.data;
}

export const getRoles = async () => {
    const response = await AxiosInstance.get(API_ROUTES.WORKSPACE.GET_ROLES)
    return response.data;
}