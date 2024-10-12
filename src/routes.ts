import { createRoute, redirect } from '@tanstack/react-router';
import Home from '@/app/home';
import Clients from '@/app/clients';
import { rootRoute } from '@/mainRoute';
import { LoginPage } from '@/app/login';
import { RegisterPage } from '@/app/register';
import { ForgotPasswordPage } from '@/app/forgot-password';
import { supabase } from '@makutainv/configs';
import { UpdatePasswordPage } from './app/update-password';

export const indexPage = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session || !session.user) {
      throw redirect({ to: '/auth/login' });
    }
  },
});
export const clientPage = createRoute({
  getParentRoute: () => rootRoute,
  path: 'clients',
  component: Clients,
});
export const indexAuthRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'auth',
});
export const registerPage = createRoute({
  getParentRoute: () => indexAuthRoute,
  path: 'register',
  component: RegisterPage,
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session && session.user) {
      throw redirect({ to: '/' });
    }
  },
});
export const loginPage = createRoute({
  getParentRoute: () => indexAuthRoute,
  path: 'login',
  component: LoginPage,
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session && session.user) {
      throw redirect({ to: '/' });
    }
  },
});
export const forgotPassword = createRoute({
  getParentRoute: () => indexAuthRoute,
  path: 'forgot-password',
  component: ForgotPasswordPage,
});

export const updatePassword = createRoute({
  getParentRoute: () => indexAuthRoute,
  path: 'update-password',
  component: UpdatePasswordPage,
});

export const routeTree = rootRoute.addChildren([
  indexPage,
  clientPage,
  indexAuthRoute.addChildren([
    registerPage,
    loginPage,
    forgotPassword,
    updatePassword,
  ]),
]);
