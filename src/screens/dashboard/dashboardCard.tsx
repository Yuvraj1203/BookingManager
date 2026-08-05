import {
  CustomImage,
  CustomText,
  TextEllipsis,
  TextVariants,
} from '@/components';
import { Images } from '@/theme/assets/images';
import { useTheme } from '@/theme/themeProvider/paperTheme';
import { ReactNode } from 'react';
import { ColorValue, StyleSheet, View } from 'react-native';
import { DASHBOARD_IMAGE_SIZE } from './dashboard';

type DashboardCardProps = {
  color?: ColorValue;
  image?: typeof Images;
  title: string;
  value: string;
  valueUnit?: string;
  icon?: ReactNode;
};

export const DashboardCard = ({ ...props }: DashboardCardProps) => {
  /**to get the default theme of app */
  const theme = useTheme();

  /** theme integration in styles */
  const styles = makeStyle();
  return (
    <>
      <View style={styles.cardHeader}>
        {props.icon && <>{props.icon}</>}
        {props.image && (
          <CustomImage
            color={props.color ?? theme.colors.onSurface}
            source={props.image}
            style={styles.cardsImage}
          />
        )}
        <CustomText
          maxLines={1}
          ellipsis={TextEllipsis.tail}
          variant={TextVariants.labelLarge}
          color={props.color}
        >
          {props.title.toUpperCase()}
        </CustomText>
      </View>
      <CustomText variant={TextVariants.headlineLarge} color={props.color}>
        {props.value}
      </CustomText>
      <CustomText
        maxLines={1}
        ellipsis={TextEllipsis.tail}
        color={props.color}
        variant={TextVariants.titleSmall}
      >
        {props.valueUnit?.toLowerCase()}
      </CustomText>
    </>
  );
};

const makeStyle = () =>
  StyleSheet.create({
    cardHeader: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
    },
    cardsImage: {
      width: DASHBOARD_IMAGE_SIZE,
      height: DASHBOARD_IMAGE_SIZE,
    },
  });
