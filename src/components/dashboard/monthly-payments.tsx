import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { MonthlyRevenueType, PaymentsType } from '@makutainv/types';
import { useMemo } from 'react';
import { calculateTotalRevenueByMonth } from '@/components/utils';

const chartConfig = {
  desktop: {
    label: 'Payments',
    color: 'hsl(var(--chart-6))',
  },
} satisfies ChartConfig;

interface MonthlyPaymentsProps {
  revenues: Array<PaymentsType>;
}

export function MonthlyPayments({ revenues }: MonthlyPaymentsProps) {
  const monthlyPayments = useMemo<Array<MonthlyRevenueType>>(() => {
    const formatter = new Intl.DateTimeFormat('fr', { month: 'long' });

    const allPaymentRevenue = revenues.map((value) => ({
      monthName: formatter.format(new Date(value.payment_date)),
      monthRevenue: value.amount,
      monthNumber: new Date(value.payment_date).getMonth(),
    }));
    return calculateTotalRevenueByMonth(allPaymentRevenue);
  }, [revenues]);
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Monthly revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={monthlyPayments}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="monthName"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="monthRevenue"
              fill="var(--color-desktop)"
              radius={10}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
