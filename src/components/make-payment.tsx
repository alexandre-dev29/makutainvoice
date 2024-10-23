import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  makutaQueries,
  makutaQueryClient,
  supabase,
  useCompanyState,
} from '@makutainv/configs';
import { ToastAction } from '@/components/ui/toast';
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from '@radix-ui/react-icons';
import { Calendar } from '@/components/ui/calendar';
import { FileSpreadsheetIcon, PlusCircle, User2 } from 'lucide-react';
import { InvoiceType } from '@makutainv/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const MakeInvoicePayment = ({
  invoiceList,
}: {
  invoiceList: Array<InvoiceType>;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { currentCompany } = useCompanyState();
  const makePaymentSchema = z.object({
    paymentDate: z.date({ message: 'The date is required' }),
    invoiceNumber: z.coerce.number({
      message: 'The invoice number is required',
    }),
    amount: z.coerce
      .number()
      .min(1, { message: 'The amount must be greater than 0' }),
    payment_method: z.string({}).optional(),
    payment_reference: z.string().optional(),
  });
  const addPaymentForm = useForm<z.infer<typeof makePaymentSchema>>({
    resolver: zodResolver(makePaymentSchema),
  });
  const selectedInvoiceNumber = addPaymentForm.watch('invoiceNumber');
  const selectedIncoice = invoiceList.filter(
    (value) => value.invoice_id === selectedInvoiceNumber
  )[0];

  const sendAddPayment: SubmitHandler<
    z.infer<typeof makePaymentSchema>
  > = async ({
    paymentDate,
    payment_method,
    invoiceNumber,
    payment_reference,
    amount,
  }) => {
    setIsLoading(true);

    const { error } = await supabase.from('payments').insert({
      invoice_id: invoiceNumber,
      payment_date: paymentDate.toISOString(),
      payment_method: payment_method,
      amount: amount,
      reference: payment_reference,
    });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error while trying to create a new payment',
        description: error?.message,
      });
    }
    setIsLoading(false);
    if (!error) {
      const { error: errorUpdate } = await supabase
        .from('invoices')
        .update({ total_paid: (selectedIncoice?.total_paid ?? 0) + amount })
        .eq('invoice_id', invoiceNumber);

      if (!errorUpdate) {
        addPaymentForm.reset();

        toast({
          title: 'Payment created',
          description: 'The payment has been created successfully.',
          action: <ToastAction altText="Okay">Okay</ToastAction>,
        });
        // invalidate all the list queries
        await makutaQueryClient.invalidateQueries({
          queryKey: makutaQueries.payments.listByCompany(
            Number.parseInt(currentCompany)
          ).queryKey,
          refetchType: 'active',
        });
        await makutaQueryClient.invalidateQueries({
          queryKey: makutaQueries.dashboardRequests.listOfPaymentsByCompany(
            Number.parseInt(currentCompany)
          ).queryKey,
          refetchType: 'active',
        });

        await makutaQueryClient.invalidateQueries({
          queryKey: makutaQueries.dashboardRequests.listInvoiceMoneyByCompany(
            Number.parseInt(currentCompany)
          ).queryKey,
          refetchType: 'active',
        });

        setIsModalOpen(false);
      }
    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="p-5 flex gap-2">
          <PlusCircle className="h-5 w-5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap text-[15px]">
            Add payment
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...addPaymentForm}>
          <form
            onSubmit={addPaymentForm.handleSubmit(sendAddPayment)}
            className="grid gap-4 py-4"
          >
            <DialogHeader>
              <DialogTitle>Add a new payment </DialogTitle>
              <DialogDescription>
                create a new payment, fill information and click Save.
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={addPaymentForm.control}
              name="invoiceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice number</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an invoice" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {invoiceList.map((value) => (
                        <SelectItem
                          value={`${value.invoice_id}`}
                          key={value.invoice_id}
                        >
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <FileSpreadsheetIcon className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                {value.invoice_number}
                                <span className="font-medium text-foreground ml-2">
                                  {`${value.total_amount} ${value.currency}`}
                                </span>
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={addPaymentForm.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Amount" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={addPaymentForm.control}
              name="paymentDate"
              render={({ field }) => (
                <FormItem className="flex flex-col mt-3">
                  <FormLabel>Payment Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            '  text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Payment Date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date('2000-01-01')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={addPaymentForm.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment method</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Payment method"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={addPaymentForm.control}
              name="payment_reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reference number of the payment</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Reference number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">{isLoading ? 'Loading...' : 'Save'}</Button>

              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
