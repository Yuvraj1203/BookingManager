import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import {
  useAppNavigation,
  useAppRoute,
  useReturnDataContext,
} from '@/utils/navigationUtils';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import CustomButton, { ButtonVariants } from '../customButton/customButton';
import { CustomText, TextVariants } from '../customText/customText';
import { DatePickerMode } from './customDatePicker.types';

export type {
  CustomDatePickerProps,
  DatePickerMode,
} from './customDatePicker.types';

export type CustomDatePickerReturnProp = {
  selectedDate: string;
  id: string;
};

// Screen (formSheet) version of the date/time picker. Navigate to it with
// navigation.navigate('CustomDatePicker', { mode, date, onConfirm }) and it
// will pop itself once the user confirms, handing the picked Date back
// through the onConfirm callback passed in params.
const CustomDatePicker = () => {
  const { params } = useAppRoute('CustomDatePicker');
  const navigation = useAppNavigation();

  const theme = useTheme(); // theme

  const styles = makeStyles(theme); // styling

  const { t } = useTranslation(); // translations

  const mode = params.mode ?? DatePickerMode.date;

  const [loading, setLoading] = useState<boolean>(false);

  // Parse string ISO / number timestamp back into Date instances safely
  const initialDate = params.date ? new Date(params.date) : new Date();
  const maximumDate = params.maxDate ? new Date(params.maxDate) : undefined;
  const minimumDate = params.minDate ? new Date(params.minDate) : undefined;

  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);

  /** Added by @Yuvraj 27-03-2025 ---> send data the data to be send on parent (FYN-6016)*/
  const { sendDataBack } = useReturnDataContext();

  const handleConfirm = () => {
    sendDataBack(params.parentScreen, {
      selectedDate: selectedDate.toISOString(),
      id: params.title ?? params.title,
    } as CustomDatePickerReturnProp);
    navigation.goBack();
  };

  return (
    <View style={styles.main}>
      {params.title ? (
        <CustomText variant={TextVariants.titleMedium} style={styles.title}>
          {params.title}
        </CustomText>
      ) : null}
      <DatePicker
        mode={mode}
        date={selectedDate}
        maximumDate={maximumDate}
        minimumDate={minimumDate}
        onConfirm={dateValue => {
          setSelectedDate(dateValue);
        }}
        onDateChange={dateValue => {
          setSelectedDate(dateValue);
        }}
        onStateChange={value => {
          if (value === 'spinning') {
            setLoading(true);
          } else if (value === 'idle') {
            setLoading(false);
          }
        }}
        theme={theme.dark ? 'dark' : 'light'}
      />
      <CustomButton
        mode={ButtonVariants.outlined}
        style={{
          ...styles.confirmBtn,
          borderColor: loading ? theme.colors.outline : theme.colors.primary,
        }}
        textColor={loading ? theme.colors.outline : theme.colors.primary}
        onPress={() => {
          if (!loading) {
            handleConfirm();
          }
        }}
      >
        {t('Confirm')}
      </CustomButton>
    </View>
  );
};

const makeStyles = (theme: CustomTheme) =>
  StyleSheet.create({
    main: {
      alignItems: 'center',
    },
    title: {
      marginTop: 20,
    },
    confirmBtn: {
      margin: 20,
      alignSelf: 'flex-end',
    },
    customPickerStyle: {
      backgroundColor: theme.colors.surface,
      flex: 1,
      width: '100%',
      height: 250,
    },
    customPickerContainer: {
      flexDirection: 'row',
    },
  });

export default CustomDatePicker;
