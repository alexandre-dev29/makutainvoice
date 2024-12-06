import { Input } from '@/components/ui/input';
import { Link, useRouter } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@makutainv/configs';
import { ToastAction } from '@/components/ui/toast';
import { useTranslation } from 'react-i18next';

export function RegisterPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const schema = z.object({
    email: z
      .string({ message: t('email_require') })
      .email(t('please-write-a-correct-email')),
    name: z
      .string({ message: t('your-name-is-required') })
      .min(6, t('the-name-must-be-at-least-6-characters')),
    phoneNumber: z
      .string({ message: t('phone-number-is-required') })
      .optional(),
    password: z
      .string({ message: t('password_required') })
      .min(6, t('password-must-be-at-least-6-characters')),
  });

  const registerForm = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const signupUser: SubmitHandler<z.infer<typeof schema>> = async ({
    email,
    password,
    name,
    phoneNumber,
  }) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: import.meta.env.VITE_WEBSERVER,
        data: {
          name,
          phoneNumber,
          role: 'user',
        },
      },
    });
    setIsLoading(false);
    if (error) {
      toast({
        variant: 'destructive',
        title: t('error-while-trying-to-register-you'),
        description: error?.message,
      });
    } else {
      toast({
        title: t('register-success'),
        description: t('an-email-has-been-sent'),
        action: (
          <ToastAction altText={t('goto-schedule-to-undo')}>
            {t('okay')}
          </ToastAction>
        ),
      });
      await router.invalidate();
      await router.navigate({ to: '/auth/login' });
    }
  };
  return (
    <Form {...registerForm}>
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className="flex items-center justify-center py-12">
          <form
            className="mx-auto grid w-[350px] gap-6"
            onSubmit={registerForm.handleSubmit(signupUser)}
          >
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">{t('register')}</h1>
              <p className="text-balance text-muted-foreground">
                {t('enter-your-email-below-to-register-to-your-account')}
              </p>
            </div>
            <div className="grid gap-4">
              <FormField
                control={registerForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('full-name')}</FormLabel>
                    <FormControl>
                      <Input placeholder="Alexandre mwenze" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('your-phone-number')}</FormLabel>
                    <FormControl>
                      <Input placeholder="ex. +243......" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('email')}</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('password')}</FormLabel>
                    <FormControl>
                      <Input placeholder="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Loading...' : t('register')}
              </Button>
              {/*<Button variant="outline" className="w-full">*/}
              {/*  Register with Google*/}
              {/*</Button>*/}
            </div>
            <div className="mt-4 text-center text-sm">
              {t('already-have-an-account')}
              <Link to={'/auth/login'} className="underline">
                {t('sign-in')}
              </Link>
            </div>
          </form>
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
