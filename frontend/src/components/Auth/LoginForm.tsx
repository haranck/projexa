import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";

import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";

import { loginSchema, type LoginSchemaType } from "../../lib/validations/login.schema";
import { useLogin, useBackendGoogleLogin } from "../../hooks/Auth/AuthHooks";
import { FRONTEND_ROUTES } from "../../constants/frontendRoutes";
import { setAuthUser } from "../../store/slice/authSlice";
import { setAccessToken } from "../../store/slice/tokenSlice";
import { ERROR_MESSAGES } from "../../constants/errorMessages";

export const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mutate: login, isPending: isLoggingIn } = useLogin();
  const { mutate: googleBackendLogin } = useBackendGoogleLogin();

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Google sign-in success", tokenResponse);
      googleBackendLogin({
        idToken: tokenResponse.access_token
      }, {
        onSuccess: (response) => {
          if (response?.data) {
            dispatch(setAccessToken(response.data.accessToken));
            dispatch(setAuthUser(response.data.user));
            toast.success("Google login successful!");
            navigate(FRONTEND_ROUTES.HOME);
          }
        },
        onError: (error) => {
          console.error("Backend Google Login Failed:", error);
          toast.error("Google login failed. Please try again.");
        }
      });
    },
    onError: (error) => console.error("Google Login Failed:", error),
  });

  const onSubmit = (data: LoginSchemaType) => {
    login(data, {
      onSuccess: (response) => {
        if (response?.data) {
          dispatch(setAccessToken(response.data.accessToken));
          dispatch(setAuthUser(response.data.user));
          toast.success("Login successful!");
          navigate(FRONTEND_ROUTES.HOME);
        }
      },
      onError: (error) => {
        console.error("Login failed:", error);
        toast.error(ERROR_MESSAGES.INVALID_CREDENTIALS);
      },
    });
  };

  return (
    <Card className="w-full max-w-[460px] border-white/5 bg-[#141414]/80 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      <CardHeader className="text-center pb-2 pt-8 space-y-0.5">
        <CardTitle className="flex justify-center -mt-12 -mb-12">
          <img
            src="/logo.png"
            alt="ProJexa Logo"
            className="h-28 w-auto object-contain"
          />
        </CardTitle>
        <h2 className="text-xl font-bold text-zinc-100 tracking-tight leading-tight">
          Welcome Back
        </h2>
        <p className="text-zinc-500 text-xs font-medium">
          Sign in to continue managing your projects
        </p>
      </CardHeader>

      <CardContent className="space-y-4 px-8 pb-8 pt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      type="email"
                      className="h-10 bg-[#1a1a1a] border-zinc-800/80 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl text-xs transition-all placeholder:text-zinc-600 font-medium"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[9px] mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Password"
                      type="password"
                      className="h-10 bg-[#1a1a1a] border-zinc-800/80 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl text-xs transition-all placeholder:text-zinc-600 font-medium"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[9px] mt-1" />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-[10px] font-bold text-blue-500 hover:text-blue-400 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-10 text-xs font-bold bg-[#4dabf7] hover:bg-[#339af0] text-white rounded-xl transition-all duration-300 shadow-[0_4px_15px_rgba(59,130,246,0.25)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.35)] mt-3 active:scale-[0.98]"
              disabled={isLoggingIn}
            >
              {isLoggingIn && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
              {isLoggingIn ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>

        <div className="relative py-1 mt-1">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full bg-zinc-800/60" />
          </div>
          <div className="relative flex justify-center text-[9px] uppercase font-bold tracking-[0.2em]">
            <span className="bg-[#141414] px-4 text-zinc-600">
              or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          onClick={() => googleLogin()}
          className="w-full h-10 bg-white hover:bg-zinc-100 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-2.5 transition-all duration-200 border-none group shadow-md"
        >
          <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>

        <div className="text-center pt-2">
          <p className="text-xs text-zinc-500 font-medium">
            Dont have an account?{" "}
            <Link
              to={FRONTEND_ROUTES.SIGNUP}
              className="text-blue-400 font-bold hover:text-blue-300 transition-colors ml-1"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
