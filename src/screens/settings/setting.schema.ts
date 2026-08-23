import z from 'zod';

export const settingConfigSchema = z.object({
  businessName: z.string(),
  businessPhone: z.string(),
  invoicePrefix: z.string(),
  currency: z.string(),
});

export type SettingConfigSchemaType = z.infer<typeof settingConfigSchema>;
