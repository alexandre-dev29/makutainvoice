import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCompanyState } from '@makutainv/configs';
import { formatNumber, getInitials } from '@/components/utils';
import { PaymentsType } from '@makutainv/types';

interface RecentPaymentsProps {
  recentPayments: Array<PaymentsType>;
}

export function RecentPayments({ recentPayments }: RecentPaymentsProps) {
  const { companyInformation } = useCompanyState();
  return (
    <div className="space-y-8 pr-4">
      {recentPayments.map((value) => (
        <div key={value.payment_id} className="flex items-center">
          <Avatar className=" w-14 h-8">
            <AvatarImage src={companyInformation.logo} alt="Avatar" />
            <AvatarFallback>
              {getInitials(companyInformation.name)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {value.invoices?.invoice_number}
            </p>
            <p className="text-sm text-muted-foreground">
              {new Date(value.payment_date).toLocaleDateString('fr-FR')}
            </p>
          </div>
          <div className="ml-auto font-medium">
            {formatNumber(value.amount)}
          </div>
        </div>
      ))}
    </div>
  );
}
