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
  /** guards initNotificationDefaults so it only ever applies once, on first launch */
  notificationDefaultsInitialized: boolean;
  updateSettings: (value: SettingType) => void;
  /** sets the notification toggles' one-time default based on OS permission status */
  initNotificationDefaults: (permissionGranted: boolean) => void;
};

export const useSettingStore = create<SettingStoreProps>()(
  persist(
    (set, get) => ({
      businessName: '',
      businessPhone: '',
      invoicePrefix: 'INV',
      currency: '₹',
      notifyOneDayBefore: false,
      notifyTwoHoursBefore: false,
      notificationDefaultsInitialized: false,

      updateSettings: (value: SettingType) => set({ ...value }),

      initNotificationDefaults: (permissionGranted: boolean) => {
        if (get().notificationDefaultsInitialized) {
          return;
        }

        set({
          notifyOneDayBefore: permissionGranted,
          notifyTwoHoursBefore: permissionGranted,
          notificationDefaultsInitialized: true,
        });
      },
    }),
    {
      name: 'setting-storage',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
