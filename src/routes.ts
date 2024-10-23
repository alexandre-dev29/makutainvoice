import { createRoute, redirect } from '@tanstack/react-router';
import Home from '@/app/home';
import Clients from '@/app/clients';
import { rootRoute } from '@/mainRoute';
import { LoginPage } from '@/app/login';
import { RegisterPage } from '@/app/register';
import { ForgotPasswordPage } from '@/app/forgot-password';
import { makutaQueries, supabase } from '@makutainv/configs';
import { UpdatePasswordPage } from './app/update-password';
import CompaniesPage from './app/companies';
import InvoicePage from './app/invoices';
import { CreateInvoicePage } from '@/app/create-invoice';
import InvoiceDetails from '@/app/invoiceDetails';
import PaymentsPage from '@/app/payments';

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
export const invoicePage = createRoute({
  getParentRoute: () => rootRoute,
  path: 'invoices',
});

export const invoiceListPage = createRoute({
  getParentRoute: () => invoicePage,
  path: '/',
  component: InvoicePage,
});

export const createInvoicePage = createRoute({
  getParentRoute: () => invoicePage,
  path: 'create-invoice',
  component: CreateInvoicePage,
});
export const invoiceDetails = createRoute({
  getParentRoute: () => invoicePage,
  path: '$invoiceNumber',
  loader: ({ context: { queryClient }, params: { invoiceNumber } }) =>
    queryClient.ensureQueryData(makutaQueries.invoices.details(invoiceNumber)),
  component: InvoiceDetails,
});

export const compagniesPage = createRoute({
  getParentRoute: () => rootRoute,
  path: 'companies',
  component: CompaniesPage,
});
export const paymentsPage = createRoute({
  getParentRoute: () => rootRoute,
  path: 'payments',
  component: PaymentsPage,
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
  paymentsPage,
  invoicePage.addChildren([invoiceListPage, createInvoicePage, invoiceDetails]),
  compagniesPage,
  indexAuthRoute.addChildren([
    registerPage,
    loginPage,
    forgotPassword,
    updatePassword,
  ]),
]);
