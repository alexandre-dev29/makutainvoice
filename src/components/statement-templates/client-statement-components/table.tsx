import { Text, View } from '@react-pdf/renderer';
import { Fragment } from 'react';

import { NewStatementType } from '@makutainv/types';
import { template_1_style_statement } from '@/components/statement-templates/client-statement-components/styleConfig';

type StatementTypeBody = {
  date: string;
  invoiceNumber: string;
  description: string;
  payment: number;
  amount: number;
  balance: number;
  isInvoice: boolean;
  islast: boolean;
};
export const ClientStatementTableHead = () => (
  <View
    style={{
      width: '100%',
      flexDirection: 'row',
    }}
  >
    <View
      style={{
        ...template_1_style_statement.theader,
        width: 250,
      }}
    >
      <Text style={template_1_style_statement.tableHeaderText}>Date</Text>
    </View>
    <View
      style={{
        ...template_1_style_statement.theader,
        width: 250,
      }}
    >
      <Text style={template_1_style_statement.tableHeaderText}>Invoice</Text>
    </View>
    <View style={{ ...template_1_style_statement.theader, width: 400 }}>
      <Text style={template_1_style_statement.tableHeaderText}>
        Description
      </Text>
    </View>
    <View style={{ ...template_1_style_statement.theader, width: 300 }}>
      <Text style={template_1_style_statement.tableHeaderText}>Payement</Text>
    </View>
    <View style={{ ...template_1_style_statement.theader, width: 300 }}>
      <Text style={template_1_style_statement.tableHeaderText}>Balance</Text>
    </View>
  </View>
);
const returnLineOfTableBody = ({
  amount,
  balance,
  date,
  description,
  invoiceNumber,
  isInvoice,
  payment,
  islast,
}: StatementTypeBody) => {
  return (
    <Fragment key={Math.random.toString()}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          paddingVertical: 1,
          borderBottom: islast ? '2px solid #ccc' : '1px dashed #ccc',
        }}
      >
        <View
          style={{
            width: 250,
            ...template_1_style_statement.tBodyElements,
            paddingVertical: 0,
          }}
        >
          <Text>{date}</Text>
        </View>
        <View
          style={{
            ...template_1_style_statement.tBodyElements,
            width: 250,
          }}
        >
          <Text>{invoiceNumber}</Text>
        </View>

        <View
          style={{
            ...template_1_style_statement.tBodyElements,
            width: 400,
            paddingVertical: 0,
          }}
        >
          <Text>{`${!isInvoice ? description : ''}`} </Text>
        </View>
        <View
          style={{
            ...template_1_style_statement.tBodyElements,
            width: 300,
            paddingVertical: 0,
          }}
        >
          <Text style={{ marginHorizontal: 20 }}>
            {isInvoice ? '' : Intl.NumberFormat('en-EN').format(payment)}
          </Text>
        </View>
        <View
          style={{
            ...template_1_style_statement.tBodyElements,
            width: 300,
            paddingVertical: 0,
          }}
        >
          <Text
            style={{
              marginHorizontal: 20,
              color: islast ? 'red' : 'hsl( 220 8.9% 46.1%)',
            }}
          >
            {Intl.NumberFormat('en-EN').format(balance)}
          </Text>
        </View>
      </View>
    </Fragment>
  );
};

export const ClientStatementTableBody = ({
  currency,
  invoiceItems,
}: {
  currency: string;
  invoiceItems: NewStatementType[];
}) => {
  const statementBodyList: Array<StatementTypeBody> = [];

  invoiceItems.forEach((item) => {
    let currentBalance = item.total_amount ?? 0;
    statementBodyList.push({
      balance: item.total_amount ?? 0,
      date: new Date(item.invoice_date).toLocaleDateString('fr-Fr'),
      isInvoice: true,
      payment: 0,
      invoiceNumber: item.invoice_number,
      description: '',
      amount: 0,
      islast: item.payments?.length === 0,
    });

    item.payments?.forEach((payment, index) => {
      const balanceToTake = currentBalance - payment.amount;
      currentBalance -= payment.amount;
      if (item.payments) {
        statementBodyList.push({
          balance: balanceToTake,
          amount: 0,
          description: payment.reference ?? '',
          isInvoice: false,
          date: new Date(payment.payment_date).toLocaleDateString('fr-Fr'),
          invoiceNumber: item.invoice_number,
          payment: payment.amount,
          islast: index === item.payments.length - 1,
        });
      }
    });
  });

  return (
    <div>
      {statementBodyList.map((receipt, index) =>
        returnLineOfTableBody(receipt)
      )}
    </div>
  );
};

export const ClientStatementTableTotal = ({
  invoiceItem,
  currency,
}: {
  invoiceItem: NewStatementType[];
  currency: string;
}) => {
  const total = invoiceItem.reduce(
    (sum, item) => sum + ((item.total_amount ?? 0) - (item.total_paid ?? 0)),
    0
  );
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
      }}
    >
      <View style={{ marginRight: 20 }}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 12,
            fontFamily: 'Poppins',
            color: 'hsl(262.1 83.3% 57.8%)',
          }}
        >
          Current Balance
        </Text>
      </View>

      <View style={{ marginRight: 30 }}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 12,
            fontFamily: 'Poppins',
            color: 'hsl(262.1 83.3% 57.8%)',
          }}
        >
          {`${Intl.NumberFormat('en-EN').format(total)} ${currency}`}
        </Text>
      </View>
    </View>
  );
};
