import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { loginSchema, type LoginSchemaType } from "@/lib/validations/login.schema";
import { useLogin, useBackendGoogleLogin } from "@/hooks/Auth/AuthHooks";
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes";
import { setAuthUser } from "@/store/slice/authSlice";
import { setAccessToken } from "@/store/slice/tokenSlice";

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
      googleBackendLogin(tokenResponse.access_token);
      toast.success("Google sign-in success");
      setTimeout(() => {
        navigate(FRONTEND_ROUTES.HOME);
      }, 1000);

    },
    onError: (error) => console.error("Google Login Failed:", error),
  });

  const handleGoogleSignIn = () => {
    googleLogin();
  };

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
      onError: (error: any) => {
        console.error("Login failed:", error);
        toast.error(error?.response?.data?.error || "Login failed. Please try again.");
      },
    });
  };

  return (
    <Card className="glass-card w-full max-w-[480px] animate-fade-in border-white/5 shadow-2xl bg-[#0a0a0a]">
      <CardHeader className="text-center pb-8 pt-6 space-y-2">
        <CardTitle className="font-display text-3xl font-bold tracking-tight text-white mb-2">
          ProJexa
        </CardTitle>
        <h2 className="text-xl font-semibold text-zinc-100">
          Welcome Back
        </h2>
        <p className="text-sm text-zinc-400">
          Sign in to continue managing your projects
        </p>
      </CardHeader>

      <CardContent className="space-y-6 px-8 pb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      type="email"
                      className="input-dark h-12 bg-[#121212] border-zinc-800/60 focus:border-blue-500/50 rounded-lg text-sm transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Password"
                      type="password"
                      className="input-dark h-12 bg-[#121212] border-zinc-800/60 focus:border-blue-500/50 rounded-lg text-sm transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs text-[#3b82f6] hover:text-blue-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-sm font-medium bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg transition-all duration-200"
              disabled={isLoggingIn}
            >
              {isLoggingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoggingIn ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full bg-zinc-800/50" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
            <span className="bg-[#0a0a0a] px-2 text-zinc-500">
              or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          className="w-full h-12 bg-white hover:bg-zinc-100 text-black border-0 font-medium rounded-lg text-sm flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>

        <div className="text-center pt-2">
          <p className="text-sm text-zinc-500">
            Don't have an account?{" "}
            <Link
              to={FRONTEND_ROUTES.SIGNUP}
              className="text-[#3b82f6] font-medium hover:text-blue-400 hover:underline ml-1"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
