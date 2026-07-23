import {
  CustomButton,
  CustomText,
  FormTextInput,
  SafeScreen,
  Tap,
} from '@/components';
import { InputModes } from '@/components/customTextInput/formTextInput';
import { Images } from '@/theme/assets/images';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { useAppNavigation } from '@/utils/navigationUtils';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
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

export const AddBooking = () => {
  /**to get the default theme of app */
  const theme = useTheme();

  /** theme integration in styles */
  const styles = makeStyles(theme);

  /** for tranlations */
  const { t } = useTranslation();

  /** for navigation */
  const navigation = useAppNavigation();

  /** use form declaration */
  const { control, handleSubmit } = useForm<AddBookingSchemaType>({
    resolver: zodResolver(addBookingSchema),
    defaultValues: {},
  });

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
              <FormTextInput
                control={control}
                name={'date'}
                placeholder={t('Date')}
                label={t('Date')}
                style={styles.field}
              />
              <FormTextInput
                control={control}
                name={'time'}
                placeholder={t('Time')}
                label={t('Time')}
                style={styles.field}
              />
              <FormTextInput
                control={control}
                name={'duration'}
                placeholder={t('Duration')}
                label={t('Duration')}
                inputMode={InputModes.numeric}
                style={styles.field}
              />
              <FormTextInput
                control={control}
                name={'horses'}
                placeholder={t('Horses')}
                label={t('Horses')}
                style={styles.field}
              />
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
              <FormTextInput
                control={control}
                name={'totalAmount'}
                placeholder={t('TotalAmount')}
                label={t('TotalAmount')}
                inputMode={InputModes.decimal}
                style={styles.field}
              />
              <FormTextInput
                control={control}
                name={'advancePaid'}
                placeholder={t('AdvancePaid')}
                label={t('AdvancePaid')}
                inputMode={InputModes.decimal}
                style={styles.field}
              />
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

              <Tap onPress={() => {}} style={styles.imagePickerTap}>
                <Images.CirclePlus size={40} strokeWidth={1.5} />
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
      height: 150,
    },
    field: {
      marginTop: 5,
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
