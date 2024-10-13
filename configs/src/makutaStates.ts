import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type companyStateProps = {
  currentCompany: string;
  setCurrentCompany: (currentCompany: string) => void;
};

export const useCompanyState = create<companyStateProps>()(
  devtools(
    persist(
      (set) => ({
        currentCompany: '',
        setCurrentCompany: (currentCompany: string) =>
          set({ currentCompany: currentCompany }),
      }),
      {
        name: 'makuta-company-states',
      }
    )
  )
);
