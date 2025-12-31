import { useState } from 'react';
import SignupForm from '../../components/Auth/SignupForm';
import OTPModal from '../../components/modals/OtpModal';
import { useUserSignUp } from '../../hooks/Auth/AuthHooks';
import type { SignupFormData } from '../../lib/validations/auth.schema';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FRONTEND_ROUTES } from '../../constants/frontendRoutes';

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message || fallback;
  }
  return fallback;
};

export const SignupPage = () => {
  const [isOtpModalOpen, setOtpModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const { mutate: signup, isPending } = useUserSignUp();
  const navigate = useNavigate();

  const handleSignup = (data: SignupFormData) => {
    signup(data, {
      onSuccess: () => {
        setUserEmail(data.email);
        setOtpModalOpen(true);
        toast.success("Otp sent successfully");
      },
      onError: (error) => {
        toast.error(getErrorMessage(error, "Signup failed"));
      },
    });
  };

  return (
    <div className="h-screen relative flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] p-4 font-sans">
      {/* Background Glows */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-400/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full flex justify-center">
        <SignupForm
          onSubmit={handleSignup}
          isLoading={isPending}
          onSwitchToSignIn={() => navigate(FRONTEND_ROUTES.LOGIN)}
        />
      </div>

      <OTPModal
        email={userEmail}
        isOpen={isOtpModalOpen}
        onClose={() => setOtpModalOpen(false)}
      />
    </div>
  );
};
