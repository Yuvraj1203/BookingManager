import { zustandStorage } from '@/App';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type SettingType = {
  businessName: string;
  businessPhone: string;
  invoicePrefix: string;
  currency: string;
  notifyOneDayBefore: boolean;
  notifyTwoHoursBefore: boolean;
};

type SettingStoreProps = SettingType & {
  updateSettings: (value: SettingType) => void;
};

export const useSettingStore = create<SettingStoreProps>()(
  persist(
    set => ({
      businessName: '',
      businessPhone: '',
      invoicePrefix: 'INV',
      currency: '₹',
      notifyOneDayBefore: true,
      notifyTwoHoursBefore: true,

      updateSettings: (value: SettingType) => set({ ...value }),
    }),
    {
      name: 'setting-storage',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
