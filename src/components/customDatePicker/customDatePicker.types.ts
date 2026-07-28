import { RootStackParamList } from '@/navigation/types';
import { DrawerStackParamList } from '@/navigation/types/drawerStackParamList';

export enum DatePickerMode {
  datetime = 'datetime',
  date = 'date',
  time = 'time',
}

export type CustomDatePickerProps = {
  mode?: DatePickerMode;
  title?: string;
  date?: Date;
  minDate?: Date;
  maxDate?: Date;
  // called with the picked date when the user confirms, then the sheet
  // navigates back on its own - callers don't need to call goBack themselves
  parentScreen: keyof RootStackParamList | keyof DrawerStackParamList;
  id?: string; //if use more than one date picker so to know whoch sends the data back,
};
