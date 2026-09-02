import {
  CustomText,
  SafeScreen,
  Shadow,
  Tap,
  TextVariants,
} from '@/components';
import { BookingType, useBookingStore } from '@/store';
import { Images } from '@/theme/assets/images';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { useAppNavigation, useAppRoute } from '@/utils/navigationUtils';
import { handleCall, handleWhatsApp } from '@/utils/utils';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import DetailCard from './detailCard';

export type BookingDetailProps = {
  cardItem: BookingType;
};

const BookingDetail = () => {
  /** for getting the parameter */
  const cardItem = useAppRoute('BookingDetail').params.cardItem;

  /**to get the default theme of app */
  const theme = useTheme();

  const insets = useSafeAreaInsets();

  /** theme integration in styles */
  const styles = makeStyle(theme, insets);

  /** for navigation */
  const navigation = useAppNavigation();

  /** for tranlations */
  const { t } = useTranslation();

  /** booking store */
  const bookingStore = useBookingStore();

  //handle delete
  const handleDelete = (id: string) => {
    bookingStore.deleteBooking(id);
    navigation.goBack();
  };

  /** color icons in action data */
  const actionDataIconColor = theme.colors.onSurfaceVariant;
  const actionDataIconSize = 18;

  /** action data array */
  const actionData = [
    {
      label: t('Call'),
      icon: (
        <Images.Phone color={actionDataIconColor} size={actionDataIconSize} />
      ),
      bg: theme.colors.surface,
      onTap: () => handleCall(cardItem.mobile),
    },
    {
      label: t('WhatsApp'),
      icon: (
        <Images.Message color={actionDataIconColor} size={actionDataIconSize} />
      ),
      bg: theme.colors.surface,
      onTap: () => handleWhatsApp(cardItem.mobile),
    },
    {
      label: t('PreviewPDF'),
      icon: (
        <Images.File color={actionDataIconColor} size={actionDataIconSize} />
      ),
      bg: theme.colors.background,
      onTap: () => console.log('pdf'),
    },
    {
      label: t('SharePDF'),
      icon: (
        <Images.Share color={actionDataIconColor} size={actionDataIconSize} />
      ),
      bg: theme.colors.background,
      onTap: () => console.log('pdf'),
    },
  ];

  const highlightedFieldsData = [
    {
      label: t('Phone'),
      value: cardItem.mobile,
    },
    {
      label: t('Horses'),
      value: cardItem.horses,
    },
    {
      label: t('Services'),
      value: cardItem.addOns || '-',
    },
    {
      label: t('AdvancePaid'),
      value: cardItem.advancePaid,
    },
    {
      label: t('Notes'),
      value: cardItem.notes || '-',
    },
  ];

  return (
    <SafeScreen style={styles.main}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <DetailCard cardItem={cardItem} />

        <View style={styles.actionContainer}>
          {actionData.map((item, index) => {
            return (
              <View key={index} style={styles.actionBoxContainer}>
                <Shadow
                  onPress={item.onTap}
                  style={[styles.actionBox, { backgroundColor: item.bg }]}
                >
                  {item.icon}
                  <CustomText>{item.label}</CustomText>
                </Shadow>
              </View>
            );
          })}
        </View>

        <View style={styles.highlightedFieldContainer}>
          {highlightedFieldsData.map((item, index) => {
            return (
              <View key={index} style={styles.highlightedFields}>
                <CustomText>{item.label}</CustomText>
                <CustomText
                  variant={TextVariants.bodyLarge}
                  color={theme.colors.onSurface}
                >
                  {item.value}
                </CustomText>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Tap
          containerStyle={styles.tap}
          style={[styles.delete, styles.footerButton]}
          onPress={() => handleDelete(cardItem.id)}
        >
          {/* <Images.Trash /> */}
          <CustomText color={theme.colors.onDark}>{t('Delete')}</CustomText>
        </Tap>

        <Tap
          containerStyle={styles.tap}
          style={[styles.update, styles.footerButton]}
          onPress={() => navigation.navigate('AddBooking', { cardItem })}
        >
          {/* <Images.Trash /> */}
          <CustomText color={theme.colors.onSurfaceVariant}>
            {t('Update')}
          </CustomText>
        </Tap>
      </View>
    </SafeScreen>
  );
};

const makeStyle = (theme: CustomTheme, insets: EdgeInsets) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    main: {
      flex: 1,
      paddingVertical: 10,
    },
    scrollContent: {
      paddingBottom: 100,
      paddingHorizontal: 10,
    },
    tap: {
      flex: 1,
    },
    actionContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginVertical: 15,
    },
    actionBoxContainer: {
      width: '50%',
      padding: 10,
    },
    actionBox: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    footer: {
      width: '100%',
      position: 'absolute',
      bottom: 0,
      boxShadow: theme.upperBoxShadow,
      flexDirection: 'row',
      alignItems: 'center',
      // justifyContent: 'space-between',
      gap: 10,
      paddingBottom: insets.bottom,
      padding: 10,
      backgroundColor: theme.colors.surface,
    },
    footerButton: {
      padding: 10,
      alignItems: 'center',
    },
    delete: {
      backgroundColor: theme.colors.danger,
    },
    update: {
      borderWidth: 1,
      borderColor: theme.colors.onSurfaceVariant,
    },
    highlightedFieldContainer: {
      gap: 15,
    },
    highlightedFields: {
      boxShadow: theme.insetShadow,
      borderRadius: theme.roundness,
      paddingVertical: 10,
      paddingHorizontal: 20,
      gap: 3,
      backgroundColor: theme.colors.background,
    },
  });

export default BookingDetail;
