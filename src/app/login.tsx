import { Input } from '@/components/ui/input';
import { Link, useRouter } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { supabase } from '@makutainv/configs';
import * as z from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const schema = z.object({
    email: z
      .string({ message: 'Email is required' })
      .email('Please write a correct email'),
    password: z
      .string({ message: 'Password is required' })
      .min(6, 'Password must be at least 6 characters'),
  });

  const myForm = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const signinUser: SubmitHandler<z.infer<typeof schema>> = async ({
    email,
    password,
  }) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setIsLoading(false);
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error while trying to log you in',
        description: error?.message,
      });
    }
    if (data && data.user) {
      myForm.reset();
      await router.invalidate();
      await router.navigate({ to: '/' });
    }
  };
  return (
    <Form {...myForm}>
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className="flex items-center justify-center py-12">
          <form
            className="mx-auto flex flex-col w-[350px] gap-6"
            onSubmit={myForm.handleSubmit(signinUser)}
          >
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-balance text-muted-foreground">
                Enter your email below to login to your account
              </p>
            </div>
            <FormField
              control={myForm.control}
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
              control={myForm.control}
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
            <Link
              to={'/auth/forgot-password'}
              className="ml-auto inline-block text-sm underline -my-2"
            >
              Forgot your password?
            </Link>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Login'}
            </Button>
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link to={'/auth/register'} className="underline">
                Sign up
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
