import { useState } from 'react';
import SignupForm from '../../components/Auth/SignupForm';
import OTPModal from '../../components/modals/OtpModal';
import { useUserSignUp } from '../../hooks/Auth/AuthHooks';
import type { SignupFormData } from '../../lib/validations/auth.schema';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FRONTEND_ROUTES } from '../../constants/frontendRoutes';

export const SignupPage = () => {

  const [isOtpModalOpen, setOtpModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const { mutate: signup, isPending, } = useUserSignUp();
  const navigate = useNavigate();

  const handleSignup = (data: SignupFormData) => {
    signup(data, {
      onSuccess: () => {
        console.log(data);
        setUserEmail(data.email);

        setOtpModalOpen(true);
        toast.success("Otp sent successfully");
      },
      onError: (error) => {
        console.log(error);
        toast.error((error as any).response?.data?.message || "Signup failed");
      },
    });
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-[#050505] text-foreground p-4">
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]" />
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
