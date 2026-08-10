import { SafeScreen } from '@/components';
import { useBookingStore } from '@/store';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import {
  CurrentWeekChartType,
  getBookingAnalytics,
} from '@/utils/bookingUtils';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { RevenueBarChart } from './revenueBarChart';
import { RevenueCard } from './revenueCard';

const Revenue = () => {
  /**to get the default theme of app */
  const theme = useTheme();

  /** theme integration in styles */
  const styles = makeStyle(theme);

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
      <View style={styles.main}>
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
    </SafeScreen>
  );
};

const makeStyle = (theme: CustomTheme) =>
  StyleSheet.create({
    main: {
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
  });

export default Revenue;
