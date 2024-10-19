import { Text, View } from '@react-pdf/renderer';
import { Fragment } from 'react';
import * as React from 'react';
import { template_1_style } from '@/components/invoice-templates/template1-components/styleConfig';
import { InvoiceItemType } from '@makutainv/types';

export const Invoice1TableHead = () => (
  <View style={{ width: '100%', flexDirection: 'row' }}>
    <View style={{ ...template_1_style.theader, width: 70 }}>
      <Text style={template_1_style.tableHeaderText}>Id</Text>
    </View>
    <View style={{ ...template_1_style.theader, width: 580 }}>
      <Text style={template_1_style.tableHeaderText}>Item name</Text>
    </View>

    <View style={{ ...template_1_style.theader, width: 200 }}>
      <Text style={template_1_style.tableHeaderText}>Unit Price</Text>
    </View>
    <View style={{ ...template_1_style.theader, width: 150 }}>
      <Text style={template_1_style.tableHeaderText}>Quantity</Text>
    </View>
    <View style={{ ...template_1_style.theader, width: 200 }}>
      <Text style={template_1_style.tableHeaderText}>Amount</Text>
    </View>
  </View>
);

export const Invoice1TableBody = ({
  currency,
  invoiceItems,
}: {
  currency: string;
  invoiceItems: InvoiceItemType[];
}) =>
  invoiceItems.map((receipt) => (
    <Fragment key={receipt.item_id}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          paddingVertical: 3,
          borderColor: '#6b7280',
          borderBottomWidth: 1,
        }}
      >
        <View style={{ width: 70, ...template_1_style.tBodyElements }}>
          <Text>{receipt.item_id}</Text>
        </View>
        <View style={{ ...template_1_style.tBodyElements, width: 580 }}>
          <Text>{receipt.description}</Text>
        </View>

        <View style={{ ...template_1_style.tBodyElements, width: 200 }}>
          <Text>{`${receipt.price} ${currency}`} </Text>
        </View>
        <View style={{ ...template_1_style.tBodyElements, width: 150 }}>
          <Text style={{ marginHorizontal: 20 }}>{receipt.quantity}</Text>
        </View>
        <View style={{ ...template_1_style.tBodyElements, width: 200 }}>
          <Text>{`${(receipt.price * receipt.quantity).toFixed(
            2
          )} ${currency}`}</Text>
        </View>
      </View>
    </Fragment>
  ));

export const Invoice1TableTotal = ({
  invoiceItem,
  currency,
}: {
  invoiceItem: Array<InvoiceItemType>;
  currency: string;
}) => (
  <View style={{ width: '100%', flexDirection: 'row', marginTop: 10, flex: 1 }}>
    <View style={template_1_style.total}>
      <Text></Text>
    </View>
    <View style={template_1_style.total}>
      <Text></Text>
    </View>
    <View style={template_1_style.total}>
      <Text> </Text>
    </View>
    <View style={template_1_style.tbody}>
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

    <View style={template_1_style.tbody}>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 12,
          fontFamily: 'Poppins',
          color: 'hsl(262.1 83.3% 57.8%)',
        }}
      >
        {`${invoiceItem.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        )} ${currency}`}
      </Text>
    </View>
  </View>
);
