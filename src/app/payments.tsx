import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { makutaQueries, useCompanyState } from '@makutainv/configs';
import { AddClients } from '@/components/add-clients';
import { MakeInvoicePayment } from '@/components/make-payment';
import { InvoiceType } from '@makutainv/types';

const PaymentsPage = () => {
  const { currentCompany } = useCompanyState();
  const { data } = useQuery({
    ...makutaQueries.payments.listByCompany(Number.parseInt(currentCompany)),
    staleTime: 1000 * 60 * 10,
  });
  const { data: dataInvoices } = useQuery({
    ...makutaQueries.invoices.list(),
    staleTime: 1000 * 60 * 10,
  });
  const invoiceList: Array<InvoiceType> =
    (dataInvoices &&
      dataInvoices.data &&
      dataInvoices.data.map((invoice) => ({
        ...invoice,
        companies: null,
        clients: null,
        invoice_date: new Date(invoice.invoice_date),
        due_date: new Date(`${invoice.due_date}`),
        created_at: new Date(`${invoice.created_at}`),
        updated_at: new Date(`${invoice.updated_at}`),
        payment_terms: '',
      }))) ??
    [];
  return (
    <div>
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2">
          <MakeInvoicePayment invoiceList={invoiceList} />
        </div>
      </div>
      <Card x-chunk="dashboard-06-chunk-0" className="mt-4">
        <CardHeader>
          <CardTitle className="text-2xl">Payments</CardTitle>
          <CardDescription>See list of differents payments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  Id
                  <span className="sr-only">Id</span>
                </TableHead>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Payment method</TableHead>
                <TableHead>Payment reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data &&
                data.data &&
                data.data.map(
                  (
                    {
                      invoices,
                      payment_date,
                      payment_method,
                      amount,
                      reference,
                    },
                    index
                  ) => (
                    <TableRow>
                      <TableCell className="hidden sm:table-cell">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {invoices?.invoice_number}
                      </TableCell>
                      <TableCell>{amount}</TableCell>
                      <TableCell>{payment_date}</TableCell>
                      <TableCell>{payment_method}</TableCell>
                      <TableCell>{reference}</TableCell>

                      <TableCell className="flex gap-4"></TableCell>
                    </TableRow>
                  )
                )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
};

export default PaymentsPage;
