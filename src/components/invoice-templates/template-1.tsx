import * as React from 'react';
import { Document, Page, Text, View, Font } from '@react-pdf/renderer';
import { InvoiceItemType, InvoiceType } from '@makutainv/types';
import { template_1_style } from '@/components/invoice-templates/template1-components/styleConfig';
import { InvoiceTitle } from '@/components/invoice-templates/template1-components/invoice-title';
import { CompanyInformation } from '@/components/invoice-templates/template1-components/company-information';
import { ClientInformation } from '@/components/invoice-templates/template1-components/client-information';
import {
  Invoice1TableTotal,
  Invoice1TableBody,
  Invoice1TableHead,
} from '@/components/invoice-templates/template1-components/table';
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

export const InvoiceTemplate1 = ({
  invoiceData,
  items,
}: {
  invoiceData: InvoiceType;
  items: Array<InvoiceItemType>;
}) => (
  <Document>
    <Page size="A4" style={template_1_style.page}>
      <View style={{ display: 'flex', flexDirection: 'column' }}>
        <InvoiceTitle
          invoiceNumber={invoiceData.invoice_number}
          invoiceDueDate={`${invoiceData.due_date?.toLocaleDateString(
            'fr-FR'
          )}`}
          logoSrc={`${invoiceData.companies?.logo}`}
        />
        <CompanyInformation
          company_name={`${invoiceData.companies?.company_name}`}
          logo={`${invoiceData.companies?.logo}`}
          phone={`${invoiceData.companies?.phone}`}
          email={`${invoiceData.companies?.email}`}
          address={`${invoiceData.companies?.address}`}
          company_id={invoiceData.company_id}
          created_by_id={''}
        />
        <ClientInformation
          phone={`${invoiceData.clients?.phone}`}
          email={`${invoiceData.clients?.email}`}
          address={`${invoiceData.clients?.address}`}
          client_name={`${invoiceData.clients?.client_name}`}
          client_id={invoiceData.clients?.client_id ?? 0}
          company_id={invoiceData.company_id}
        />
        <Invoice1TableHead />
        <Invoice1TableBody
          invoiceItems={[
            ...items.map((value: InvoiceItemType) => ({
              quantity: value.quantity,
              price: value.price,
              description: value.description,
              item_id: value.item_id,
              invoice_id: value.invoice_id,
              tax_rate: value.tax_rate,
            })),
          ]}
          currency={invoiceData.currency}
        />
        <Invoice1TableTotal
          invoiceItem={[
            ...items.map((value: InvoiceItemType) => ({
              quantity: value.quantity,
              price: value.price,
              description: value.description,
              item_id: value.item_id,
              invoice_id: value.invoice_id,
              tax_rate: value.tax_rate,
            })),
          ]}
          currency={invoiceData.currency}
        />
        {invoiceData.notes && (
          <View
            style={{
              marginTop: 50,
              backgroundColor: 'rgba(255,244,202,0.8)',
              paddingVertical: 4,
              paddingHorizontal: 16,
            }}
          >
            <Text style={{ color: 'hsl( 220 8.9% 46.1%)' }}>
              {invoiceData.notes}
            </Text>
          </View>
        )}
      </View>
    </Page>
  </Document>
);
