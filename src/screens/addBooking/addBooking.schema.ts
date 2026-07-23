import { z } from 'zod';

export const addBookingSchema = z.object({
  clientName: z.string(),
  mobile: z.string(),
  date: z.string(),
  time: z.string(),
  duration: z.string(),
  horses: z.string(),
  venue: z.string(),
  addOns: z.string(),
  totalAmount: z.string(),
  advancePaid: z.string(),
  status: z.string(),
  notes: z.string(),
});

export type AddBookingSchemaType = z.infer<typeof addBookingSchema>;
