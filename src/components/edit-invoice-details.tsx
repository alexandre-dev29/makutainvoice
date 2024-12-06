import React, { FC, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { editInvoiceItemsFormSchema } from '@makutainv/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import {
  makutaQueries,
  makutaQueryClient,
  supabase,
  useCompanyState,
} from '@makutainv/configs';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';

export const EditInvoiceDetails: FC<{
  invoiceId: number;
  invoiceItems: z.infer<typeof editInvoiceItemsFormSchema>;
}> = ({ invoiceItems, invoiceId }) => {
  const editItemForm = useForm<z.infer<typeof editInvoiceItemsFormSchema>>({
    resolver: zodResolver(editInvoiceItemsFormSchema),
    defaultValues: {
      invoiceItems: invoiceItems.invoiceItems,
    },
  });
  const { currentCompany } = useCompanyState();

  const { toast } = useToast();
  const {
    control: controlForm,
    register: editItemsForm,
    formState: { errors },
  } = editItemForm;
  const { fields, append, remove } = useFieldArray<
    z.infer<typeof editInvoiceItemsFormSchema>
  >({
    name: 'invoiceItems',
    control: controlForm,
  });

  const editInvoiceItemSubmit: SubmitHandler<
    z.infer<typeof editInvoiceItemsFormSchema>
  > = async ({ invoiceItems: submittedItems }) => {
    setIsLoading(true);
    const { error } = await supabase.from('invoiceitems').upsert(
      submittedItems.map((currentItem) => ({
        invoice_id: invoiceId,
        item_id: currentItem.id,
        description: currentItem.itemName,
        price: currentItem.itemPrice,
        quantity: currentItem.itemQuantity,
      }))
    );
    if (!error) {
      await makutaQueryClient.invalidateQueries({
        queryKey:
          makutaQueries.invoiceItems.listByInvoiceId(invoiceId).queryKey,
        refetchType: 'active',
      });
      toast({
        title: 'Invoice Edited',
        description: 'The invoice has been edited successfully.',
        action: <ToastAction altText="Okay">Okay</ToastAction>,
      });
      setIsLoading(false);
      const total = submittedItems.reduce(
        (previousValue, currentValue) =>
          previousValue + currentValue.itemPrice * currentValue.itemQuantity,
        0
      );
      await supabase
        .from('invoices')
        .update({ total_amount: total })
        .eq('invoice_id', invoiceId);
      await makutaQueryClient.invalidateQueries({
        queryKey: makutaQueries.invoices.listByCompany(
          Number.parseInt(currentCompany)
        ).queryKey,
        refetchType: 'active',
      });
    } else {
      toast({
        title: 'Invoice Edited',
        description: 'There was an error while trying to update the invoice.',
        variant: 'destructive',
        action: <ToastAction altText="Okay">Okay</ToastAction>,
      });
    }
  };
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Form {...editItemForm}>
      <form onSubmit={editItemForm.handleSubmit(editInvoiceItemSubmit)}>
        <h5 className="text-xl font-bold">Invoice items list</h5>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Items</TableHead>
              <TableHead className="w-[100px]">Qty</TableHead>
              <TableHead>Price</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((value, index) => {
              return (
                <TableRow key={value.id}>
                  <TableCell>
                    <Label htmlFor="stock-1" className="sr-only">
                      Stock
                    </Label>
                    <Input
                      id="stock-1"
                      type="text"
                      required
                      className={
                        errors?.invoiceItems?.[index]?.itemName
                          ? 'border-red-300'
                          : ''
                      }
                      placeholder="Name of the item"
                      {...editItemsForm(
                        `invoiceItems.${index}.itemName` as const,
                        { required: true }
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Label htmlFor="price-1" className="sr-only">
                      Price
                    </Label>
                    <Input
                      id="price-1"
                      type="number"
                      placeholder="Quantity"
                      min={1}
                      {...editItemsForm(
                        `invoiceItems.${index}.itemQuantity` as const
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Label htmlFor="price-1" className="sr-only">
                      Price
                    </Label>
                    <Input
                      id="price-1"
                      type="number"
                      placeholder="Price"
                      className={
                        errors?.invoiceItems?.[index]?.itemPrice
                          ? 'border-red-300'
                          : ''
                      }
                      min={1}
                      {...editItemsForm(
                        `invoiceItems.${index}.itemPrice` as const
                      )}
                    />
                  </TableCell>

                  <TableCell>
                    {index > 0 && (
                      <Trash2
                        className="cursor-pointer"
                        size={14}
                        onClick={() => {
                          remove(index);
                        }}
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="flex flex-col">
          <Button
            size="sm"
            type={'button'}
            variant="ghost"
            className="gap-2 text-[16px] mt-2 "
            onClick={() => {
              append({
                id: '',
                itemName: '',
                itemPrice: 0,
                itemQuantity: 0,
                isNew: true,
              });
            }}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Add Variant
          </Button>
          <div className="flex gap-6 self-end">
            <Button type="submit">
              {isLoading ? 'Saving.......' : 'Edit invoice items'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
