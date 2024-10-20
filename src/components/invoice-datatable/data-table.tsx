'use client';

import * as React from 'react';
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from '@radix-ui/react-icons';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { makutaQueries } from '@makutainv/configs';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { DownloadCloudIcon, SendIcon } from 'lucide-react';
import { Link } from '@tanstack/react-router';

let data: Payment[] = [];

export type Payment = {
  id: string;
  amount: number;
  status: string;
  email: string;
  clientName: string;
  clientPhoneNumber: string;
  created: string;
  dueDate: string;
  currency: string;
  totalPaid: number;
  invoiceNumber: string;
};

const getBadgeColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-yellow-500';
    case 'Paid':
      return 'bg-green-600';
    case 'Cancel':
      return 'bg-red-600';
    default:
      return 'bg-primary';
  }
};

export const columns: ColumnDef<Payment>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'invoiceNumber',
    header: () => <p className="font-bold">Invoice Number</p>,
    cell: ({ row }) => (
      <Link
        to={`/invoices/${row.getValue('invoiceNumber')}`}
        className="font-bold text-primary cursor-pointer"
      >
        {row.getValue('invoiceNumber')}
      </Link>
    ),
  },
  {
    accessorKey: 'clientName',
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Client name
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-center font-bold capitalize">
        {row.getValue('clientName')}
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Email
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-center font-bold capitalize">
        {row.getValue('email')}
      </div>
    ),
  },

  {
    accessorKey: 'clientPhoneNumber',
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-center"
        >
          Phone Number
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue('clientPhoneNumber')}</div>
    ),
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-center">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

      return <div className="text-center font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'totalPaid',
    header: () => <div className="text-center">Total Paid</div>,
    cell: ({ row }) => {
      const totalAmount = parseFloat(row.getValue('totalPaid'));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(totalAmount);

      return <div className="text-center font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'created',
    header: 'Created At',
    cell: ({ row }) => <p className="font-bold">{row.getValue('created')}</p>,
  },
  {
    accessorKey: 'dueDate',
    header: 'Due Date',
    cell: ({ row }) => <p className="font-bold">{row.getValue('dueDate')}</p>,
  },

  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge className={`capitalize ${getBadgeColor(row.getValue('status'))}`}>
        {row.getValue('status')}
      </Badge>
    ),
  },

  // {
  //   id: 'actions',
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <DotsHorizontalIcon className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuItem className="cursor-pointer flex gap-2">
  //             <DownloadCloudIcon size={16} />
  //             Download PDF
  //           </DropdownMenuItem>
  //           <DropdownMenuItem className="cursor-pointer flex gap-2">
  //             <SendIcon size={16} />
  //             Send to the client
  //           </DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];

export function InvoiceDataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const { data: dataInvoices, isLoading } = useQuery({
    ...makutaQueries.invoices.list(),
    staleTime: 1000 * 60 * 10,
  });
  const invoiceMemo = useMemo<Payment[]>(() => {
    const invoices: Payment[] =
      (dataInvoices &&
        dataInvoices.data &&
        dataInvoices.data.map((value) => {
          return {
            invoiceNumber: value.invoice_number,
            clientPhoneNumber: `${value.clients?.phone}`,
            totalPaid: value.total_paid ?? 0,
            currency: value.currency,
            dueDate:
              new Date(`${value.due_date}`).toLocaleDateString('fr-Fr') ?? '',
            amount: value.total_amount ?? 0,
            created:
              new Date(`${value.created_at}`).toLocaleDateString('fr-Fr') ?? '',
            status: value.status,
            clientName: `${value.clients?.client_name}`,
            email: `${value.clients?.email}`,
            id: value.invoice_number,
          };
        })) ??
      [];
    return invoices;
  }, [dataInvoices]);

  data = [...invoiceMemo];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <Skeleton className="w-[20%] h-[40px] rounded-md" />
            <Skeleton className="w-[11%] h-[40px] rounded-md" />
          </div>
          <Skeleton className="h-[40px] rounded-md" />
          <Skeleton className="h-[30px] rounded-md" />
          <Skeleton className="h-[30px] rounded-md" />
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter emails..."
            value={
              (table.getColumn('clientName')?.getFilterValue() as string) ?? ''
            }
            onChange={(event) => {
              table.getColumn('clientName')?.setFilterValue(event.target.value);
            }}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
