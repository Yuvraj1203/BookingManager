import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { useAppNavigation } from '@/utils/navigationUtils';
import { formatDate } from '@/utils/utils';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Theme } from 'react-native-calendars/src/types';

const enum DateFormatsEnum {
  Date = 'YYYY-MM-DD',
  FullDate = 'YYYY-MM-DDTHH:mm:ss',
  ApiUTCDate = 'DD MMM YYYY hh:mm A',
  UIDate = 'MMM DD, YYYY',
  UITime = 'hh:mm A',
  Year = 'YYYY',
}

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

export const ScheduleCalendar = () => {
  /** to get the default theme of app */
  const theme = useTheme();

  /** theme integration in styles */
  const styles = makeStyle(theme);

  /** for translations */
  const { t } = useTranslation();

  /** for navigation */
  const navigation = useAppNavigation();

  const currentLocalDate = useRef(
    formatDate({ date: new Date(), returnFormat: DateFormatsEnum.Date }),
  );

  /** Added by @Yuvraj 05-03-2025 -> selected date (FYN-5817) */
  const [selectedDate, setSelectedDate] = useState(currentLocalDate.current);

  const [markedData, setMarkedData] = useState<MarkedDatesType>({});

  /** Added by @Yuvraj 05-03-2025 -> for handling the date change event and handling the debouncing (FYN-5817) */
  const handleDateChange = (date: string) => {
    setSelectedDate(date);

    // setIsExpanded(true);
  };

  return (
    <View style={styles.main}>
      <Calendar
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
        }}
        onDayPress={(day: DateData) => {
          // if (!loading) {
          // setIsExpanded(false);
          handleDateChange(day.dateString);
          // }
        }}
        onVisibleMonthsChange={(date: DateData[]) => {
          // handleMonthChange(date?.at(0));
        }}
        markingType="custom"
        markedDates={{
          ...markedData,
          [selectedDate]: {
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
