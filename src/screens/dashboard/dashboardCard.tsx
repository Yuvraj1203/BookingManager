import { CustomImage, CustomText, TextVariants } from '@/components';
import { Images } from '@/theme/assets/images';
import { ColorValue, StyleSheet, View } from 'react-native';

type DashboardCardProps = {
  color?: ColorValue;
  image: typeof Images;
  title: string;
  value: string;
  valueUnit: string;
};

export const DashboardCard = ({ ...props }: DashboardCardProps) => {
  /**to get the default theme of app */
  //   const theme = useTheme();

  /** theme integration in styles */
  const styles = makeStyle();
  return (
    <>
      <View style={styles.cardHeader}>
        <Images.Wallet size={16} color={props.color} />
        <CustomImage
          color={props.color}
          source={props.image}
          style={styles.cardsImage}
        />
        <CustomText variant={TextVariants.labelLarge} color={props.color}>
          {props.title}
        </CustomText>
      </View>
      <CustomText variant={TextVariants.headlineLarge} color={props.color}>
        {props.value}
      </CustomText>
      <CustomText color={props.color} variant={TextVariants.titleSmall}>
        {props.valueUnit}
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
      width: 16,
      height: 16,
    },
  });
