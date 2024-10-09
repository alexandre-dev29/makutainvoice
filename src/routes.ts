import { createRoute } from '@tanstack/react-router';
import Home from '@/app/home';
import Clients from '@/app/clients';
import { rootRoute } from '@/mainRoute';
import { LoginPage } from '@/app/login';
import { RegisterPage } from '@/app/register';
import { ForgotPasswordPage } from '@/app/forgot-password';

export const indexPage = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
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
});
export const loginPage = createRoute({
  getParentRoute: () => indexAuthRoute,
  path: 'login',
  component: LoginPage,
});
export const forgotPassword = createRoute({
  getParentRoute: () => indexAuthRoute,
  path: 'forgot-password',
  component: ForgotPasswordPage,
});

export const routeTree = rootRoute.addChildren([
  indexPage,
  clientPage,
  indexAuthRoute.addChildren([registerPage, loginPage, forgotPassword]),
]);
