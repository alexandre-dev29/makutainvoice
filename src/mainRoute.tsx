import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import { CoreLayout } from '@/components/CoreLayout';

export const rootRoute = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: CoreLayout,
});

export const authRoute = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: Outlet,
});
