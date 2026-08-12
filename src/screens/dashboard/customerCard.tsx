import {
  CustomChip,
  CustomText,
  Divider,
  Tap,
  TextVariants,
} from '@/components';
import { BookingType } from '@/store';
import { Images } from '@/theme/assets/images';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { useAppNavigation } from '@/utils/navigationUtils';
import { formatDate } from '@/utils/utils';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

type CustomerCardProps = {
  cardItem: BookingType;
};

enum CardDateTimeEnum {
  Date = 'ddd DD MMM',
  Time = 'hh:mm',
}

export const CustomerCard = ({ cardItem }: CustomerCardProps) => {
  /**to get the default theme of app */
  const theme = useTheme();

  /** theme integration in styles */
  const styles = makeStyles(theme);

  /** for tranlations */
  const { t } = useTranslation();

  /** for navigation */
  const navigation = useAppNavigation();

  /** handle press */
  const handlePress = () => {
    navigation.navigate('BookingDetail', {
      id: cardItem.id,
    });
  };

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
    <Tap onPress={handlePress} style={styles.card} shadow={true}>
      <View style={styles.header}>
        <CustomText
          maxLines={1}
          variant={TextVariants.titleLarge}
          style={styles.name}
        >
          {cardItem.clientName}
        </CustomText>
        <CustomChip label={cardItem.status} />
      </View>

      <View style={styles.detailRow}>
        <Images.Clock size={16} />
        <CustomText>{eventDate}</CustomText>
        <CustomText>{'∙'}</CustomText>
        <CustomText>{eventTime}</CustomText>
      </View>

      <View style={styles.detailRow}>
        <Images.Location size={16} />
        <CustomText>{cardItem.venue}</CustomText>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.header}>
        <View style={styles.detailRow}>
          <Images.Phone size={16} />
          <CustomText>{cardItem.mobile}</CustomText>
        </View>

        <View>
          <CustomText
            maxLines={1}
            variant={TextVariants.titleLarge}
            style={styles.name}
          >
            <Images.IndianRupee
              size={18}
              strokeWidth={2.75}
              color={theme.colors.onSurfaceVariant}
            />
            {cardItem.totalAmount}
          </CustomText>
          <CustomText color={theme.colors.statusBusyColor}>
            {t('Due')}
            <Images.IndianRupee
              size={14}
              color={theme.colors.statusBusyColor}
              fontWeight={600}
              strokeWidth={2.75}
            />
            {Number(cardItem.totalAmount) - Number(cardItem.advancePaid)}
          </CustomText>
        </View>
      </View>
    </Tap>
  );
};

const makeStyles = (theme: CustomTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      padding: 20,
      gap: 7,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 10,
    },
    name: {
      fontWeight: '600',
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    divider: {
      borderStyle: 'dashed',
    },
  });
