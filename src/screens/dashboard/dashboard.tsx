import {
  ButtonIconsProps,
  CustomButton,
  CustomText,
  SafeScreen,
  Tap,
} from '@/components';
import { BookingType, useAppLanguageStore, useBookingStore } from '@/store';
import { Images } from '@/theme/assets/images';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { useAppNavigation } from '@/utils/navigationUtils';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { DashboardCard } from './dashboardCard';

export const DASHBOARD_IMAGE_SIZE = 20;

export const Dashboard = () => {
  /**to get the default theme of app */
  const theme = useTheme();

  /** theme integration in styles */
  const styles = makeStyle(theme);

  /** for tranlations */
  const { t } = useTranslation();

  /** for navigation */
  const navigation = useAppNavigation();

  const setLang = useAppLanguageStore(state => state.changeAppLanguage);

  /** state for the data */
  const bookingStore = useBookingStore();

  const buttonPlus = ({ size, color }: ButtonIconsProps) => {
    return <Images.Plus size={size} color={color} />;
  };

  const renderList = (item: BookingType) =>
    // item: number
    {
      return (
        <>
          <View>
            <CustomText>{item.clientName}</CustomText>
            <CustomText>{item.totalAmount}</CustomText>
          </View>
        </>
      );
    };

  return (
    <SafeScreen style={styles.main}>
      <View>
        <View style={styles.cardsContainer}>
          <Tap
            shadow={true}
            onPress={() => setLang('hi')}
            containerStyle={styles.cards}
            style={[styles.card, styles.primaryBg]}
          >
            <DashboardCard
              image={Images.calendar}
              title={t('ThisMonth')}
              value={bookingStore.bookings.length.toString() ?? 0}
              valueUnit={t('Bookings')}
              color={theme.colors.onPrimary}
            />
          </Tap>
          <Tap
            shadow={true}
            // onPress={() => console.log('hi')}
            containerStyle={styles.cards}
            style={[styles.card, styles.secondaryBg]}
          >
            <DashboardCard
              icon={
                <Images.Revenue
                  size={DASHBOARD_IMAGE_SIZE}
                  color={theme.colors.onSecondary}
                />
              }
              title={t('RevenueMO')}
              value={'4'}
              valueUnit={''}
              color={theme.colors.onSecondary}
            />
          </Tap>
        </View>

        <View style={styles.cardsContainer}>
          <Tap
            shadow={true}
            // onPress={() => console.log('hi')}
            containerStyle={styles.cards}
            style={[styles.card, styles.outlined]}
          >
            <DashboardCard
              icon={
                <Images.Wallet
                  size={DASHBOARD_IMAGE_SIZE}
                  color={theme.colors.onSurface}
                />
              }
              title={t('Pending')}
              value={'4'}
              valueUnit={t('ToCollect')}
            />
          </Tap>
          <Tap
            shadow={true}
            // onPress={() => console.log('hi')}
            containerStyle={styles.cards}
            style={[styles.card, styles.outlined]}
          >
            <DashboardCard
              image={Images.aboutUs}
              title={t('Pending')}
              value={'4'}
              valueUnit={t('Bookings')}
            />
          </Tap>
        </View>
      </View>

      <CustomButton
        onPress={() => navigation.navigate('AddBooking')}
        iconElement={buttonPlus}
      >
        {t('QuickAddBooking')}
      </CustomButton>

      <FlatList
        data={bookingStore.bookings}
        renderItem={({ item }) => renderList(item)}
      />
    </SafeScreen>
  );
};

const makeStyle = (theme: CustomTheme) =>
  StyleSheet.create({
    main: {
      flex: 1,
      paddingHorizontal: 10,
      gap: 15,
    },
    flex: {
      flex: 1,
    },
    cardsContainer: {
      flexDirection: 'row',
      gap: 10,
      marginVertical: 10,
      alignItems: 'center',
    },
    cards: {
      flex: 1,
    },
    card: {
      padding: 20,
    },
    primaryBg: {
      backgroundColor: theme.colors.primary,
    },
    secondaryBg: {
      backgroundColor: theme.colors.secondary,
    },
    outlined: {
      borderWidth: 1,
      borderColor: theme.colors.surfaceVariant,
      backgroundColor: theme.colors.background,
    },
  });
