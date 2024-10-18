import * as z from 'zod';

export const createInvoiceFormSchema = z.object({
  clientId: z.string({ message: 'The client required' }),
  invoiceNumber: z.string({ message: 'The invoice number is required' }),
  invoiceDueDate: z
    .date({ message: 'The invoice date is required' })
    .min(new Date()),
  currency: z.string({ message: 'The invoice currency' }).min(3),
  invoiceItems: z
    .object({
      itemName: z.string(),
      itemPrice: z.coerce
        .number()
        .min(1, { message: 'The invoice price must be greater than 0' }),
      itemQuantity: z.coerce
        .number()
        .min(1, 'The quantity must be greater than 0'),
    })
    .array()
    .min(1),
  invoiceNote: z.string().optional(),
});
