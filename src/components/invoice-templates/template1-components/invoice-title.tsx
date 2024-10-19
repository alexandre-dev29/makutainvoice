import { Image, Text, View } from '@react-pdf/renderer';
import * as React from 'react';
import { template_1_style } from '@/components/invoice-templates/template1-components/styleConfig';

export const InvoiceTitle = ({
  invoiceNumber,
  invoiceDueDate,
  logoSrc,
}: {
  invoiceNumber: string;
  invoiceDueDate: string;
  logoSrc: string;
}) => (
  <View style={template_1_style.titleContainer}>
    <View style={template_1_style.spaceBetween}>
      <View>
        <Text style={template_1_style.reportTitle}>
          Invoice {invoiceNumber}
        </Text>
        <Text style={template_1_style.reportSubTitle}>
          Due Date : {invoiceDueDate}
        </Text>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
        }}
      >
        <Image style={template_1_style.logo} src={logoSrc} />
      </View>
    </View>
  </View>
);
