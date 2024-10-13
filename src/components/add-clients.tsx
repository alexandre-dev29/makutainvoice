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
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  makutaQueries,
  makutaQueryClient,
  supabase,
  useCompanyState,
} from '@makutainv/configs';
import { ToastAction } from '@/components/ui/toast';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
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

export const AddClients = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { currentCompany } = useCompanyState();
  const addCompanySchema = z.object({
    name: z
      .string({ message: 'The name is required' })
      .min(2, 'the minimum letter is 2'),
    contactPerson: z
      .string({ message: 'The contact person is required' })
      .min(2, 'the minimum letter is 2'),
    vatNumber: z.string().min(2, 'the minimum letter is 2').optional(),
    phoneNumber: z
      .string({ message: 'The phone number is required' })
      .min(6, 'the phone number must have at least 6 character'),
    email: z
      .string({ message: 'the email is required' })
      .email('please write a correct email'),
    adress: z
      .string({ message: 'The name is required' })
      .min(8, 'the minimum letter is 2'),
  });
  const addCompanyForm = useForm<z.infer<typeof addCompanySchema>>({
    resolver: zodResolver(addCompanySchema),
  });
  const sendAddCompany: SubmitHandler<
    z.infer<typeof addCompanySchema>
  > = async ({
    adress,
    email,
    name,
    phoneNumber,
    contactPerson,
    vatNumber,
  }) => {
    setIsLoading(true);

    const { error } = await supabase.from('clients').insert({
      email: email,
      address: adress,
      phone: phoneNumber,
      client_name: name,
      vat_number: vatNumber,
      contact_person: contactPerson,
      company_id: Number.parseInt(currentCompany),
    });
    setIsLoading(false);
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error while trying to create a new client',
        description: error?.message,
      });
    }
    if (!error) {
      addCompanyForm.reset();
      toast({
        title: 'Company created',
        description: 'The client has been created successfully.',
        action: <ToastAction altText="Okay">Okay</ToastAction>,
      });
      // invalidate all the list queries
      await makutaQueryClient.invalidateQueries({
        queryKey: makutaQueries.clients.listByCompany(
          Number.parseInt(currentCompany)
        ).queryKey,
        refetchType: 'active',
      });
      setIsModalOpen(false);
    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="p-5 flex gap-2">
          <PlusCircle className="h-5 w-5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap text-[15px]">
            Add clients
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <Form {...addCompanyForm}>
          <form
            onSubmit={addCompanyForm.handleSubmit(sendAddCompany)}
            className="grid gap-4 py-4"
          >
            <DialogHeader>
              <DialogTitle>Add a new client</DialogTitle>
              <DialogDescription>
                create a new client in the company selected.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              <FormField
                control={addCompanyForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="client name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addCompanyForm.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact person</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Contact person"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addCompanyForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@exxample.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addCompanyForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Company phone number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addCompanyForm.control}
                name="adress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adress</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="client adress"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addCompanyForm.control}
                name="vatNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vat Number</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Vat Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
