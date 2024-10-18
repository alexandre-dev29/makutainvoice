import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { HousePlus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { makutaQueries, useCompanyState } from '@makutainv/configs';

export const CompanyList = () => {
  const { currentCompany, setCurrentCompany, setCurrentInformation } =
    useCompanyState();
  const { data, isPending } = useQuery({
    ...makutaQueries.companies.list(),
    staleTime: 1000 * 60 * 10,
  });
  if (!isPending && currentCompany === '' && data?.data) {
    setCurrentCompany(`${data?.data[0]?.company_id}`);
    setCurrentInformation({
      logo: `${data?.data[0]?.logo}`,
      address: `${data?.data[0]?.address}`,
      name: `${data?.data[0]?.company_name}`,
      name: `${data?.data[0]?.phone}`,
    });
  }
  if (isPending) return <p>Loading</p>;
  return (
    <div className="w-2/12 flex-1 md:grow-0">
      <Select
        value={currentCompany}
        onValueChange={(value) => {
          setCurrentCompany(value);
          const company = data?.data?.filter(
            (company) => company.company_id === Number.parseInt(value)
          )[0];
          if (company) {
            setCurrentInformation({
              logo: `${company.logo}`,
              address: `${company.address}`,
              name: `${company.company_name}`,
              telephone: `${company.phone}`,
            });
          }
        }}
      >
        <SelectTrigger
          id="model"
          className="items-start [&_[data-description]]:hidden"
        >
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          {data?.data?.map((value) => (
            <SelectItem value={`${value.company_id}`} key={Math.random()}>
              <div className="flex items-start gap-3 text-muted-foreground">
                <HousePlus className="size-5" />
                <div className="grid gap-0.5">
                  <p>
                    {value.company_name}
                    <span className="font-medium text-foreground ml-2">
                      {value.email}
                    </span>
                  </p>
                  <p className="text-xs" data-description={value.address}>
                    {value.address}
                  </p>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
