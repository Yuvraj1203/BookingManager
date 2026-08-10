// utils/bookingUtils.ts

import { BookingType, CurrentWeekBookingDetails } from '@/store';
import dayjs from 'dayjs';

export type CurrentWeekChartType = {
  date: string;
  day: string;
  dayShort: string;
  isToday: boolean;
  totalAmount: number;
};

export const getBookingAnalytics = (bookings: BookingType[]) => {
  const today = dayjs().startOf('day');
  const endOfToday = dayjs().endOf('day');

  const next7DaysEnd = today.add(7, 'day').endOf('day');

  const currentMonth = dayjs().month();
  const currentYear = dayjs().year();

  const todayBookings = bookings.filter(booking => {
    const date = dayjs(booking.date);
    return (
      date.isAfter(today.subtract(1, 'millisecond')) &&
      date.isBefore(endOfToday.add(1, 'millisecond'))
    );
  });

  const currentMonthBookings = bookings.filter(booking => {
    const date = dayjs(booking.date);

    return date.month() === currentMonth && date.year() === currentYear;
  });

  const upcomingBookings = bookings.filter(booking => {
    const date = dayjs(booking.date);

    return (
      date.isSame(today, 'day') ||
      (date.isAfter(today) && date.isBefore(next7DaysEnd.add(1, 'millisecond')))
    );
  });

  //total pending amount
  const totalPendingAmount = bookings.reduce((acc, curr) => {
    return acc + (Number(curr.totalAmount) - Number(curr.advancePaid));
  }, 0);

  console.log('totalPendingAmount=>', totalPendingAmount);

  // -----------------------------
  // Current week: Monday -> Sunday
  // -----------------------------
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const day = currentDate.getDay(); // Sunday = 0, Monday = 1

  // Calculate Monday
  const monday = new Date(currentDate);
  monday.setDate(currentDate.getDate() - (day === 0 ? 6 : day - 1));
  monday.setHours(0, 0, 0, 0);

  // Calculate Sunday
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  //current week
  const currentWeekBookings = bookings.filter(item => {
    const itemDate = new Date(item.date);

    return itemDate >= monday && itemDate <= sunday;
  });

  //current week with details
  const startOfWeek = today.startOf('week').add(1, 'day');
  const endOfWeek = startOfWeek.add(6, 'day');

  const currentWeekBookingsDetail: CurrentWeekBookingDetails[] = bookings
    .filter(item => {
      const itemDate = dayjs(item.date);

      return (
        itemDate.valueOf() >= startOfWeek.valueOf() &&
        itemDate.valueOf() <= endOfWeek.valueOf()
      );
    })
    .map(item => {
      const itemDate = dayjs(item.date);

      return {
        ...item,
        day: itemDate.format('dddd'),
        dayShort: itemDate.format('ddd'),
        isToday: itemDate.isSame(today, 'day'),
      };
    });

  /** current week for bar chart */
  const currentWeekChart: CurrentWeekChartType[] = Array.from(
    { length: 7 },
    (_, index) => {
      const date = startOfWeek.add(index, 'day');

      const dayBookings = bookings.filter(item =>
        dayjs(item.date).isSame(date, 'day'),
      );

      const totalAmount = dayBookings.reduce(
        (sum, booking) => sum + Number(booking.totalAmount),
        0,
      );

      return {
        date: date.format('YYYY-MM-DD'),
        day: date.format('dddd'),
        dayShort: date.format('ddd'),
        isToday: date.isSame(today, 'day'),
        totalAmount,
      };
    },
  );

  // -----------------------------
  // Revenue
  // -----------------------------
  const todayRevenue = todayBookings.reduce(
    (sum, booking) => sum + Number(booking.totalAmount),
    0,
  );

  const currentWeekRevenue = currentWeekBookings.reduce(
    (sum, booking) => sum + Number(booking.totalAmount),
    0,
  );

  //current month revenue
  const currentMonthRevenue = currentMonthBookings.reduce((acc, curr) => {
    return acc + Number(curr.totalAmount);
  }, 0);

  return {
    todayBookings,
    currentMonthBookings,
    upcomingBookings,
    currentMonthRevenue,
    totalPendingAmount,
    currentWeekRevenue,
    todayRevenue,
    currentWeekBookings,
    currentWeekBookingsDetail,
    currentWeekChart,
  };
};
