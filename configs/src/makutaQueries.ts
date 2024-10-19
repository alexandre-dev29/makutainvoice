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
  invoiceItems: {
    listByInvoiceId: (invoiceId: number) => ({
      queryKey: [`invoice-${invoiceId}`, invoiceId],
      queryFn: async () =>
        await supabase
          .from('invoiceitems')
          .select('*')
          .eq('invoice_id', invoiceId),
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
    details: (invoiceNumber: string) => ({
      queryKey: [`invoices-${invoiceNumber}`, `${invoiceNumber}`],
      queryFn: () =>
        supabase
          .from('invoices')
          .select(
            '*, clients(client_name, phone, email, address, client_id, company_id), companies(*)'
          )
          .eq('invoice_number', invoiceNumber)
          .single(),
    }),
  },
});
