export type MonthlyRevenueType = {
  monthName: string;
  monthRevenue: number;
  monthNumber: number;
};
export type ClientStatementType = {
  invoiceNumber: string;
  totalPaid: number;
  totalAmount: number;
  currency: string;
};

export type NewStatementType = {
  payments:
    | {
        payment_id: number;
        payment_date: string;
        amount: number;
        reference: string | null;
        invoice_id: number;
      }[]
    | undefined;
  invoice_id: number;
  invoice_number: string;
  invoice_date: string;
  total_amount: number | null;
  currency: string;
  total_paid: number | null;
};
