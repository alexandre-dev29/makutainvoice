import * as React from 'react';
import { Document, Page, View, Font } from '@react-pdf/renderer';
import { ClientStatementType, ClientType, CompanyType } from '@makutainv/types';
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
  invoiceData: ClientStatementType[];
  currentLocal: string;
}) => (
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
          contact_person={''}
        />
        <ClientStatementTableHead />
        <ClientStatementTableBody
          invoiceItems={[
            ...invoiceData.map((value) => ({
              invoiceNumber: value.invoiceNumber,
              totalPaid: value.totalPaid,
              totalAmount: value.totalAmount,
              currency: value.currency,
            })),
          ]}
          currency={invoiceData[0]?.currency}
        />
        <ClientStatementTableTotal
          invoiceItem={[
            ...invoiceData.map((value) => ({
              invoiceNumber: value.invoiceNumber,
              totalPaid: value.totalPaid,
              totalAmount: value.totalAmount,
              currency: value.currency,
            })),
          ]}
          currency={invoiceData[0]?.currency}
        />
      </View>
    </Page>
  </Document>
);
