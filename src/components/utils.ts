import { MonthlyRevenueType } from '@makutainv/types';

export const calculateTotalRevenueByMonth = (
  monthlyRevenueData: MonthlyRevenueType[]
): MonthlyRevenueType[] => {
  const groupedData: { [monthName: string]: MonthlyRevenueType[] } = {};

  // Group by monthName
  for (const item of monthlyRevenueData) {
    const { monthName } = item;
    if (!groupedData[monthName]) {
      groupedData[monthName] = [];
    }
    groupedData[monthName].push(item);
  }

  // Calculate total revenue for each month
  const totalRevenueByMonth: MonthlyRevenueType[] = [];
  for (const monthName in groupedData) {
    const monthRevenueItems = groupedData[monthName];
    let totalRevenue = 0;
    for (const item of monthRevenueItems) {
      totalRevenue += item.monthRevenue; // Assuming monthRevenue is a string representing a number
    }
    totalRevenueByMonth.push({
      monthName,
      monthRevenue: totalRevenue,
    });
  }

  return totalRevenueByMonth;
};

export const getInitials = (fullName: string) => {
  const allNames = fullName.trim().split(' ');
  return allNames.reduce((acc, curr, index) => {
    if (index === 0 || index === allNames.length - 1) {
      acc = `${acc}${curr.charAt(0).toUpperCase()}`;
    }
    return acc;
  }, '');
};
export const formatNumber = (currentNumber: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(currentNumber);
