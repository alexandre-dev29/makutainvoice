import { StyleSheet } from '@react-pdf/renderer';

export const template_1_style = StyleSheet.create({
  page: {
    fontSize: 11,
    paddingTop: 20,
    paddingLeft: 40,
    paddingRight: 40,
    lineHeight: 1.5,
    flexDirection: 'column',
  },

  spaceBetween: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: '#3E3E3E',
  },

  titleContainer: { flexDirection: 'row', marginTop: 12 },

  logo: { width: 80 },

  reportTitle: {
    fontSize: 17,
    textAlign: 'center',
    color: 'hsl(262.1 83.3% 57.8%)',
    fontWeight: 700,
    fontFamily: 'Poppins',
  },
  reportSubTitle: {
    fontSize: 11,
    textAlign: 'center',
    fontWeight: 400,
    color: 'hsl( 220 8.9% 46.1%)',
  },

  tableHeaderText: {
    fontSize: 11,
    color: 'hsl(262.1 83.3% 57.8%)',
    fontWeight: 400,
  },
  addressTitle: {
    fontSize: 11,
    fontWeight: 400,
  },

  invoice: {
    fontWeight: 'bold',
    fontSize: 20,
  },

  invoiceNumber: {
    fontSize: 11,
    fontWeight: 'bold',
  },

  address: { fontWeight: 400, fontSize: 10 },

  theader: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 20,
    paddingVertical: 4,
    paddingLeft: 8,
    borderBottomWidth: 1,
    fontFamily: 'Poppins',
  },

  tBodyElements: {
    fontSize: 10,
    fontWeight: 'normal',
    paddingVertical: 4,
    paddingLeft: 8,
    color: 'hsl( 220 8.9% 46.1%)',
    fontFamily: 'Poppins',
    marginRight: 5,
  },

  tbody: {
    fontSize: 9,
    paddingTop: 4,
    paddingLeft: 7,
    flex: 1,
    borderColor: 'whitesmoke',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    fontFamily: 'Poppins',
  },

  total: {
    fontSize: 9,
    paddingTop: 4,
    paddingLeft: 7,
    flex: 1.5,
    borderColor: 'whitesmoke',
    borderBottomWidth: 1,
    fontFamily: 'Poppins',
  },

  tbody2: { flex: 2, borderRightWidth: 1 },
});
