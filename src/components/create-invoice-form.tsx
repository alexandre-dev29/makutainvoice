import React, { Fragment, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, User2 } from 'lucide-react';
import * as z from 'zod';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { createInvoiceFormSchema, InvoiceItem } from '@makutainv/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import {
  makutaQueries,
  makutaQueryClient,
  supabase,
  useCompanyState,
} from '@makutainv/configs';
import { cn } from '@/lib/utils';
import { CalendarIcon } from '@radix-ui/react-icons';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import InvoicePreviewer from '@/components/invoice-previewer';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from '@tanstack/react-router';

const CreateInvoiceForm = () => {
  const { currentCompany } = useCompanyState();
  const invoiceForm = useForm<z.infer<typeof createInvoiceFormSchema>>({
    resolver: zodResolver(createInvoiceFormSchema),
    defaultValues: {
      invoiceItems: [{ itemQuantity: 1, itemPrice: 1, itemName: '' }],
    },
  });
  const { toast } = useToast();
  const {
    control: controlForm,
    register: registerForm,
    formState: { errors },
    watch,
  } = invoiceForm;

  const watchAllFields = watch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createInvoice: SubmitHandler<
    z.infer<typeof createInvoiceFormSchema>
  > = async (value) => {
    setIsLoading(true);
    const currentUser = await supabase.auth.getSession();
    const total = value.invoiceItems.reduce(
      (previousValue, currentValue) =>
        previousValue + currentValue.itemPrice * currentValue.itemQuantity,
      0
    );
    const { data } = await supabase
      .from('invoices')
      .insert({
        company_id: Number.parseInt(currentCompany),
        client_id: Number.parseInt(value.clientId),
        invoice_number: value.invoiceNumber,
        invoice_date: new Date().toISOString(),
        currency: value.currency,
        status: 'Active',
        due_date: value.invoiceDueDate.toISOString(),
        notes: value.invoiceNote,
        total_amount: total,
        created_by_id: `${currentUser.data.session?.user.id}`,
      })
      .select('*')
      .single();
    if (data) {
      const { data: dataItems } = await supabase
        .from('invoiceitems')
        .insert([
          ...value.invoiceItems.map((item) => ({
            invoice_id: data.invoice_id,
            description: `${item.itemName}`,
            price: item.itemPrice,
            quantity: item.itemQuantity,
          })),
        ])
        .select();

      if (dataItems) {
        toast({
          title: 'Invoice created',
          description: 'The invoice has been created successfully.',
          action: <ToastAction altText="Okay">Okay</ToastAction>,
        });
        await makutaQueryClient.invalidateQueries({
          queryKey: makutaQueries.invoices.list._def,
          refetchType: 'active',
        });
        invoiceForm.reset();
        await router.invalidate();
        await router.navigate({ to: '/invoices' });
        setIsLoading(false);
      }
    }
  };
  const { data: allClient } = useQuery({
    ...makutaQueries.clients.listByCompany(Number.parseInt(currentCompany)),
    staleTime: 1000 * 60 * 10,
  });

  const { fields, append, remove } = useFieldArray<
    z.infer<typeof createInvoiceFormSchema>
  >({
    name: 'invoiceItems',
    control: controlForm,
  });

  const currentClient =
    allClient &&
    allClient.data &&
    allClient.data.filter(
      (item) => item.client_id.toString() === watchAllFields.clientId
    )[0];
  return (
    <Fragment>
      <div className="col-span-3">
        <Card x-chunk="dashboard-07-chunk-0">
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
            <CardDescription>
              Complete all invoice details to create a new invoice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...invoiceForm}>
              <form onSubmit={invoiceForm.handleSubmit(createInvoice)}>
                <div className="grid gap-6 grid-cols-2">
                  <FormField
                    control={invoiceForm.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice for</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a verified email to display" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {allClient &&
                              allClient.data &&
                              allClient.data.map((value) => (
                                <SelectItem
                                  value={`${value.client_id}`}
                                  key={value.client_id}
                                >
                                  <div className="flex items-start gap-3 text-muted-foreground">
                                    <User2 className="size-5" />
                                    <div className="grid gap-0.5">
                                      <p>
                                        {value.client_name}
                                        <span className="font-medium text-foreground ml-2">
                                          {value.email}
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
                    control={invoiceForm.control}
                    name="invoiceNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice Number</FormLabel>
                        <FormControl>
                          <Input placeholder="ex:INVX-001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={invoiceForm.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <FormControl>
                          <Input placeholder="ex:USD" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={invoiceForm.control}
                    name="invoiceDueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col mt-3">
                        <FormLabel>Invoice due date</FormLabel>
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
                                  <span>Due date</span>
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
                    control={invoiceForm.control}
                    name="invoiceNote"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Invoice notes</FormLabel>
                        <FormControl>
                          <Textarea
                            className="min-h-20 col-span-2"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Separator className="my-4" />
                <div className="flex justify-center flex-col">
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
                                {...registerForm(
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
                                {...registerForm(
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
                                {...registerForm(
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
                  <Button
                    size="sm"
                    type={'button'}
                    variant="ghost"
                    className="gap-2 text-[16px] mt-2 "
                    onClick={() => {
                      append({ itemName: '', itemPrice: 0, itemQuantity: 0 });
                    }}
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    Add Variant
                  </Button>
                </div>

                <div className="flex gap-6 self-end">
                  <Button type="submit">
                    {isLoading ? 'Saving.......' : 'Save'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <InvoicePreviewer
        {...watchAllFields}
        clientAddress={currentClient?.address ?? ''}
        clientName={currentClient?.client_name ?? ''}
        clientNumber={currentClient?.phone ?? ''}
      />
    </Fragment>
  );
};

export default CreateInvoiceForm;
