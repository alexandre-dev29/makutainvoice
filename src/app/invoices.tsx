import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Link } from '@tanstack/react-router';
import { InvoiceDataTable } from '@/components/invoice-datatable/data-table';

export function HomePage() {
  return (
    <div>
      <Card x-chunk="dashboard-06-chunk-0" className="mt-4">
        <CardHeader className="flex justify-between flex-row">
          <div>
            <CardTitle className={'font-bold text-2xl'}>Invoices</CardTitle>
            <CardDescription>
              Manage your invoices and view their sales performance.
            </CardDescription>
          </div>
          <Link to="/invoices/create-invoice">
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Create new invoice
              </span>
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <InvoiceDataTable />
        </CardContent>
      </Card>
    </div>
  );
}

export default HomePage;
