import {
  CurrencyFormInput,
  CustomButton,
  CustomImagePicker,
  CustomText,
  FormTextInput,
  SafeScreen,
  Tap,
} from '@/components';
import { CustomDatePickerReturnProp } from '@/components/customDatePicker/customDatePicker';
import { DatePickerMode } from '@/components/customDatePicker/customDatePicker.types';
import { InputModes } from '@/components/customTextInput/formTextInput';
import { Images } from '@/theme/assets/images';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import {
  useAppNavigation,
  useReturnDataContext,
} from '@/utils/navigationUtils';
import { formatDate } from '@/utils/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { addBookingSchema, AddBookingSchemaType } from './addBooking.schema';

const { height } = Dimensions.get('screen');

//id for receiving data back as two
enum DatePickerEnum {
  Date = 'Date',
  Time = 'Time',
}

enum DateFormatEnum {
  ShortMonth = 'MMM DD,YYYY',
  HourMinute = 'hh:mm A',
}

export const AddBooking = () => {
  /**to get the default theme of app */
  const theme = useTheme();

  /** theme integration in styles */
  const styles = makeStyles(theme);

  /** for tranlations */
  const { t } = useTranslation();

  /** for navigation */
  const navigation = useAppNavigation();

  /** image picker state */
  const [showPicker, setShowPicker] = useState(false);

  /** date ad time state */
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<Date>();

  /** use form declaration */
  const { control, handleSubmit, setValue } = useForm<AddBookingSchemaType>({
    defaultValues: {
      duration: '1',
      horses: '1',
    },
    resolver: zodResolver(addBookingSchema),
  });

  /** receive value from date picker */
  const { receiveDataBack } = useReturnDataContext();

  receiveDataBack('AddBooking', (data: CustomDatePickerReturnProp) => {
    console.log('this is your data=>', data.id, data.selectedDate);
    if (data.selectedDate) {
      if (data.id === DatePickerEnum.Date) {
        setSelectedDate(data.selectedDate);
        const formattedDate = formatDate({
          date: data.selectedDate,
          // parseFormat: 'YYYY-MM-DDTHH:mm:ss',
          returnFormat: DateFormatEnum.ShortMonth,
        });
        setValue('date', formattedDate);
      } else if (data.id === DatePickerEnum.Time) {
        setSelectedTime(data.selectedDate);
        const formattedDate = formatDate({
          date: data.selectedDate,
          // parseFormat: 'YYYY-MM-DDTHH:mm:ss',
          returnFormat: DateFormatEnum.HourMinute,
        });
        setValue('time', formattedDate);
      }
    }
  });

  /** opens the CustomDatePicker formSheet and writes the picked date back into the form */
  const openDatePicker = () => {
    navigation.navigate('CustomDatePicker', {
      mode: DatePickerMode.date,
      title: t(DatePickerEnum.Date),
      date: selectedDate ?? new Date(),
      parentScreen: 'AddBooking',
    });
  };

  /** opens the CustomDatePicker formSheet in time mode and writes the picked time back into the form */
  const openTimePicker = () => {
    navigation.navigate('CustomDatePicker', {
      mode: DatePickerMode.time,
      title: t(DatePickerEnum.Time),
      date: selectedTime ?? new Date(),
      parentScreen: 'AddBooking',
    });
  };

  /** save the booking */
  const onSubmit = (data: AddBookingSchemaType) => {
    // TODO: persist booking once a booking store/API is available
    console.log('booking', data);
    navigation.goBack();
  };

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.select({
          ios: 0,
          android: 500,
        })}
      >
        <View style={styles.main}>
          <View style={styles.dragger}>
            <></>
          </View>
          <View style={styles.container} collapsable={false}>
            <ScrollView
              style={styles.mainContainer}
              automaticallyAdjustKeyboardInsets
            >
              <FormTextInput
                control={control}
                name={'clientName'}
                placeholder={t('ClientName')}
                label={t('ClientName')}
              />
              <FormTextInput
                control={control}
                name={'mobile'}
                placeholder={t('Mobile')}
                label={t('Mobile')}
                inputMode={InputModes.phone}
                maxLength={10}
                style={styles.field}
              />
              <View style={styles.flexRow}>
                <Tap containerStyle={styles.flex} onPress={openDatePicker}>
                  <FormTextInput
                    control={control}
                    name={'date'}
                    placeholder={t('Date')}
                    label={t('Date')}
                    enabled={false}
                    style={[styles.field, styles.flex]}
                  />
                </Tap>
                <Tap containerStyle={styles.flex} onPress={openTimePicker}>
                  <FormTextInput
                    control={control}
                    name={'time'}
                    placeholder={t('Time')}
                    label={t('Time')}
                    enabled={false}
                    style={[styles.field, styles.flex]}
                  />
                </Tap>
              </View>
              <View style={styles.flexRow}>
                <FormTextInput
                  control={control}
                  name={'duration'}
                  placeholder={t('Duration')}
                  label={t('Duration')}
                  inputMode={InputModes.numeric}
                  style={[styles.field, styles.flex]}
                />
                <FormTextInput
                  control={control}
                  name={'horses'}
                  placeholder={t('Horses')}
                  label={t('Horses')}
                  style={[styles.field, styles.flex]}
                />
              </View>
              <FormTextInput
                control={control}
                name={'venue'}
                placeholder={t('Venue')}
                label={t('Venue')}
                style={styles.field}
              />
              <FormTextInput
                control={control}
                name={'addOns'}
                placeholder={t('AddOns')}
                label={t('AddOns')}
                style={styles.field}
              />
              <View style={styles.flexRow}>
                <CurrencyFormInput
                  control={control}
                  name={'totalAmount'}
                  placeholder={t('TotalAmount')}
                  label={t('TotalAmount')}
                  style={[styles.field, styles.flex]}
                />
                <CurrencyFormInput
                  control={control}
                  name={'advancePaid'}
                  placeholder={t('AdvancePaid')}
                  label={t('AdvancePaid')}
                  style={[styles.field, styles.flex]}
                />
              </View>
              <FormTextInput
                control={control}
                name={'status'}
                placeholder={t('Status')}
                label={t('Status')}
                style={styles.field}
              />
              <FormTextInput
                control={control}
                name={'notes'}
                placeholder={t('Notes')}
                label={t('Notes')}
                multiLine
                maxLines={4}
                style={styles.field}
              />

              <Tap
                onPress={() => setShowPicker(true)}
                style={styles.imagePickerTap}
              >
                <Images.CirclePlus
                  size={40}
                  strokeWidth={1.5}
                  color={theme.colors.onSurface}
                />
                <CustomText>{t('UploadImage')}</CustomText>
              </Tap>
            </ScrollView>
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton onPress={handleSubmit(onSubmit)}>
              {t('Save')}
            </CustomButton>
          </View>
        </View>

        <CustomImagePicker
          showPicker={showPicker}
          setShowPicker={setShowPicker}
        />
      </KeyboardAvoidingView>
    </SafeScreen>
  );
};

const makeStyles = (theme: CustomTheme) =>
  StyleSheet.create({
    main: {
      flex: 1,
      paddingTop: 10,
      height: height,
    },
    flex: {
      flex: 1,
    },
    container: {
      flex: 1,
    },
    mainContainer: {
      flex: 1,
      paddingHorizontal: 10,
    },
    dragger: {
      alignSelf: 'center',
      height: 4,
      width: 50,
      backgroundColor: theme.colors.surfaceDisabled,
      borderRadius: theme.extraRoundness,
      marginBottom: 20,
    },
    buttonContainer: {
      boxShadow: theme.upperBoxShadow,
      padding: 10,
      borderTopStartRadius: theme.roundness,
      borderTopEndRadius: theme.roundness,
    },
    field: {
      marginTop: 5,
    },
    flexRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 15,
      flex: 1,
    },
    imagePickerTap: {
      borderWidth: 1,
      borderStyle: 'dashed',
      padding: 20,
      borderRadius: theme.inputRoundness,
      borderColor: theme.colors.outline,
      marginBottom: 50,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
  });
