import { SafeScreen } from '@/components';
import { useBookingStore } from '@/store';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import {
  CurrentWeekChartType,
  getBookingAnalytics,
} from '@/utils/bookingUtils';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { RevenueBarChart } from './revenueBarChart';
import { RevenueCard } from './revenueCard';

const Revenue = () => {
  /**to get the default theme of app */
  const theme = useTheme();

  /** height of the bottom tab bar, so scroll content and the FAB clear it */
  const tabBarHeight = useBottomTabBarHeight();

  /** theme integration in styles */
  const styles = makeStyle(theme, tabBarHeight);

  /** for tranlations */
  const { t } = useTranslation();

  /** state for the data */
  const bookingStore = useBookingStore();

  /** this month data */
  const [todaysRevenue, setTodaysRevenue] = useState(0);

  /**current month revenue */
  const [weekRevenue, setWeekRevenue] = useState(0);

  /** upcoming 7 days bookings */
  const [monthRevenue, setMonthRevenue] = useState(0);

  /** pending amount */
  const [pendingAmount, setPendingAmount] = useState(0);

  /** pending amount */
  const [currentWeekBarChart, setCurrentWeekBarChart] = useState<
    CurrentWeekChartType[]
  >([]);

  /** get the particular date and all */
  useEffect(() => {
    const allBookings = useBookingStore.getState().bookings; // all data

    const {
      todayRevenue,
      currentMonthRevenue,
      totalPendingAmount,
      currentWeekRevenue,
      currentWeekChart,
    } = getBookingAnalytics(allBookings);

    setTodaysRevenue(todayRevenue);
    setWeekRevenue(currentWeekRevenue);
    setMonthRevenue(currentMonthRevenue);
    setPendingAmount(totalPendingAmount);
    setCurrentWeekBarChart(currentWeekChart);
  }, [bookingStore.bookings]);

  const cardData = useMemo(
    () => [
      {
        label: t('Today'),
        amount: todaysRevenue,
      },
      {
        label: t('ThisWeek'),
        amount: weekRevenue,
      },
      {
        label: t('ThisMonth'),
        amount: monthRevenue,
        style: {
          backgroundColor: theme.colors.primaryContainer,
        },
        textColor: theme.colors.onPrimaryContainer,
      },
      {
        label: t('PendingCollection'),
        amount: pendingAmount,
        style: {
          backgroundColor: theme.colors.secondaryContainer,
        },
        textColor: theme.colors.onSecondaryContainer,
      },
    ],
    [todaysRevenue, weekRevenue, monthRevenue, pendingAmount],
  );

  return (
    <SafeScreen>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        style={styles.main}
      >
        <View style={styles.content}>
          {cardData.map((item, index) => {
            return (
              <RevenueCard
                key={index}
                label={item.label}
                amount={item.amount}
                style={item.style}
                textColor={item.textColor}
              />
            );
          })}

          <RevenueBarChart currentWeekBarChart={currentWeekBarChart} />
        </View>
      </ScrollView>
    </SafeScreen>
  );
};

const makeStyle = (theme: CustomTheme, tabBarHeight: number) =>
  StyleSheet.create({
    main: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    contentContainer: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    content: {
      marginBottom: theme.bottomBarHeight,
    },
  });

export default Revenue;
