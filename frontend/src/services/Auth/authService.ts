import { AxiosInstance } from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";

interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}
interface ForgotPasswordPayload{
  email:string
}
interface verifyOtpPayload{
  email:string
  otp:string
}
interface resendOtpPayload{
  email:string
}
interface loginPayload{
  email:string
  password:string
}
interface googleLoginPayload{
  idToken:string
}

export const registerUser = async (data: RegisterPayload) => {
  const response = await AxiosInstance.post(API_ROUTES.AUTH.REGISTER, data);
  return response.data;
};

export const verifyOtp = async (data: verifyOtpPayload) => {
  const response = await AxiosInstance.post(API_ROUTES.AUTH.VERIFY_EMAIL, data);
  return response.data;
};

export const resendOtp = async (data: resendOtpPayload) => {
  const response = await AxiosInstance.post(API_ROUTES.AUTH.RESEND_OTP, data);
  return response.data;
};

export const googleLogin = async (data: googleLoginPayload) => {
  const response = await AxiosInstance.post(API_ROUTES.AUTH.GOOGLE_LOGIN, data);
  return response.data;
};

export const loginUser = async (data: loginPayload) => {
  const response = await AxiosInstance.post(API_ROUTES.AUTH.LOGIN, data);
  return response.data;
};

export const forgotPassword = async(data:ForgotPasswordPayload) =>{
  const response = await AxiosInstance.post(API_ROUTES.AUTH.FORGOT_PASSWORD,data)
  return response.data
}


