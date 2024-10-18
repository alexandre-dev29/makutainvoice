import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type companyStateProps = {
  currentCompany: string;
  companyInformation: companyInformation;
  setCurrentCompany: (currentCompany: string) => void;
  setCurrentInformation: (currentCompany: companyInformation) => void;
};
type companyInformation = {
  name: string;
  logo: string;
  address: string;
  telephone: string;
};

export const useCompanyState = create<companyStateProps>()(
  devtools(
    persist(
      (set) => ({
        currentCompany: '',
        companyInformation: { address: '', name: '', logo: '', telephone: '' },
        setCurrentCompany: (currentCompany: string) =>
          set({ currentCompany: currentCompany }),
        setCurrentInformation: (companyInformation: companyInformation) =>
          set({ companyInformation: companyInformation }),
      }),
      {
        name: 'makuta-company-states',
      }
    )
  )
);
