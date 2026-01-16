import axios from "axios";
import { store } from "../store/store";
import { setAccessToken, clearAccessToken } from "../store/slice/tokenSlice";
import { USER_ERRORS } from "@/constants/errorMessages";


export const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});


AxiosInstance.interceptors.request.use((config) => {
  const token = store.getState().token.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 403 && message === USER_ERRORS.USER_BLOCKED) {
      store.dispatch(clearAccessToken());
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        if (response.status === 200) {
          const { accessToken } = response.data.data;
          store.dispatch(setAccessToken(accessToken));

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          return AxiosInstance(originalRequest);
        }
      } catch (refreshError) {
        store.dispatch(clearAccessToken());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);