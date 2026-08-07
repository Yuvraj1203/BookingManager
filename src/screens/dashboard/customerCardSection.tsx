import { CustomText, TextVariants } from '@/components';
import { BookingType } from '@/store';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { CustomerCard } from './customerCard';

type CustomerCardSectionProps = {
  title?: string;
  data: BookingType[];
};

export const CustomerCardSection = ({ ...props }: CustomerCardSectionProps) => {
  /**to get the default theme of app */
  const theme = useTheme();

  /** theme integration in styles */
  const styles = makeStyles(theme);

  /** for tranlations */
  const { t } = useTranslation();

  return (
    <View style={styles.main}>
      <CustomText maxLines={1} variant={TextVariants.bodyLarge}>
        {props.title}
      </CustomText>
      {props.data && props.data.length > 0 ? (
        props.data.map((booking, index) => {
          return <CustomerCard key={index} cardItem={booking} />;
        })
      ) : (
        <View style={styles.emptyContainer}>
          <CustomText
            maxLines={1}
            variant={TextVariants.bodySmall}
            color={theme.colors.outline}
          >
            {t('NothingScheduledYet')}
          </CustomText>
        </View>
      )}
    </View>
  );
};

const makeStyles = (theme: CustomTheme) =>
  StyleSheet.create({
    main: {
      marginVertical: 20,
      gap: 15,
    },
    emptyContainer: {
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: theme.colors.border,
      padding: 20,
      borderRadius: theme.roundness,
    },
  });
