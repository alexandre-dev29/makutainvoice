export type InvoiceType = {
  invoice_number: string;
  invoice_id: number;
  company_id: number;
  invoice_date: Date;
  currency: string;
  status: string;
  due_date?: Date;
  payment_terms: string;
  discount_percentage?: number | null;
  notes?: string | null;
  total_amount?: number | null;
  total_paid?: number | null;
  created_at: Date;
  updated_at: Date;
  clients: ClientType | null;
  companies: CompanyType | null;
};
export type InvoiceItemType = {
  description: string;
  invoice_id: number;
  item_id: number;
  price: number;
  quantity: number;
  tax_rate: number | null;
};

export type ClientType = {
  client_id: number;
  client_name: string;
  company_id: number | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  contact_person?: string;
};
export type CompanyType = {
  company_id: number;
  company_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  logo: string | null;
  created_by_id: string | null;
};
