import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { NotFoundComponent } from '@/components/not-found';
import { routeTree } from '@/routes';
import { makutaQueryClient } from '@makutainv/configs';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const router = createRouter({
  routeTree,
  context: { queryClient: makutaQueryClient },

  defaultPreload: 'intent',
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
  defaultNotFoundComponent: () => <NotFoundComponent />,
});
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
root.render(
  <StrictMode>
    <QueryClientProvider client={makutaQueryClient}>
      <RouterProvider router={router} notFoundMode={'root'} />
      <ReactQueryDevtools buttonPosition={'bottom-right'} />
    </QueryClientProvider>
  </StrictMode>
);
