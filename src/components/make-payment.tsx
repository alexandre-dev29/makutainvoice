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
import React, { FC, useState } from 'react';
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

type makePaymentProps = {
  invoice_id: number;
  invoice_number: string;
  isOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const MakeInvoicePayment: FC<makePaymentProps> = ({
  invoice_id,
  invoice_number,
  isOpen,
  setModalOpen,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { currentCompany } = useCompanyState();

  const makePaymentSchema = z.object({
    paymentDate: z.date({ message: 'The date is required' }),
    amount: z.coerce
      .number()
      .min(1, { message: 'The amount must be greater than 0' }),
    payment_method: z.string({}).optional(),
    payment_reference: z.string().optional(),
  });
  const addPaymentForm = useForm<z.infer<typeof makePaymentSchema>>({
    resolver: zodResolver(makePaymentSchema),
  });
  const sendAddPayment: SubmitHandler<
    z.infer<typeof makePaymentSchema>
  > = async ({ paymentDate, payment_method, payment_reference, amount }) => {
    setIsLoading(true);
    const { data: dataInvoice } = await supabase
      .from('invoices')
      .select('invoice_id, invoice_number, total_amount, total_paid')
      .eq('invoice_id', invoice_id)
      .single();

    const { error } = await supabase.from('payments').insert({
      invoice_id: invoice_id,
      payment_date: paymentDate.toString(),
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
        .update({ total_paid: (dataInvoice?.total_paid ?? 0) + amount });

      if (!errorUpdate) {
        addPaymentForm.reset();

        toast({
          title: 'Payment created',
          description: 'The payment has been created successfully.',
          action: <ToastAction altText="Okay">Okay</ToastAction>,
        });
        // invalidate all the list queries
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

        setModalOpen(false);
      }
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...addPaymentForm}>
          <form
            onSubmit={addPaymentForm.handleSubmit(sendAddPayment)}
            className="grid gap-4 py-4"
          >
            <DialogHeader>
              <DialogTitle>Add a new payment for {invoice_number}</DialogTitle>
              <DialogDescription>
                create a new payment, fill information and click Save.
              </DialogDescription>
            </DialogHeader>

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
