import { CustomText, Shadow, Tap, TextVariants } from '@/components';
import { CustomerCard } from '@/screens/dashboard/customerCard';
import { useBookingStore } from '@/store';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { formatDate } from '@/utils/utils';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { DateData } from 'react-native-calendars';
import { ScrollView } from 'react-native-gesture-handler';
import { ScheduleCalendar } from './scheduleCalendar';

enum DayCellDateFormatEnum {
  Key = 'YYYY-MM-DD',
}

type DayCellProps = {
  date?: DateData;
  state?: 'selected' | 'today' | 'disabled' | 'inactive' | '';
  marking?: { marked?: boolean };
  onPress?: (date?: DateData) => void;
};

export const ScheduleScreen = () => {
  /** to get the default theme of app */
  const theme = useTheme();

  /** theme integration in styles */
  const styles = makeStyle(theme);

  /** for translations */
  const { t } = useTranslation();

  /** all bookings from the store */
  const bookings = useBookingStore(state => state.bookings);

  /** calendar's initial date, kept stable across renders */
  const [initialDate] = useState(() =>
    dayjs().format(DayCellDateFormatEnum.Key),
  );

  /** the date currently selected on the calendar */
  const [selectedDate, setSelectedDate] = useState(initialDate);

  /** dates that have at least one booking, for the dot markers */
  const markedDates = useMemo(() => {
    const marks: Record<string, { marked: boolean }> = {};
    bookings.forEach(booking => {
      const key = dayjs(booking.date).format(DayCellDateFormatEnum.Key);
      marks[key] = { marked: true };
    });
    return marks;
  }, [bookings]);

  /** bookings that fall on the selected date */
  const selectedDateBookings = useMemo(
    () =>
      bookings
        .filter(
          booking =>
            dayjs(booking.date).format(DayCellDateFormatEnum.Key) ===
            selectedDate,
        )
        .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf()),
    [bookings, selectedDate],
  );

  /** custom day cell: filled circle when selected, outlined box for today, dot for booked days */
  const renderDay = ({ date, state, marking, onPress }: DayCellProps) => {
    if (!date) {
      return <View style={styles.dayCell} />;
    }

    const isSelected = state === 'selected';
    const isToday = state === 'today';

    return (
      <Tap style={styles.dayCell} onPress={() => onPress?.(date)}>
        <View
          style={[
            styles.dayNumber,
            isSelected && styles.dayNumberSelected,
            !isSelected && isToday && styles.dayNumberToday,
          ]}
        >
          <CustomText
            variant={TextVariants.bodyMedium}
            color={isSelected ? theme.colors.onPrimary : theme.colors.onSurface}
          >
            {date.day}
          </CustomText>
        </View>
        <View style={styles.dotSlot}>
          {marking?.marked && <View style={styles.dot} />}
        </View>
      </Tap>
    );
  };

  return (
    <View style={styles.main}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.containerContent}
      >
        <Shadow style={styles.calendarCard}>
          <ScheduleCalendar />
        </Shadow>

        <CustomText
          variant={TextVariants.titleMedium}
          style={styles.listHeader}
        >
          {formatDate({ date: selectedDate, returnFormat: 'dddd D MMMM' })}
        </CustomText>

        <View style={styles.list}>
          {selectedDateBookings.length > 0 ? (
            selectedDateBookings.map(booking => (
              <CustomerCard key={booking.id} cardItem={booking} />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <CustomText
                variant={TextVariants.bodySmall}
                color={theme.colors.outline}
              >
                {t('NothingScheduledYet')}
              </CustomText>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
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
    containerContent: {
      paddingBottom: theme.bottomBarHeight + 20,
    },
    calendarCard: {
      marginTop: 10,
      paddingBottom: 20,
      backgroundColor: theme.colors.surfaceVariant,
    },
    dayCell: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 2,
    },
    dayNumber: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dayNumberSelected: {
      backgroundColor: theme.colors.primary,
    },
    dayNumberToday: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.outline,
    },
    dotSlot: {
      height: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dot: {
      width: 5,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: theme.colors.statusBusyColor,
    },
    listHeader: {
      marginTop: 20,
      marginBottom: 10,
    },
    list: {
      gap: 12,
      marginBottom: 20,
    },
    emptyContainer: {
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: theme.colors.border,
      padding: 20,
      borderRadius: theme.roundness,
      alignItems: 'center',
    },
  });
