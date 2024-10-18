import * as React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: 'white',
    width: 500,
  },
  section: {
    display: 'flex',
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

// Create Document Component
export const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={{ backgroundColor: 'white' }}>
        <View style={{ display: 'flex' }}>
          <Text>Section #1 mwenze Lorem ipsum dolor sit amet,</Text>
          <Text>Section #1 mwenze Lorem ipsum dolor sit amet,</Text>
          <Text>Section #1 mwenze Lorem ipsum dolor sit amet,</Text>
          <Text>Section #1 mwenze Lorem ipsum dolor sit amet,</Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text>Section #2</Text>
      </View>
    </Page>
  </Document>
);
