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

export function RegisterPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const schema = z.object({
    email: z
      .string({ message: 'Email is required' })
      .email('Please write a correct email'),
    name: z
      .string({ message: 'Your name is required' })
      .min(6, 'The name must be at least 6 characters'),
    phoneNumber: z.string({ message: 'Email is required' }).optional(),
    password: z
      .string({ message: 'Password is required' })
      .min(6, 'Password must be at least 6 characters'),
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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
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
        title: 'Error while trying to register you in',
        description: error?.message,
      });
    } else {
      toast({
        title: 'Register Success ',
        description:
          'An email has been sent to you, please click on the link to confirm your account',
        action: <ToastAction altText="Goto schedule to undo">Okay</ToastAction>,
      });
      await router.invalidate();
      await router.navigate({ to: '/' });
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
              <h1 className="text-3xl font-bold">Register</h1>
              <p className="text-balance text-muted-foreground">
                Enter your email below to register to your account
              </p>
            </div>
            <div className="grid gap-4">
              <FormField
                control={registerForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
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
                    <FormLabel>Your phone number</FormLabel>
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
                    <FormLabel>Email</FormLabel>
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Register'}
              </Button>
              <Button variant="outline" className="w-full">
                Register with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link to={'/auth/login'} className="underline">
                Sign in
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
