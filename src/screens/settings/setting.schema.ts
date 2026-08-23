import z from 'zod';

export const settingConfigSchema = z.object({
  businessName: z.string().trim().min(1, 'Business name is mandatory'),
  businessPhone: z
    .string()
    .trim()
    .min(10, 'Phone number has to be of 10 digits.')
    .refine(value => !value || /^\d{10}$/.test(value), {
      message: 'Phone number must be 10 digits',
    }),
  invoicePrefix: z
    .string()
    .trim()
    .min(1, 'Invoice prefix is mandatory')
    .max(6, 'Invoice prefix can be up to 6 characters')
    .regex(/^[A-Za-z0-9]+$/, 'Only letters and numbers are allowed'),
  currency: z.string().trim().min(1, 'Currency is mandatory'),
  notifyOneDayBefore: z.boolean(),
  notifyTwoHoursBefore: z.boolean(),
});

export type SettingConfigSchemaType = z.infer<typeof settingConfigSchema>;
