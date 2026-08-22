import { CustomText, Divider, Shadow, TextVariants } from '@/components';
import { BookingType } from '@/store';
import { Images } from '@/theme/assets/images';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { useAppRoute } from '@/utils/navigationUtils';
import { formatCurrency, formatDate } from '@/utils/utils';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

export type DetailCardProps = {
  cardItem: BookingType;
};

enum CardDateTimeEnum {
  Date = 'dddd, DD MMMM YYYY',
  Time = 'hh:mm',
}

const DetailCard = ({ cardItem }: DetailCardProps) => {
  /** for getting the parameter */
  const param = useAppRoute('BookingDetail').params;

  /**to get the default theme of app */
  const theme = useTheme();

  /** theme integration in styles */
  const styles = makeStyle(theme);

  /** for tranlations */
  const { t } = useTranslation();

  /** common color for card */
  const sideCharacterTextColor = theme.colors.surfaceVariant;

  const eventDate = formatDate({
    date: cardItem.date,
    // parseFormat: 'YYYY-MM-DDTHH:mm:ss',
    returnFormat: CardDateTimeEnum.Date,
  });

  const eventTime = formatDate({
    date: cardItem.date,
    // parseFormat: 'YYYY-MM-DDTHH:mm:ss',
    returnFormat: CardDateTimeEnum.Time,
  });

  return (
    <Shadow style={styles.main}>
      <CustomText color={sideCharacterTextColor}>{cardItem.status}</CustomText>

      <CustomText
        variant={TextVariants.titleLarge}
        color={theme.colors.onPrimary}
      >
        {cardItem.clientName}
      </CustomText>

      <View style={styles.dateAndTime}>
        <CustomText color={sideCharacterTextColor}>{eventDate}</CustomText>
        <CustomText color={sideCharacterTextColor}>{'∙'}</CustomText>
        <CustomText color={sideCharacterTextColor}>{eventTime}</CustomText>
        <CustomText color={sideCharacterTextColor}>{'∙'}</CustomText>
        <CustomText color={sideCharacterTextColor}>
          {`${cardItem.duration} hr`}
        </CustomText>
      </View>

      <CustomText color={sideCharacterTextColor}>{cardItem.venue}</CustomText>

      <Divider />

      <View style={styles.cardFooter}>
        <View style={styles.amountContainer}>
          <CustomText color={sideCharacterTextColor}>{t('Total')}</CustomText>

          <CustomText
            variant={TextVariants.bodyLarge}
            color={theme.colors.onPrimary}
          >
            <Images.IndianRupee
              size={15}
              strokeWidth={2.75}
              color={theme.colors.onPrimary}
            />
            {formatCurrency(cardItem.totalAmount)}
          </CustomText>
        </View>

        <View style={styles.amountContainer}>
          <CustomText color={sideCharacterTextColor}>
            {t('BalanceDue')}
          </CustomText>

          <CustomText
            variant={TextVariants.bodyLarge}
            color={theme.colors.onPrimary}
          >
            <Images.IndianRupee
              size={15}
              strokeWidth={2.75}
              color={theme.colors.onPrimary}
            />
            {formatCurrency(
              `${Number(cardItem.totalAmount) - Number(cardItem.advancePaid)}`,
            )}
          </CustomText>
        </View>
      </View>
    </Shadow>
  );
};

const makeStyle = (theme: CustomTheme) =>
  StyleSheet.create({
    main: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 15,
      paddingHorizontal: 20,
      gap: 5,
    },
    dateAndTime: {
      flexDirection: 'row',
      gap: 7,
    },
    cardFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    amountContainer: {
      gap: 5,
    },
  });

export default DetailCard;
