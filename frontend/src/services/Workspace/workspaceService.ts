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