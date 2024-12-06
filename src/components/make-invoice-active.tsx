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
import { Button } from '@/components/ui/button';
import { CheckSquareIcon } from 'lucide-react';
import React, { FC, useState } from 'react';
import {
  makutaQueries,
  makutaQueryClient,
  supabase,
  useCompanyState,
} from '@makutainv/configs';

export const MakeInvoiceActive: FC<{ invoiceId: number; isDraft: boolean }> = ({
  invoiceId,
}) => {
  const { currentCompany } = useCompanyState();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const makeItActive = async () => {
    const { error } = await supabase
      .from('invoices')
      .update({ isDraft: false, status: 'Active' })
      .eq('invoice_id', invoiceId);
    if (!error) {
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
        refetchType: 'all',
      });
      await makutaQueryClient.invalidateQueries({
        queryKey: makutaQueries.invoices.listByCompany(
          Number.parseInt(currentCompany)
        ).queryKey,
        refetchType: 'all',
      });
      setIsModalOpen(false);
      // eslint-disable-next-line no-restricted-globals
      location.reload();
    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex left-0 gap-2 px-2 mt-1">
          <CheckSquareIcon size={14} />
          <span>Make Active</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Make invoice active</DialogTitle>
          <DialogDescription>
            You are about to make this invoice active, this means that the
            amount will be considered on calculations
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4"></div>
        <DialogFooter>
          <Button onClick={makeItActive}>Confirm</Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
