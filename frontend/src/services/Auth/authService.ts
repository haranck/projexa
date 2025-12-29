import AxiosInstance from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";

interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export const registerUser = async (data: RegisterPayload) => {
  const response = await AxiosInstance.post(API_ROUTES.AUTH.REGISTER, data);
  return response.data;
};

export const verifyOtp = async (data: { email: string; otp: string }) => {
  const response = await AxiosInstance.post(API_ROUTES.AUTH.VERIFY_EMAIL, data);
  console.log('response', response)
  return response.data;
};

export const resendOtp = async (email: string) => {
  const response = await AxiosInstance.post(API_ROUTES.AUTH.RESEND_OTP, { email });
  return response.data;
};

export const googleLogin = async (idToken: string) => {
  const response = await AxiosInstance.post(API_ROUTES.AUTH.GOOGLE_LOGIN, { idToken });
  console.log('response', response)
  return response.data;
};


//       accessToken,
//       refreshToken,
//       user: {
//         id: user.id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         isEmailVerified: user.isEmailVerified,
//       }
