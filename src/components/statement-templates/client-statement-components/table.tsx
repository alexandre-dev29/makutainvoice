import { Text, View } from '@react-pdf/renderer';
import { Fragment } from 'react';
import * as React from 'react';

import { ClientStatementType } from '@makutainv/types';
import { template_1_style_statement } from '@/components/statement-templates/client-statement-components/styleConfig';

export const ClientStatementTableHead = () => (
  <View style={{ width: '100%', flexDirection: 'row' }}>
    <View style={{ ...template_1_style_statement.theader, width: 70 }}>
      <Text style={template_1_style_statement.tableHeaderText}>Id</Text>
    </View>
    <View style={{ ...template_1_style_statement.theader, width: 350 }}>
      <Text style={template_1_style_statement.tableHeaderText}>
        Invoice number
      </Text>
    </View>

    <View style={{ ...template_1_style_statement.theader, width: 300 }}>
      <Text style={template_1_style_statement.tableHeaderText}>
        Total Amount
      </Text>
    </View>
    <View style={{ ...template_1_style_statement.theader, width: 200 }}>
      <Text style={template_1_style_statement.tableHeaderText}>Total Paid</Text>
    </View>
    <View style={{ ...template_1_style_statement.theader, width: 300 }}>
      <Text style={template_1_style_statement.tableHeaderText}>
        Total Remaining
      </Text>
    </View>
  </View>
);

export const ClientStatementTableBody = ({
  currency,
  invoiceItems,
}: {
  currency: string;
  invoiceItems: ClientStatementType[];
}) =>
  invoiceItems.map((receipt, index) => (
    <Fragment key={receipt.invoiceNumber}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          paddingVertical: 3,
          borderColor: '#6b7280',
          borderBottomWidth: 1,
        }}
      >
        <View
          style={{ width: 70, ...template_1_style_statement.tBodyElements }}
        >
          <Text>{index + 1}</Text>
        </View>
        <View
          style={{ ...template_1_style_statement.tBodyElements, width: 350 }}
        >
          <Text>{receipt.invoiceNumber}</Text>
        </View>

        <View
          style={{ ...template_1_style_statement.tBodyElements, width: 300 }}
        >
          <Text>{`${receipt.totalAmount} ${currency}`} </Text>
        </View>
        <View
          style={{ ...template_1_style_statement.tBodyElements, width: 200 }}
        >
          <Text style={{ marginHorizontal: 20 }}>{receipt.totalPaid}</Text>
        </View>
        <View
          style={{ ...template_1_style_statement.tBodyElements, width: 300 }}
        >
          <Text>{`${(receipt?.totalAmount - receipt?.totalPaid).toFixed(
            2
          )} ${currency}`}</Text>
        </View>
      </View>
    </Fragment>
  ));

export const ClientStatementTableTotal = ({
  invoiceItem,
  currency,
}: {
  invoiceItem: ClientStatementType[];
  currency: string;
}) => (
  <View style={{ width: '100%', flexDirection: 'row', marginTop: 10, flex: 1 }}>
    <View style={template_1_style_statement.total}>
      <Text></Text>
    </View>
    <View style={template_1_style_statement.total}>
      <Text></Text>
    </View>
    <View style={template_1_style_statement.total}>
      <Text> </Text>
    </View>
    <View style={template_1_style_statement.tbody}>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 12,
          fontFamily: 'Poppins',
          color: 'hsl(262.1 83.3% 57.8%)',
        }}
      >
        Total
      </Text>
    </View>

    <View style={template_1_style_statement.tbody}>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 12,
          fontFamily: 'Poppins',
          color: 'hsl(262.1 83.3% 57.8%)',
        }}
      >
        {`${invoiceItem.reduce(
          (sum, item) => sum + (item.totalAmount - item.totalPaid),
          0
        )} ${currency}`}
      </Text>
    </View>
  </View>
);
