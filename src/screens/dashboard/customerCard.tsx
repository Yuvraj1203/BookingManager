import { CustomChip, CustomText, Tap, TextVariants } from '@/components';
import { BookingType } from '@/store';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { useAppNavigation } from '@/utils/navigationUtils';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type CustomerCardProps = {
  cardItem: BookingType;
};

export const CustomerCard = ({ cardItem }: CustomerCardProps) => {
  /**to get the default theme of app */
  const theme = useTheme();

  /** theme integration in styles */
  const styles = makeStyles(theme);

  /** for tranlations */
  // const { t } = useTranslation();

  /** for navigation */
  const navigation = useAppNavigation();

  /** handle press */
  const handlePress = () => {
    navigation.navigate('BookingDetail', {
      id: cardItem.id,
    });
  };

  return (
    <Tap onPress={handlePress} style={styles.card} shadow={true}>
      <View style={styles.header}>
        <CustomText variant={TextVariants.titleMedium}>
          {cardItem.clientName}
        </CustomText>
        <CustomChip label={cardItem.status} />
      </View>
    </Tap>
  );
};

const makeStyles = (theme: CustomTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 10,
    },
  });
