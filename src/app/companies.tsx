import {
  DeleteIcon,
  File,
  ListFilter,
  MoreHorizontal,
  PenBox,
  PlusCircle,
  Trash2,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';

import { Button } from '@/components/ui/button';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { makutaQueries } from '@makutainv/configs';
import { useQuery } from '@tanstack/react-query';

const CompaniesPage = () => {
  const { data } = useQuery({
    ...makutaQueries.companies.list(),
    staleTime: 1000 * 60 * 10,
  });
  return (
    <div>
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" className="p-5 flex gap-2">
            <PlusCircle className="h-5 w-5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap text-[15px]">
              Add company
            </span>
          </Button>
        </div>
      </div>
      <Card x-chunk="dashboard-06-chunk-0" className="mt-4">
        <CardHeader>
          <CardTitle className="text-2xl">Companies</CardTitle>
          <CardDescription>
            Manage your companies and view their informations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  Id
                  <span className="sr-only">Id</span>
                </TableHead>
                <TableHead>Comany name</TableHead>
                <TableHead>Company email</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead className="hidden md:table-cell">Adrres</TableHead>
                <TableHead className="hidden md:table-cell">
                  Created at
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data &&
                data.data &&
                data.data.map(
                  ({
                    company_id,
                    company_name,
                    email,
                    phone,
                    address,
                    created_at,
                  }) => (
                    <TableRow>
                      <TableCell className="hidden sm:table-cell">
                        {company_id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {company_name}
                      </TableCell>
                      <TableCell>{email}</TableCell>
                      <TableCell>{phone}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {address}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {created_at}
                      </TableCell>
                      <TableCell className="flex gap-4">
                        <PenBox size={20} className="text-primary" />
                        <Trash2 size={20} className="text-red-600" />
                      </TableCell>
                    </TableRow>
                  )
                )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            <strong>32</strong> companies
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CompaniesPage;
