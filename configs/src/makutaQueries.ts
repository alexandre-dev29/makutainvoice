import { createQueryKeyStore } from '@lukemorales/query-key-factory';
import { supabase } from './supabase';

export const makutaQueries = createQueryKeyStore({
  clients: {
    list: () => ({
      queryKey: ['clients'],
      queryFn: async () => await supabase.from('clients').select('*'),
    }),
    listByCompany: (companyId: number) => ({
      queryKey: ['clients', `company-${companyId}`],
      queryFn: async () =>
        await supabase.from('clients').select('*').eq('company_id', companyId),
    }),
  },
  companies: {
    list: () => ({
      queryKey: ['companies'],
      queryFn: async () => await supabase.from('companies').select('*'),
    }),
  },
  invoices: {
    list: () => ({
      queryKey: ['invoices'],
      queryFn: async () =>
        await supabase
          .from('invoices')
          .select('*, clients(client_name, phone, email)'),
    }),
  },
});
