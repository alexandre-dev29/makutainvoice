import { Card } from '@/components/ui/card';

import CreateInvoiceForm from '@/components/create-invoice-form';

export function CreateInvoicePage() {
  return (
    <div>
      <div className="flex justify-between my-4 ">
        <h2 className="font-bold text-3xl text-gray-800">New invoice</h2>
      </div>
      <div className="grid grid-cols-5 gap-x-6">
        <CreateInvoiceForm />
      </div>
    </div>
  );
}
