import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { makutaQueries, useCompanyState } from '@makutainv/configs';
import { useQuery } from '@tanstack/react-query';
import { MonthlyPayments } from '@/components/dashboard/monthly-payments';
import { RecentPayments } from '@/components/recent-payments';
import { formatNumber } from '@/components/utils';

const MakutaDashboard = () => {
  const { currentCompany } = useCompanyState();
  const { data } = useQuery(
    makutaQueries.dashboardRequests.listInvoiceMoneyByCompany(
      Number.parseInt(currentCompany)
    )
  );
  const { data: paymentsData } = useQuery(
    makutaQueries.dashboardRequests.listOfPaymentsByCompany(
      Number.parseInt(currentCompany)
    )
  );
  const isThisMonth = (payment_date: string) =>
    new Date(payment_date).getMonth() === new Date().getMonth();
  const totalInvoiceMoney = useMemo<number | undefined>(() => {
    const dataCured = data && data.data;
    return dataCured?.reduce((sum, item) => sum + (item.total_amount ?? 0), 0);
  }, [data]);

  const totalRevenue = useMemo<number | undefined>(() => {
    const dataCured = paymentsData && paymentsData.data;
    return dataCured?.reduce((sum, item) => sum + (item.amount ?? 0), 0);
  }, [paymentsData]);
  const totalRevenueThisMonth = useMemo<number | undefined>(() => {
    const dataCured = paymentsData && paymentsData.data;
    return dataCured
      ?.filter((a) => isThisMonth(a.payment_date))
      .reduce((sum, item) => sum + (item.amount ?? 0), 0);
  }, [paymentsData]);

  return (
    <div className="px-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total invoices
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(totalInvoiceMoney ?? 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total revenue</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(totalRevenue ?? 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total remaining
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatNumber((totalInvoiceMoney ?? 0) - (totalRevenue ?? 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Revenue this month
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatNumber(totalRevenueThisMonth ?? 0)}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <MonthlyPayments
          revenues={[
            ...(paymentsData?.data?.map((value) => ({ ...value })) ?? []),
          ]}
        />
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>
              You made{' '}
              {paymentsData &&
                paymentsData.data &&
                paymentsData.data.filter((value) =>
                  isThisMonth(value.payment_date)
                ).length}{' '}
              sales this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentPayments
              recentPayments={[
                ...(
                  paymentsData?.data
                    ?.filter((value) => isThisMonth(value.payment_date))
                    .map((value) => ({ ...value })) ?? []
                ).slice(0, 5),
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MakutaDashboard;
