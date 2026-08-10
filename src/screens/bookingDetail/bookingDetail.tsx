import { SafeScreen, Tap } from '@/components';
import { useBookingStore } from '@/store';
import { Images } from '@/theme/assets/images';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { useAppNavigation, useAppRoute } from '@/utils/navigationUtils';
import { StyleSheet } from 'react-native';

export type BookingDetailProps = {
  id: string;
};

const BookingDetail = () => {
  /** for getting the parameter */
  const param = useAppRoute('BookingDetail').params;

  /**to get the default theme of app */
  const theme = useTheme();

  /** theme integration in styles */
  const styles = makeStyle(theme);

  /** for navigation */
  const navigation = useAppNavigation();

  /** booking store */
  const bookingStore = useBookingStore();

  //handle delete
  const handleDelete = (id: string) => {
    bookingStore.deleteBooking(id);
    navigation.goBack();
  };
  return (
    <SafeScreen>
      <Tap style={styles.main} onPress={() => handleDelete(param.id)}>
        <Images.Trash />
      </Tap>
    </SafeScreen>
  );
};

const makeStyle = (theme: CustomTheme) =>
  StyleSheet.create({
    main: {
      height: 100,
      width: 100,
      backgroundColor: theme.colors.danger,
    },
  });

export default BookingDetail;
