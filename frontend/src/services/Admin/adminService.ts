import { AxiosInstance } from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";
import type { UserResponse } from "../../types/user";

interface adminLoginPayload {
  email: string
  password: string
}
interface blockUserPayload {
  userId: string
}
interface GetUsersParams {
  page: number;
  limit: number;
  search?: string;
}

interface CreatePlan {
  name:string,
  price:string,
  interval:string,
  features:string[],
  maxMembers:number,
  maxProjects:number
}

export const adminLogin = async (data: adminLoginPayload) => {
  const response = await AxiosInstance.post(API_ROUTES.ADMIN.LOGIN, data);
  return response.data;
}

export const adminLogout = async () => {
  const response = await AxiosInstance.post(API_ROUTES.ADMIN.LOGOUT)
  return response.data
}

export const getUsers = async (params: GetUsersParams): Promise<UserResponse> => {
  const response = await AxiosInstance.get(API_ROUTES.ADMIN.GET_USERS, { params })
  return response.data
}

export const blockUser = async (data: blockUserPayload) => {
  const url = API_ROUTES.ADMIN.BLOCK_USER.replace(':userId', data.userId)
  const response = await AxiosInstance.post(url)
  return response.data
}

export const unblockUser = async (data: blockUserPayload) => {
  const url = API_ROUTES.ADMIN.UNBLOCK_USER.replace(':userId', data.userId)
  const response = await AxiosInstance.post(url)
  return response.data
}

export const createPlan = async (data:CreatePlan) => {
  const response = await AxiosInstance.post(API_ROUTES.ADMIN.CREATE_PLAN,data)
  return response.data
}

export const getPlans = async () => {
  const response = await AxiosInstance.get(API_ROUTES.ADMIN.GET_ALL_PLANS)
  return response.data
}