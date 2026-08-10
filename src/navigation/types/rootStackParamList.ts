import { CustomDatePickerProps } from '@/components/customDatePicker/customDatePicker.types';
import { BookingDetailProps } from '@/screens';

export type RootStackParamList = {
  SplashScreen: undefined;
  Auth: undefined;
  DrawerRoute: undefined;
  AddBooking: undefined;
  CustomDatePicker: CustomDatePickerProps;
  BookingDetail: BookingDetailProps;
};
