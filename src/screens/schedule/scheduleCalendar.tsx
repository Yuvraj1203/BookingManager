import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { StyleSheet, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Theme } from 'react-native-calendars/src/types';

export type MarkedDatesType = {
  [date: string]: {
    marked?: boolean;
    dotColor?: string;
    selected?: boolean;
    selectedColor?: string;
    disabled?: boolean;
    disableTouchEvent?: boolean;
    customStyles?: {
      container?: Theme;
      text?: Theme;
    };
  };
};

type ScheduleCalendarProps = {
  /** currently selected date, in YYYY-MM-DD */
  selectedDate: string;
  /** dates that should carry a dot marker, e.g. dates with bookings */
  markedDates: MarkedDatesType;
  /** fired with the pressed date's dateString */
  onDayPress: (date: string) => void;
};

export const ScheduleCalendar = ({
  selectedDate,
  markedDates,
  onDayPress,
}: ScheduleCalendarProps) => {
  /** to get the default theme of app */
  const theme = useTheme();

  /** theme integration in styles */
  const styles = makeStyle(theme);

  return (
    <View style={styles.main}>
      <Calendar
        key={theme.dark ? 'dark' : 'light'}
        enableSwipeMonths
        current={selectedDate}
        theme={{
          calendarBackground: theme.colors.surfaceVariant,
          arrowColor: theme.dark
            ? theme.colors.onSurface
            : theme.colors.primary,
          selectedDayBackgroundColor: theme.colors.primary,
          selectedDayTextColor: theme.colors.surface,
          dayTextColor: theme.colors.onSurface,
          monthTextColor: theme.colors.onSurface,
          dotColor: theme.colors.statusBusyColor,
        }}
        onDayPress={(day: DateData) => {
          onDayPress(day.dateString);
        }}
        markingType="custom"
        markedDates={{
          ...markedDates,
          [selectedDate]: {
            ...markedDates[selectedDate],
            selected: true,
            customStyles: {
              container: {
                backgroundColor: theme.colors.primary,
              },
              text: {
                color: theme.colors.onPrimary,
                fontWeight: 'bold',
              },
            },
          },
        }}
      />
    </View>
  );
};

// {!isExpanded ? (
//           <WeekCalendar
//             testID={'weekCalendar'}
//             firstDay={1}
//             // markedDates={marked.current}
//           />
//         ) : (
//           <ExpandableCalendar
//             testID={'expandableCalendar'}
//             ref={calendarRef}
//             onCalendarToggled={onCalendarToggled}
//             firstDay={1}
//           />
//         )}

const makeStyle = (theme: CustomTheme) =>
  StyleSheet.create({
    main: {
      flex: 1,
    },
  });
