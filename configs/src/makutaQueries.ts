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
    details: (clientNumber: number) => ({
      queryKey: [`client-${clientNumber}`, `${clientNumber}`],
      queryFn: () =>
        supabase
          .from('clients')
          .select('*, companies(*)')
          .eq('client_id', clientNumber)
          .single(),
    }),
  },
  companies: {
    list: () => ({
      queryKey: ['companies'],
      queryFn: async () => await supabase.from('companies').select('*'),
    }),
  },
  payments: {
    listByInvoice: (invoiceId: number) => ({
      queryKey: [`payments-invoice-${invoiceId}`],
      queryFn: async () =>
        await supabase.from('payments').select('*').eq('invoice_id', invoiceId),
    }),
    listByCompany: (companyId: number) => ({
      queryKey: [`payments-company-${companyId}`],
      queryFn: async () =>
        await supabase
          .from('payments')
          .select('*, invoices!inner(company_id, invoice_number)')
          .eq('invoices.company_id', companyId),
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
  dashboardRequests: {
    listInvoiceMoneyByCompany: (companyId: number) => ({
      queryKey: [`dashboard-invoices-${companyId}`, companyId],
      queryFn: () =>
        supabase
          .from('invoices')
          .select('invoice_number, total_paid, total_amount')
          .eq('company_id', companyId)
          .eq('isDraft', false),
    }),
    listOfPaymentsByCompany: (companyId: number) => ({
      queryKey: [`dashboard-payments-${companyId}`],
      queryFn: () =>
        supabase
          .from('payments')
          .select('*, invoices!inner(company_id, invoice_number)')
          .eq('invoices.company_id', companyId),
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
    listByCompany: (companyId: number) => ({
      queryKey: [`invoices-company-${companyId}`],
      queryFn: async () =>
        await supabase
          .from('invoices')
          .select('*, clients(client_name, phone, email)')
          .eq('company_id', companyId),
    }),

    listByClients: (client_id: number) => ({
      queryKey: [`invoices-clients-${client_id}`, client_id],
      queryFn: () =>
        supabase
          .from('invoices')
          .select('invoice_number, total_amount, total_paid, currency')
          .eq('client_id', client_id)
          .eq('isPaid', false)
          .eq('isDraft', false),
    }),

    listActiveAndNotComplete: () => ({
      queryKey: ['invoices'],
      queryFn: async () =>
        await supabase
          .from('invoices')
          .select('*, clients(client_name, phone, email)')
          .eq('isDraft', false)
          .eq('isPaid', false),
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
