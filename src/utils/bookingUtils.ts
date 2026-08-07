// utils/bookingUtils.ts

import { BookingType } from '@/store';
import dayjs from 'dayjs';

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

  //current month revenue
  const currentRevenue = currentMonthBookings.reduce((acc, curr) => {
    return acc + Number(curr.totalAmount);
  }, 0);

  //total pending amount
  const totalPendingAmount = bookings.reduce((acc, curr) => {
    return acc + (Number(curr.totalAmount) - Number(curr.advancePaid));
  }, 0);

  return {
    todayBookings,
    currentMonthBookings,
    upcomingBookings,
    currentRevenue,
    totalPendingAmount,
  };
};
