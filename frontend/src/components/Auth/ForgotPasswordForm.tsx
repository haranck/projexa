import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotSchema, type ForgotSchemaType } from '../../lib/validations/forgot.schema'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Label } from '../ui/label';
import { FRONTEND_ROUTES } from '../../constants/frontendRoutes';

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotSchemaType) => void;
  loading: boolean;
}

export const ForgotPasswordForm = ({ onSubmit, loading }: ForgotPasswordFormProps) => {
  const form = useForm<ForgotSchemaType>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: ''
    }
  }) 

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <Label className="text-zinc-400 text-xs font-medium ml-1">Email Address</Label>
              <FormControl>
                <Input
                  placeholder="Enter your email"
                  type="email"
                  className="h-12 bg-[#1a1a1a]/50 border-zinc-800/80 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl text-sm transition-all placeholder:text-zinc-600 font-medium"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-[10px] mt-1 text-red-400/80" />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-transparent hover:bg-blue-500/10 text-blue-400 font-bold rounded-xl transition-all border border-blue-500/50 shadow-[0_0_12px_rgba(59,130,246,0.6)] hover:shadow-[0_0_24px_rgba(59,130,246,1)]"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Send Reset OTP"
            )}
          </Button>

          <div className="flex justify-center pt-2">
            <Link
              to={FRONTEND_ROUTES.LOGIN}
              className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              Back to Login
            </Link>
          </div>
        </div>
      </form>
    </Form>
  )
}
