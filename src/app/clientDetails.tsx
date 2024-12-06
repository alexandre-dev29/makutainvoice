import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import React from 'react';
import { useParams } from '@tanstack/react-router';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { makutaQueries, useLanguageState } from '@makutainv/configs';
import { PDFViewer } from '@react-pdf/renderer';
import { ClientStatementTemplate } from '@/components/statement-templates/client-statement-1';

export const ClientDetails = () => {
  const { clientNumber } = useParams({
    from: '/clients/$clientNumber',
  });
  const {
    data: { data },
    isLoading,
  } = useSuspenseQuery(makutaQueries.clients.details(parseInt(clientNumber)));
  const { data: invoiceData } = useQuery({
    ...makutaQueries.invoices.listByClients(parseInt(clientNumber)),
    enabled: !isLoading,
  });
  const { currentLanguage } = useLanguageState();
  return (
    <div className="flex gap-8">
      <div className=" flex-1">
        <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
          <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg">
                Invoice details{' '}
                <span className="text-primary">{data?.client_name}</span>
              </CardTitle>
              <CardDescription>Date: November 23, 2023</CardDescription>
            </div>
            <div className="ml-auto flex items-center gap-1">
              {/*<PDFDownloadLink*/}
              {/*  document={<InvoiceDocument />}*/}
              {/*  fileName={`${data?.invoice_number}.pdf`}*/}
              {/*>*/}
              {/*  <div className="flex items-center gap-2">*/}
              {/*    <DownloadCloud size={14} />*/}
              {/*    <span>Download</span>*/}
              {/*  </div>*/}
              {/*</PDFDownloadLink>*/}
            </div>
          </CardHeader>
          <CardContent className="p-6 text-sm">
            <div className="grid gap-3">
              <div className="font-semibold">Client Information</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Client</dt>
                  <dd>{data?.client_name}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd>
                    <a href={`mailto:${data?.email}`}>{data?.email}</a>
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Phone</dt>
                  <dd>
                    <a href={`tel:${data?.phone}`}>{data?.phone}</a>
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Address</dt>
                  <dd>
                    <address className="grid gap-0.5 not-italic text-muted-foreground">
                      <span>{data?.address}</span>
                    </address>
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Last invoice date</dt>
                  <dd>
                    <time dateTime="2023-11-23">
                      {` ${new Date(
                        `${data?.last_invoice_date}`
                      ).toLocaleDateString('fr-Fr')}`}
                    </time>
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Last payment date</dt>
                  <dd>
                    <time dateTime="2023-11-23">
                      {` ${new Date(
                        `${data?.last_payment_date}`
                      ).toLocaleDateString('fr-Fr')}`}
                    </time>
                  </dd>
                </div>
              </dl>
            </div>
          </CardContent>
          <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
            <div className="text-xs text-muted-foreground">
              Last updated at
              <time dateTime="2023-11-23">
                {` ${new Date(`${data?.last_payment_date}`).toLocaleDateString(
                  'fr-Fr'
                )}`}
              </time>
            </div>
          </CardFooter>
        </Card>
      </div>
      <div className="w-[1000px]">
        <h3 className="font-bold text-muted-foreground ">Client Statement</h3>
        <PDFViewer width={1000} height={800}>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-expect-error*/}
          {data && data.companies && invoiceData && invoiceData.data && (
            <ClientStatementTemplate
              clientInformation={{ ...data, contact_person: '' }}
              companyInformation={data?.companies}
              currentLocal={currentLanguage}
              invoiceData={[
                ...invoiceData.data.map(
                  ({ invoice_number, total_paid, total_amount, currency }) => ({
                    invoiceNumber: invoice_number,
                    totalAmount: total_amount ?? 0,
                    totalPaid: total_paid ?? 0,
                    currency,
                  })
                ),
              ]}
            />
          )}
        </PDFViewer>
      </div>
    </div>
  );
};
