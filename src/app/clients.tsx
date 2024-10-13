import React from 'react';
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
import { useQuery } from '@tanstack/react-query';
import { makutaQueries, useCompanyState } from '@makutainv/configs';
import { AddClients } from '@/components/add-clients';

const Clients = () => {
  const { currentCompany } = useCompanyState();
  const { data } = useQuery({
    ...makutaQueries.clients.listByCompany(Number.parseInt(currentCompany)),
    staleTime: 1000 * 60 * 10,
  });
  return (
    <div>
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2">
          <AddClients />
        </div>
      </div>
      <Card x-chunk="dashboard-06-chunk-0" className="mt-4">
        <CardHeader>
          <CardTitle className="text-2xl">Clients</CardTitle>
          <CardDescription>
            Manage your clients according to the company selected and view their
            informations.
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
                <TableHead>Client name</TableHead>
                <TableHead>Contact person</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Adrres</TableHead>
                <TableHead className="hidden md:table-cell">
                  VAT Number
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
                  (
                    {
                      client_name,
                      email,
                      phone,
                      contact_person,
                      address,
                      vat_number,
                    },
                    index
                  ) => (
                    <TableRow>
                      <TableCell className="hidden sm:table-cell">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {client_name}
                      </TableCell>
                      <TableCell>{contact_person}</TableCell>
                      <TableCell>{email}</TableCell>
                      <TableCell>{phone}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {address}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {vat_number}
                      </TableCell>
                      <TableCell className="flex gap-4">
                        {/* <PenBox size={20} className="text-primary" /> */}
                        {/* <Trash2 size={20} className="text-red-600" /> */}
                      </TableCell>
                    </TableRow>
                  )
                )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          {/* <div className="text-xs text-muted-foreground">
            <strong>32</strong> companies
          </div> */}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Clients;
