import { ImagePickerResponse } from 'react-native-image-picker';
import { z } from 'zod';

export const addBookingSchema = z.object({
  clientName: z.string().min(1, 'Name is mandatory'),
  mobile: z.string().min(1, 'Mobile number is mandatory'),
  date: z.string().min(1, 'Date is mandatory'),
  time: z.string().min(1, 'Time is mandatory'),
  duration: z.string().optional(),
  horses: z.string().min(1, 'Horse count is mandatory'),
  venue: z.string().min(1, 'Venue is mandatory'),
  addOns: z.string().optional(),
  totalAmount: z.string(),
  advancePaid: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
});

export type AddBookingSchemaType = z.infer<typeof addBookingSchema>;

// Option A: Using Type Intersection (&)
// This merges all properties of AddBookingSchemaType with the images field
export type AddBookingPayload = AddBookingSchemaType & {
  images: ImagePickerResponse[];
};
