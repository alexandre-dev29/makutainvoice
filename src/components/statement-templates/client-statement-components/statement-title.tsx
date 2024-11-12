import { Image, Text, View } from '@react-pdf/renderer';
import * as React from 'react';
import { template_1_style_statement } from '@/components/statement-templates/client-statement-components/styleConfig';

export const StatementTitle = ({ logoSrc }: { logoSrc: string }) => (
  <View style={template_1_style_statement.titleContainer}>
    <View style={template_1_style_statement.spaceBetween}>
      <View>
        <Text style={template_1_style_statement.reportTitle}>
          Client Statement
        </Text>
        <Text style={template_1_style_statement.reportSubTitle}>
          Created on : {new Date().toLocaleDateString('fr-FR')}
        </Text>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
        }}
      >
        <Image style={template_1_style_statement.logo} src={logoSrc} />
      </View>
    </View>
  </View>
);
