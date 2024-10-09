import { QueryClient } from '@tanstack/react-query';

export const makutaQueryClient = new QueryClient({
  defaultOptions: { queries: {} },
});
