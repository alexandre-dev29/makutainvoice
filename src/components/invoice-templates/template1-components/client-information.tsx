import { Text, View } from '@react-pdf/renderer';
import * as React from 'react';
import { FC } from 'react';
import { ClientType } from '@makutainv/types';

export const ClientInformation: FC<ClientType> = ({
  client_name,
  email,
  phone,
  address,
}) => (
  <View
    style={{
      display: 'flex',
      justifyContent: 'flex-start',
      flexDirection: 'column',
    }}
  >
    <Text
      style={{
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        fontWeight: 'bold',
        fontSize: 12,
        textAlign: 'left',
        fontFamily: 'Poppins',
        color: 'hsl(262.1 83.3% 57.8%)',
      }}
    >
      Bill to :
    </Text>
    <Text
      style={{
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        fontWeight: 'extrabold',
        fontSize: 12,
        textAlign: 'left',
        color: 'hsl( 220 8.9% 46.1%)',
        fontFamily: 'Poppins',
      }}
    >
      {client_name}
    </Text>
    <Text
      style={{
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        fontSize: 12,
        textAlign: 'left',
        color: 'hsl( 220 8.9% 46.1%)',
        fontFamily: 'Poppins',
      }}
    >
      {address}
    </Text>

    <Text
      style={{
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        fontSize: 12,
        textAlign: 'left',
        color: 'hsl( 220 8.9% 46.1%)',
        fontFamily: 'Poppins',
      }}
    >
      {email}
    </Text>
    <Text
      style={{
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        fontSize: 12,
        textAlign: 'left',
        color: 'hsl( 220 8.9% 46.1%)',
        fontFamily: 'Poppins',
      }}
    >
      {phone}
    </Text>

    <View
      style={{ borderBottomWidth: 1, borderColor: '#ccc', marginVertical: 10 }}
    ></View>
  </View>
);
