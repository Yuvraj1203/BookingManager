import { CustomDatePickerProps } from '@/components/customDatePicker/customDatePicker.types';
import { AddBookingProps, BookingDetailProps, PdfPreviewProps } from '@/screens';

export type RootStackParamList = {
  SplashScreen: undefined;
  Auth: undefined;
  DrawerRoute: undefined;
  AddBooking: undefined | AddBookingProps;
  CustomDatePicker: CustomDatePickerProps;
  BookingDetail: BookingDetailProps;
  PdfPreview: PdfPreviewProps;
};
