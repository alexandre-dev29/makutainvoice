import * as React from 'react';
import { Document, Page, View, Font } from '@react-pdf/renderer';
import { ClientType, CompanyType, NewStatementType } from '@makutainv/types';
import { template_1_style } from '@/components/invoice-templates/template1-components/styleConfig';
import { ClientInformationStatement } from '@/components/statement-templates/client-statement-components/client-information';
import { CompanyInformationStatement } from '@/components/statement-templates/client-statement-components/company-information';
import { StatementTitle } from '@/components/statement-templates/client-statement-components/statement-title';
import {
  ClientStatementTableBody,
  ClientStatementTableHead,
  ClientStatementTableTotal,
} from '@/components/statement-templates/client-statement-components/table';
Font.register({
  family: 'Poppins',
  fonts: [
    {
      src: '/Poppins-Regular.ttf',
      fontWeight: 400,
    },
    {
      src: '/Poppins-Bold.ttf',
      fontWeight: 700,
    },
  ],
});

// Create Document Component

export const ClientStatementTemplate = ({
  invoiceData,
  clientInformation,
  companyInformation,
  currentLocal,
}: {
  companyInformation: CompanyType;
  clientInformation: ClientType;
  invoiceData: NewStatementType[] | undefined;
  currentLocal: string;
}) => {
  const total = invoiceData?.reduce(
    (sum, item) => sum + ((item.total_amount ?? 0) - (item.total_paid ?? 0)),
    0
  );
  return (
    <Document>
      <Page size="A4" style={template_1_style.page}>
        <View style={{ display: 'flex', flexDirection: 'column' }}>
          <StatementTitle
            logoSrc={`${companyInformation.logo}`}
            currentLocal={currentLocal}
          />
          <CompanyInformationStatement
            company_name={`${companyInformation.company_name}`}
            logo={`${companyInformation.logo}`}
            phone={`${companyInformation.phone}`}
            email={`${companyInformation.email}`}
            address={`${companyInformation.address}`}
            company_id={companyInformation.company_id}
            created_by_id={''}
          />
          <ClientInformationStatement
            phone={`${clientInformation.phone}`}
            email={`${clientInformation.email}`}
            address={`${clientInformation.address}`}
            client_name={`${clientInformation.client_name}`}
            client_id={clientInformation.client_id ?? 0}
            company_id={clientInformation.company_id}
            currency={invoiceData === undefined ? '' : invoiceData[0].currency}
            total={total}
            contact_person={''}
          />
          <ClientStatementTableHead />
          <ClientStatementTableBody
            invoiceItems={invoiceData === undefined ? [] : invoiceData}
            currency={invoiceData === undefined ? '' : invoiceData[0].currency}
          />
          <ClientStatementTableTotal
            invoiceItem={invoiceData === undefined ? [] : invoiceData}
            currency={invoiceData === undefined ? '' : invoiceData[0].currency}
          />
        </View>
      </Page>
    </Document>
  );
};
