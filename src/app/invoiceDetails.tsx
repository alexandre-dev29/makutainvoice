import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { useParams } from '@tanstack/react-router';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { makutaQueries, useLanguageState } from '@makutainv/configs';
import { Separator } from '@/components/ui/separator';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { InvoiceTemplate1 } from '@/components/invoice-templates/template-1';

import { MakeInvoiceActive } from '@/components/make-invoice-active';

import { EditInvoiceDetails } from '@/components/edit-invoice-details';
import * as z from 'zod';
import { editInvoiceItemsFormSchema } from '@makutainv/types';

const InvoiceDetails = () => {
  const { invoiceNumber } = useParams({
    from: '/invoices/$invoiceNumber',
  });
  const { currentLanguage } = useLanguageState();
  const {
    data: { data },
    isLoading,
  } = useSuspenseQuery(makutaQueries.invoices.details(invoiceNumber));
  const { data: dataInvoiceitems } = useQuery({
    ...makutaQueries.invoiceItems.listByInvoiceId(data?.invoice_id ?? 1),
    enabled: !isLoading,
  });

  const itemsInvoice: z.infer<typeof editInvoiceItemsFormSchema> = {
    invoiceItems:
      dataInvoiceitems?.data?.map((items) => ({
        id: items.item_id.toString(),
        itemName: items.description,
        itemPrice: items.price,
        itemQuantity: items.quantity,
        isNew: false,
      })) || [],
  };

  return (
    <div className="flex gap-8">
      <div className=" flex-1">
        <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
          <CardHeader className="flex flex-row items-start justify-between bg-muted/50">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg">
                Invoice details{' '}
                <span className="text-primary">{data?.invoice_number}</span>
              </CardTitle>
              <CardDescription>Date: November 23, 2023</CardDescription>
            </div>
            <div>
              {data?.isDraft && (
                <MakeInvoiceActive
                  invoiceId={data.invoice_id}
                  isDraft={data.isDraft ?? false}
                />
              )}
            </div>
          </CardHeader>
          <CardContent className="px-6 py-2 text-sm">
            <div className="grid gap-3">
              <div className="font-semibold">Company Information</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Company</dt>
                  <dd>{data?.companies?.company_name}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd>
                    <a href={`mailto:${data?.companies?.email}`}>
                      {data?.companies?.email}
                    </a>
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Phone</dt>
                  <dd>
                    <a href={`tel:${data?.companies?.phone}`}>
                      {data?.companies?.phone}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
            <Separator className="my-2" />
            <div className="grid gap-3">
              <div className="font-semibold">Client Information</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Client</dt>
                  <dd>{data?.clients?.client_name}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd>
                    <a href={`mailto:${data?.clients?.email}`}>
                      {data?.clients?.email}
                    </a>
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Phone</dt>
                  <dd>
                    <a href={`tel:${data?.clients?.phone}`}>
                      {data?.clients?.phone}
                    </a>
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Address</dt>
                  <dd>
                    <address className="grid gap-0.5 not-italic text-muted-foreground">
                      <span>{data?.companies?.address}</span>
                    </address>
                  </dd>
                </div>
              </dl>
            </div>
            <Separator className="my-2" />
            {dataInvoiceitems && dataInvoiceitems.data && data?.isDraft && (
              <EditInvoiceDetails
                invoiceId={data?.invoice_id || 0}
                invoiceItems={itemsInvoice}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <p className="text-destructive">
          If you see the report below please refresh the page
        </p>
        <PDFViewer width={1000} height={800}>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-expect-error*/}
          {dataInvoiceitems && dataInvoiceitems.data && data && (
            <InvoiceTemplate1
              invoiceData={{
                ...data,
                invoice_date: new Date(data.invoice_date),
                due_date: new Date(`${data.due_date}`),
                payment_terms: data.payment_terms ?? '',
                created_at: new Date(`${data.created_at}`),
                updated_at: new Date(`${data.updated_at}`),
              }}
              items={dataInvoiceitems.data}
              currentLocal={currentLanguage}
            />
          )}
        </PDFViewer>
      </div>
    </div>
  );
};

export default InvoiceDetails;
