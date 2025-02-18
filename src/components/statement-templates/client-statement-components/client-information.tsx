import { Text, View } from '@react-pdf/renderer';
import { FC } from 'react';
import { ClientType } from '@makutainv/types';

export const ClientInformationStatement: FC<ClientType> = ({
  client_name,
  email,
  phone,
  address,
  total,
  currency,
}) => (
  <View
    style={{
      display: 'flex',
      justifyContent: 'flex-start',
      flexDirection: 'column',
    }}
  >
    <View
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
      }}
    >
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
          Statement for :
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
      </View>
      <View
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            width: 200,
            backgroundColor: 'hsl(262.1 83.3% 77.8%)',
            color: 'white',
            textAlign: 'center',
            fontSize: 12,
            fontFamily: 'Poppins',
            borderRadius: 5,
          }}
        >
          Balance Due
        </Text>
        <Text
          style={{
            fontSize: 12,
            marginTop: 4,
            fontFamily: 'Poppins',
            fontWeight: 'bold',
          }}
        >
          {Intl.NumberFormat('en-US').format(total ?? 0)} {` ${currency}`}
        </Text>
      </View>
    </View>

    <View
      style={{ borderBottomWidth: 1, borderColor: '#ccc', marginVertical: 10 }}
    ></View>
  </View>
);
