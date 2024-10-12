import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link, useRouter } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';
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
import { ToastAction } from '@/components/ui/toast';

export function UpdatePasswordPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecovery(true);
      }
    });
  }, []);

  const schema = z.object({
    password: z
      .string({ message: 'Password is required' })
      .min(6, 'The password must have at least 6 characters'),
  });
  const updatePasswordForm = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const sendUpdatePassword: SubmitHandler<z.infer<typeof schema>> = async ({
    password,
  }) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.updateUser({
      password: password,
    });
    setIsLoading(false);
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error while trying to updated your password',
        description: error?.message,
      });
    }
    if (data) {
      updatePasswordForm.reset();
      toast({
        title: 'Password Updated',
        description: 'Your password has been updated successfully.',
        action: <ToastAction altText="Okay">Okay</ToastAction>,
      });
      await router.invalidate();
      await router.navigate({ to: '/auth/login' });
    }
  };

  return (
    <Form {...updatePasswordForm}>
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className="flex items-center justify-center py-12">
          {isPasswordRecovery && (
            <div className="mx-auto grid w-[350px] gap-6">
              <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Update your password ?</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your new password below to change it.
                </p>
              </div>
              <form
                className="grid gap-4"
                onSubmit={updatePasswordForm.handleSubmit(sendUpdatePassword)}
              >
                <FormField
                  control={updatePasswordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your new password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  {isLoading ? 'Loading...' : 'Update'}
                </Button>
                <div className="mt-4 text-center text-sm">
                  You remember your password?{' '}
                  <Link to={'/auth/login'} className="underline">
                    Sign in
                  </Link>
                </div>
              </form>
            </div>
          )}
          {!isPasswordRecovery && (
            <p>
              You cannot update your password without a mail being sent to you
            </p>
          )}
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
