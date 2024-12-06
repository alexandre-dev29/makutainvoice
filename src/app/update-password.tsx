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
import { useTranslation } from 'react-i18next';

export function UpdatePasswordPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useTranslation();
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
      .string({ message: t('password_required') })
      .min(6, t('password-must-be-at-least-6-characters')),
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
        title: t('error-while-trying-to-updated-your-password'),
        description: error?.message,
      });
    }
    if (data) {
      updatePasswordForm.reset();
      toast({
        title: t('password-updated'),
        description: t('your-password-has-been-updated-successfully'),
        action: <ToastAction altText={t('okay')}>{t('okay')}</ToastAction>,
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
                <h1 className="text-3xl font-bold">
                  {t('update-your-password')}
                </h1>
                <p className="text-balance text-muted-foreground">
                  {t('enter-your-new-password')}
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
                      <FormLabel>{t('your-new-password')}</FormLabel>
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
                  {isLoading ? 'Loading...' : t('update')}
                </Button>
                <div className="mt-4 text-center text-sm">
                  {t('you-remember-your-password')}
                  <Link to={'/auth/login'} className="underline">
                    {t('sign-in')}
                  </Link>
                </div>
              </form>
            </div>
          )}
          {!isPasswordRecovery && (
            <p>
              {t(
                'you-cannot-update-your-password-without-a-mail-being-sent-to-you'
              )}
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
