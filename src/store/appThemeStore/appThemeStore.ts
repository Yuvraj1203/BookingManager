import { zustandStorage } from '@/App';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export enum ThemeVariantEnum {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}

type AppThemeStoreType = {
  appTheme: ThemeVariantEnum; // app theme for whole app
  setAppTheme: (value: ThemeVariantEnum) => void; // call this function to change app theme
};

export const useAppThemeStore = create<AppThemeStoreType>()(
  persist(
    set => ({
      appTheme: ThemeVariantEnum.System,
      setAppTheme: (value: ThemeVariantEnum) => set({ appTheme: value }),
    }),
    {
      name: 'app-theme-storage',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
