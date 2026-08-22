import { ButtonIconsProps, CustomButton, SafeScreen, Tap } from '@/components';
import { BookingType, useAppLanguageStore, useBookingStore } from '@/store';
import { Images } from '@/theme/assets/images';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { getBookingAnalytics } from '@/utils/bookingUtils';
import { useAppNavigation } from '@/utils/navigationUtils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { CustomerCardSection } from './customerCardSection';
import { DashboardCard } from './dashboardCard';

export const DASHBOARD_IMAGE_SIZE = 20;

const Dashboard = () => {
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

  /** this month data */
  const [currentMonthData, setCurrentMonthData] = useState<BookingType[]>();

  /**current month revenue */
  const [currentMonthRevenue, setCurrentMonthRevenue] = useState(0);

  /** upcoming 7 days bookings */
  const [next7DaysBookings, setNext7DaysBookings] = useState<BookingType[]>();

  /** upcoming 7 days bookings */
  const [todaysBookings, setTodaysBookings] = useState<BookingType[]>();

  /** pending amount */
  const [pendingAmount, setPendingAmount] = useState(0);

  /** get the particular date and all */
  useEffect(() => {
    const allBookings = useBookingStore.getState().bookings; // all data

    const {
      currentMonthBookings,
      upcomingBookings,
      currentMonthRevenue,
      totalPendingAmount,
      todayBookings,
    } = getBookingAnalytics(allBookings);

    console.log(allBookings, currentMonthBookings);

    setCurrentMonthRevenue(currentMonthRevenue); //set current month revenue
    setPendingAmount(totalPendingAmount); //set total pending ruppes
    setNext7DaysBookings(upcomingBookings); //set the next 7 days bookings
    setTodaysBookings(todayBookings); //todayBookings
    //set current month data
    setCurrentMonthData(currentMonthBookings);
  }, [bookingStore.bookings]);

  const buttonPlus = ({ size, color }: ButtonIconsProps) => {
    return <Images.Plus size={size} color={color} />;
  };

  return (
    <SafeScreen style={styles.main}>
      <ScrollView style={styles.container}>
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
                value={currentMonthData?.length.toString() ?? '0'}
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
                value={currentMonthRevenue}
                valueUnit={''}
                color={theme.colors.onSecondary}
                valueIcon={
                  <Images.IndianRupee color={theme.colors.onSecondary} />
                }
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
                value={pendingAmount}
                valueUnit={t('ToCollect')}
                valueIcon={
                  <Images.IndianRupee color={theme.colors.onSurface} />
                }
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
                title={t('Next7Days')}
                value={next7DaysBookings?.length || 0}
                valueUnit={t('Bookings')}
              />
            </Tap>
          </View>
        </View>

        <CustomButton
          onPress={() => {
            navigation.navigate('AddBooking');
          }}
          iconElement={buttonPlus}
          style={styles.addButton}
          textColor={theme.colors.onPrimary}
        >
          {t('QuickAddBooking')}
        </CustomButton>

        <CustomerCardSection data={todaysBookings ?? []} title={t('Today')} />

        <CustomerCardSection
          data={next7DaysBookings ?? []}
          title={t('Upcoming')}
        />
      </ScrollView>
    </SafeScreen>
  );
};

const makeStyle = (theme: CustomTheme) =>
  StyleSheet.create({
    main: {
      flex: 1,
    },
    container: {
      flex: 1,
      paddingHorizontal: 10,
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
      gap: 5,
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
      backgroundColor: theme.colors.surface,
    },
    addButton: {
      marginVertical: 15,
    },
  });

export default Dashboard;
