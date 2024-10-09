import { createQueryKeyStore } from '@lukemorales/query-key-factory';
import { supabase } from './supabase';

export const makutaQueries = createQueryKeyStore({
  users: {
    list: () => ({
      queryKey: ['users'],
      queryFn: async () => await supabase.from('users').select('*'),
    }),
  },
});
