import { CustomText, Shadow, TextVariants } from '@/components';
import { Images } from '@/theme/assets/images';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

type RevenueCardProps = {
  label: string;
  amount: number | string;
  style?: StyleProp<ViewStyle>;
  textColor?: string;
};

export const RevenueCard = ({ label, amount, ...props }: RevenueCardProps) => {
  /**to get the default theme of app */
  const theme = useTheme();

  /** theme integration in styles */
  const styles = makeStyle(theme);

  return (
    <Shadow style={[styles.card, props.style]}>
      <CustomText color={props.textColor}>{label}</CustomText>
      <View style={styles.cardAmount}>
        <Images.IndianRupee
          color={props.textColor ?? theme.colors.onSurfaceVariant}
          size={20}
        />
        <CustomText variant={TextVariants.titleLarge} color={props.textColor}>
          {amount}
        </CustomText>
      </View>
    </Shadow>
  );
};

const makeStyle = (theme: CustomTheme) =>
  StyleSheet.create({
    card: {
      padding: 20,
      marginVertical: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cardAmount: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    gradient: {
      boxShadow: theme.boxShadow,
      borderRadius: theme.roundness,
      padding: 0,
      marginVertical: 10,
    },
    cardGradient: {
      padding: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });
