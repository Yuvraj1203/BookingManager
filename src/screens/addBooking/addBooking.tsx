import {
  CurrencyFormInput,
  CustomButton,
  CustomImage,
  CustomImagePicker,
  CustomMenu,
  CustomText,
  Dragger,
  FormTextInput,
  ImageType,
  MenuActionWithHandler,
  SafeScreen,
  Tap,
} from '@/components';
import { CustomDatePickerReturnProp } from '@/components/customDatePicker/customDatePicker';
import { DatePickerMode } from '@/components/customDatePicker/customDatePicker.types';
import { InputModes } from '@/components/customTextInput/formTextInput';
import { EditBookingInput, useBookingStore } from '@/store';
import { Images } from '@/theme/assets/images';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import {
  useAppNavigation,
  useAppRoute,
  useReturnDataContext,
} from '@/utils/navigationUtils';
import { formatCurrency, formatDate } from '@/utils/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ImagePickerResponse } from 'react-native-image-picker';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  AddBookingPayload,
  addBookingSchema,
  AddBookingSchemaType,
} from './addBooking.schema';

//id for receiving data back as two
enum DatePickerEnum {
  Date = 'Date',
  Time = 'Time',
}

enum DateFormatEnum {
  ShortMonth = 'MMM DD,YYYY',
  HourMinute = 'hh:mm A',
}

export enum StatusEnum {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

export type AddBookingProps = {
  cardItem: EditBookingInput;
};

export const AddBooking = () => {
  /** for getting the parameter */
  const cardItem = useAppRoute('AddBooking').params?.cardItem;

  /**to get the default theme of app */
  const theme = useTheme();

  /** theme integration in styles */
  const styles = makeStyles(theme);

  /** for tranlations */
  const { t } = useTranslation();

  /** for navigation */
  const navigation = useAppNavigation();

  /** booking store */
  const bookingStore = useBookingStore();

  /** image picker state */
  const [showPicker, setShowPicker] = useState(false);

  /** show error */
  const [errorMsg, setErrorMsg] = useState<string>();

  /** date ad time state */
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());

  /** selected images */
  const [selectedImages, setSelectedImages] = useState<ImagePickerResponse[]>(
    [],
  );

  /** menu data for status */
  const menuActions: MenuActionWithHandler[] = [
    {
      id: StatusEnum.Pending,
      title: StatusEnum.Pending,
    },
    {
      id: StatusEnum.Confirmed,
      title: StatusEnum.Confirmed,
    },
    {
      id: StatusEnum.Completed,
      title: StatusEnum.Completed,
    },
    {
      id: StatusEnum.Cancelled,
      title: StatusEnum.Cancelled,
      attributes: {
        destructive: true,
      },
    },
  ];

  /** use form declaration */
  const { control, handleSubmit, setValue } = useForm<AddBookingSchemaType>({
    defaultValues: {
      clientName: cardItem?.clientName ?? '',
      mobile: cardItem?.mobile ?? '',
      date: cardItem?.date ?? '',
      time: cardItem?.time ?? '',
      duration: cardItem?.duration ?? '',
      horses: cardItem?.horses ?? '',
      venue: cardItem?.venue ?? '',
      addOns: cardItem?.addOns ?? '',
      totalAmount: formatCurrency(`${cardItem?.totalAmount}`) ?? '',
      advancePaid: formatCurrency(`${cardItem?.advancePaid}`) ?? '',
      status: cardItem?.status ?? StatusEnum.Confirmed,
      notes: cardItem?.notes ?? '',
    },
    resolver: zodResolver(addBookingSchema),
  });

  /** handle media for image picker */
  const handleMediaList = (mediaList: ImagePickerResponse) => {
    setSelectedImages(prev => {
      const newUri = mediaList.assets?.[0]?.uri;

      const alreadyExists = prev?.some(
        item => item.assets?.[0]?.uri === newUri,
      );

      if (alreadyExists) {
        return prev;
      }

      return prev ? [...prev, mediaList] : [mediaList];
    });
    console.log('mediaList=>', JSON.stringify(mediaList));
  };

  /** delete media */
  const handleRemove = (mediaItem: ImagePickerResponse) => {
    setSelectedImages(prev => {
      if (!prev) return prev;

      const removeUri = mediaItem.assets?.[0]?.uri;

      return prev.filter(item => item.assets?.[0]?.uri !== removeUri);
    });
  };

  /** receive value from date picker */
  const { receiveDataBack } = useReturnDataContext();

  receiveDataBack('AddBooking', (data: CustomDatePickerReturnProp) => {
    if (data.selectedDate) {
      if (data.id === DatePickerEnum.Date) {
        setSelectedDate(new Date(data.selectedDate));
        const formattedDate = formatDate({
          date: data.selectedDate,
          // parseFormat: 'YYYY-MM-DDTHH:mm:ss',
          returnFormat: DateFormatEnum.ShortMonth,
        });
        setValue('date', formattedDate);
      } else if (data.id === DatePickerEnum.Time) {
        setSelectedTime(new Date(data.selectedDate));
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
      date: selectedDate.toISOString(),
      parentScreen: 'AddBooking',
    });
  };

  /** opens the CustomDatePicker formSheet in time mode and writes the picked time back into the form */
  const openTimePicker = () => {
    navigation.navigate('CustomDatePicker', {
      mode: DatePickerMode.time,
      title: t(DatePickerEnum.Time),
      date: selectedTime.toISOString(),
      parentScreen: 'AddBooking',
    });
  };

  /** save the booking */
  const onSubmit = (data: AddBookingSchemaType) => {
    //for total amount
    const strippedTotal = (data.totalAmount || '0').replace(/,/g, '');
    const numTotal = parseFloat(strippedTotal);
    if (isNaN(numTotal)) {
      setErrorMsg(t('PleaseEnterValidValue'));
      return;
    }

    //for pending amount
    const strippedPaid = (data.advancePaid || '0').replace(/,/g, '');
    const numPaid = parseFloat(strippedPaid);
    if (isNaN(numPaid)) {
      setErrorMsg(t('PleaseEnterValidValue'));
      return;
    }

    //total has to be greatter than advance
    if (numTotal - numPaid < 0) {
      setErrorMsg(t('EnterBiggerTotalThanAdvance'));
      return;
    }

    const payload: AddBookingPayload = {
      clientName: data.clientName,
      mobile: data.mobile,
      date: selectedDate.toString(),
      time: selectedTime.toString(),
      horses: data.horses,
      venue: data.venue,
      totalAmount: String(numTotal),
      duration: data.duration,
      addOns: data.addOns,
      advancePaid: String(numPaid),
      status: data.status,
      notes: data.notes,
      images: selectedImages,
    };

    let bookingResponse;
    if (cardItem?.id) {
      bookingResponse = bookingStore.updateBooking(cardItem.id, payload);
    } else {
      bookingResponse = bookingStore.addBooking(payload);
    }
    navigation.goBack();
    navigation.navigate('BookingDetail', { cardItem: bookingResponse });
  };

  /**animated style for error msg */
  const errorHeight = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(errorHeight.value, { duration: 500 }),
    };
  });

  useEffect(() => {
    if (!errorMsg) {
      errorHeight.value = 1;
      return;
    }

    errorHeight.value = 40;

    const resetTimeout = setTimeout(() => {
      setErrorMsg(undefined);
    }, 3000);

    return () => clearTimeout(resetTimeout);
  }, [errorMsg]);

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
          <Dragger />
          <Animated.View style={[animatedStyle]}>
            {errorMsg && (
              <CustomText style={styles.errorText} color={theme.colors.danger}>
                {errorMsg}
              </CustomText>
            )}
          </Animated.View>
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
              prefixIcon={{
                source: Images.flagIndia,
                type: ImageType.png,
              }}
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
                inputMode={InputModes.numeric}
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

            <CustomMenu
              actions={menuActions}
              onCommonPress={id => {
                setValue('status', id);
              }}
              trigger={
                <FormTextInput
                  control={control}
                  name={'status'}
                  placeholder={t('Status')}
                  label={t('Status')}
                  style={styles.field}
                  enabled={false}
                />
              }
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
            {selectedImages && selectedImages?.length > 0 ? (
              <View style={styles.imagesContainer}>
                {selectedImages.map((item, index) => {
                  const image = item.assets?.at(0);
                  return (
                    <View key={index} style={styles.imageItemContainer}>
                      <Tap
                        onPress={() => setShowPicker(true)}
                        style={styles.selectedImageTap}
                      >
                        <View style={styles.trash}>
                          <Images.Trash
                            color={theme.colors.danger}
                            size={20}
                            onPress={() => handleRemove(item)}
                          />
                        </View>
                        <CustomImage
                          source={{
                            uri: image?.uri,
                          }}
                          style={styles.renderImage}
                        />
                      </Tap>
                    </View>
                  );
                })}
                <View style={styles.imageItemContainer}>
                  <Tap
                    onPress={() => setShowPicker(true)}
                    style={[styles.selectedImageTap, styles.addSelectedImage]}
                  >
                    <Images.CirclePlus
                      size={40}
                      strokeWidth={1.5}
                      color={theme.colors.onSurface}
                    />
                  </Tap>
                </View>
              </View>
            ) : (
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
            )}
          </ScrollView>

          <View style={styles.buttonContainer}>
            <CustomButton
              textColor={theme.colors.onPrimary}
              onPress={handleSubmit(onSubmit)}
            >
              {t('Save')}
            </CustomButton>
          </View>

          <CustomImagePicker
            showPicker={showPicker}
            setShowPicker={setShowPicker}
            mediaList={handleMediaList}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
};

const makeStyles = (theme: CustomTheme) =>
  StyleSheet.create({
    main: {
      flex: 1,
    },
    flex: {
      flex: 1,
    },
    mainContainer: {
      flex: 1,
      paddingHorizontal: 10,
    },
    errorText: {
      alignSelf: 'center',
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
    renderImage: {
      width: 80,
      height: 80,
      borderRadius: theme.inputRoundness,
    },
    imagesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 20,
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
    selectedImageTap: {
      borderRadius: theme.inputRoundness,
      alignItems: 'center',
      justifyContent: 'center',
      aspectRatio: 1,
      borderWidth: 1,
    },
    addSelectedImage: {
      borderStyle: 'dashed',
      borderRadius: theme.inputRoundness,
      borderColor: theme.colors.outline,
    },
    imageItemContainer: {
      width: '25%',
      padding: 6,
    },
    trash: {
      position: 'absolute',
      padding: 5,
      right: 3,
      top: 3,
      borderRadius: theme.inputRoundness,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceDisabled,
      zIndex: 99,
    },
  });
