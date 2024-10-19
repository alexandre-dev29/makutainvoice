import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { useParams } from '@tanstack/react-router';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { makutaQueries } from '@makutainv/configs';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { InvoiceTemplate1 } from '@/components/invoice-templates/template-1';

const InvoiceDetails = () => {
  const { invoiceNumber } = useParams({
    from: '/invoices/$invoiceNumber',
  });
  const {
    data: { data },
    isLoading,
  } = useSuspenseQuery(makutaQueries.invoices.details(invoiceNumber));
  const { data: dataInvoiceitems } = useQuery({
    ...makutaQueries.invoiceItems.listByInvoiceId(data?.invoice_id ?? 1),
    enabled: !isLoading,
  });

  return (
    <div className="flex gap-8">
      <div className=" flex-1">
        <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
          <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg">
                Invoice details{' '}
                <span className="text-primary">{data?.invoice_number}</span>
              </CardTitle>
              <CardDescription>Date: November 23, 2023</CardDescription>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="outline" className="h-8 w-8">
                    <MoreVertical className="h-3.5 w-3.5" />
                    <span className="sr-only">More</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Download</DropdownMenuItem>
                  <DropdownMenuItem>Send</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="p-6 text-sm">
            <div className="grid gap-3">
              <div className="font-semibold">Invoice Details</div>
              <ul className="grid gap-3">
                {dataInvoiceitems &&
                  dataInvoiceitems.data?.map((item) => (
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {item.description} x <span>{item.quantity}</span>
                      </span>
                      <span>{`${item.price * item.quantity} ${
                        data?.currency
                      }`}</span>
                    </li>
                  ))}
              </ul>
              <Separator className="my-2" />
              <ul className="grid gap-3">
                <li className="flex items-center justify-between font-semibold">
                  <span className="text-muted-foreground">Total</span>
                  <span>{`${data?.total_amount} ${data?.currency}`}</span>
                </li>
              </ul>
            </div>
            <Separator className="my-4" />
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
            <Separator className="my-4" />
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
          </CardContent>
          <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
            <div className="text-xs text-muted-foreground">
              Last updated at
              <time dateTime="2023-11-23">
                {` ${new Date(`${data?.updated_at}`).toLocaleDateString(
                  'fr-Fr'
                )}`}
              </time>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div>
        <p className="text-destructive">
          If you see the report below please refresh the page
        </p>
        {dataInvoiceitems && dataInvoiceitems.data && data && (
          <PDFViewer width={1000} height={800}>
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
            />
          </PDFViewer>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetails;
