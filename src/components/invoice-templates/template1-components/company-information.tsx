import { Text, View } from '@react-pdf/renderer';
import * as React from 'react';
import { FC } from 'react';
import { CompanyType } from '@makutainv/types';

export const CompanyInformation: FC<CompanyType> = ({
  company_name,
  address,
  phone,
  email,
}) => (
  <View
    style={{
      display: 'flex',
      justifyContent: 'flex-end',
      flexDirection: 'column',
    }}
  >
    <Text
      style={{
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        fontWeight: 'extrabold',
        fontSize: 18,
        marginTop: 20,
        textAlign: 'right',
        fontFamily: 'Poppins',
      }}
    >
      {company_name}
    </Text>
    <Text
      style={{
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        textAlign: 'right',
        fontSize: 11,
        color: 'hsl( 220 8.9% 46.1%)',
        fontFamily: 'Poppins',
        fontWeight: 'normal',
      }}
    >
      {address}
    </Text>
    <Text
      style={{
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        textAlign: 'right',
        fontSize: 11,
        color: 'hsl( 220 8.9% 46.1%)',
        fontFamily: 'Poppins',
        fontWeight: 'normal',
      }}
    >
      {email}
    </Text>
    <Text
      style={{
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        textAlign: 'right',
        fontSize: 11,
        color: 'hsl( 220 8.9% 46.1%)',
        fontFamily: 'Poppins',
        fontWeight: 'normal',
      }}
    >
      {phone}
    </Text>
    <View
      style={{ borderBottomWidth: 1, borderColor: '#ccc', marginVertical: 10 }}
    ></View>
  </View>
);
