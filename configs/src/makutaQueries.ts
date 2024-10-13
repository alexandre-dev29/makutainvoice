import { createQueryKeyStore } from '@lukemorales/query-key-factory';
import { supabase } from './supabase';

export const makutaQueries = createQueryKeyStore({
  clients: {
    list: () => ({
      queryKey: ['clients'],
      queryFn: async () => await supabase.from('clients').select('*'),
    }),
  },
  companies: {
    list: () => ({
      queryKey: ['companies'],
      queryFn: async () => await supabase.from('companies').select('*'),
    }),
  },
});
