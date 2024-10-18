import React, { FC } from 'react';
import { Card } from '@/components/ui/card';
import * as z from 'zod';
import { createInvoiceFormSchema } from '@makutainv/types';
import { useCompanyState } from '@makutainv/configs';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const InvoicePreviewer: FC<
  z.infer<typeof createInvoiceFormSchema> & {
    clientName?: string;
    clientAddress?: string;
    clientNumber?: string;
  }
> = (props) => {
  const { companyInformation } = useCompanyState();
  const total = props.invoiceItems.reduce(
    (previousValue, currentValue) =>
      previousValue + currentValue.itemPrice * currentValue.itemQuantity,
    0
  );
  return (
    <Card
      x-chunk="dashboard-07-chunk-0"
      className="bg-gray-100 col-span-2 p-4 min-h-[80vh]"
    >
      <h5 className="font-bold text-2xl text-gray-800">Preview</h5>
      <div className="bg-white h-[73vh] mt-2 shadow-sm rounded-xl border-2 border-gray-200 py-8 px-10">
        <div className="grid grid-cols-2 justify-between pb-4">
          <p className="font-bold text-2xl text-primary ">
            Invoice
            <span className="text-muted-foreground ml-2 text-xl">
              #{props.invoiceNumber}
            </span>
            <span className="block text-muted-foreground text-sm">
              Due date{' '}
              {props.invoiceDueDate &&
                props.invoiceDueDate.toLocaleDateString('fr-Fr')}
            </span>
          </p>

          <img
            className="self-end justify-self-end py-3"
            src={companyInformation.logo}
            width={80}
            height={100}
            alt={`${companyInformation.name} Logo`}
          />
          <p className="col-span-2 justify-self-end font-bold ">
            {companyInformation.name}
          </p>
          <p className="col-span-2 justify-self-end ">
            {companyInformation.address}
          </p>
          <p className="col-span-2 justify-self-end ">
            {companyInformation.telephone}
          </p>
        </div>
        <Separator />
        <div className="py-3">
          <p className="font-bold">Bill to : </p>
          <p className="font-bold">{props.clientName}</p>
          <p className="">{props.clientAddress}</p>
          <p className="">{props.clientNumber}</p>
        </div>
        <Separator />
        <div className="py-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  Id
                  <span className="sr-only">Id</span>
                </TableHead>
                <TableHead>Item name</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {props.invoiceItems.map(
                ({ itemPrice, itemQuantity, itemName }, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium text-muted-foreground">
                      {itemName}
                    </TableCell>
                    <TableCell>{itemPrice}</TableCell>
                    <TableCell>{itemQuantity}</TableCell>

                    <TableCell className="text-muted-foreground font-bold">
                      {itemPrice * itemQuantity}
                      {props.currency && ` ${props.currency}`}
                    </TableCell>
                  </TableRow>
                )
              )}
              <TableRow key={Math.random()}>
                <TableCell></TableCell>
                <TableCell className="font-bold">Total</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>

                <TableCell className="font-extrabold text-muted-foreground">
                  {total} {props.currency && ` ${props.currency}`}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          {props.invoiceNote && (
            <div className="bg-primary/20 px-4 py-1 rounded-md my-2">
              <p className="text-sm">{props.invoiceNote}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default InvoicePreviewer;
