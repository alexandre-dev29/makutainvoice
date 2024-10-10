import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import React, { useState } from 'react';
import * as z from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@makutainv/configs';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const schema = z.object({
    email: z
      .string({ message: 'Email is required' })
      .email('Please write a correct email'),
  });
  const forgotPasswordForm = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const sendForgotPasswordLink: SubmitHandler<z.infer<typeof schema>> = async ({
    email,
  }) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    setIsLoading(false);
    console.log(error, data);
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error while trying to reset your password',
        description: error?.message,
      });
    }
    forgotPasswordForm.reset();
  };
  return (
    <Form {...forgotPasswordForm}>
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Forget password ?</h1>
              <p className="text-balance text-muted-foreground">
                Enter your email below to get reset code
              </p>
            </div>
            <form
              className="grid gap-4"
              onSubmit={forgotPasswordForm.handleSubmit(sendForgotPasswordLink)}
            >
              <FormField
                control={forgotPasswordForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                {isLoading ? 'Loading...' : 'Send'}
              </Button>
              <div className="mt-4 text-center text-sm">
                You remember your password?{' '}
                <Link to={'/auth/login'} className="underline">
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
        <div className="hidden bg-muted lg:flex  items-center justify-center">
          <h2 className="font-bold text-6xl italic text-primary">
            Makuta <span className="text-muted-foreground">Invoice</span>
          </h2>
        </div>
      </div>
    </Form>
  );
}
