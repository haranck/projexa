import { Form, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotSchema } from '../../lib/validations/forgot.schema'
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

interface ForgotPasswordFormProps {
  onsubmit: (email: string) => void;
  loading: boolean;
}

export const ForgotPasswordForm = ({ onsubmit, loading }: ForgotPasswordFormProps) => {
  const form = useForm({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: ''
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => onsubmit(data.email))} className="space-y-4">
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
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-10 bg-blue-500/50 hover:bg-blue-500/70 text-white font-medium rounded-xl transition-all"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </form>
    </Form>
  )
}
