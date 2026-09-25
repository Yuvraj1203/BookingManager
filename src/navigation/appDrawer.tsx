import { CustomImage, CustomText, TextVariants } from '@/components';
import { Images } from '@/theme/assets/images';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const AppDrawer = () => {
  const { height, width } = useWindowDimensions();

  /** to get the default theme of app */
  const theme = useTheme();

  const insets = useSafeAreaInsets();

  /** theme integration in styles */
  const styles = makeStyle(theme, height, width, insets);

  return (
    <View style={styles.main}>
      <CustomImage source={Images.appBanner} style={styles.appbanner} />

      <View style={styles.bottomLay}>
        <View style={styles.bottomLayInfo}>
          <View style={styles.dot} />
          <CustomText
            allowFontScaling={false}
            variant={TextVariants.labelMedium}
          >{`BuildVersion : 0.0.1`}</CustomText>
        </View>
        <CustomText allowFontScaling={false} variant={TextVariants.labelMedium}>
          {`Version : 0.0.1`}
        </CustomText>
      </View>
    </View>
  );
};

const makeStyle = (
  theme: CustomTheme,
  height: number,
  width: number,
  insets: { top: number; bottom: number },
) =>
  StyleSheet.create({
    main: {
      flex: 1,
      justifyContent: 'space-between',
      backgroundColor: theme.colors.surface,
    },
    appbanner: {
      width: '100%',
      height: height / 1.3,
      borderBottomEndRadius: 150,
    },

    bottomLay: {
      flexDirection: 'row',
      paddingTop: 20,
      paddingBottom: Platform.OS === 'ios' ? insets.bottom : 30,
      borderTopWidth: 0.5,
      borderColor: theme.colors.border,
      paddingHorizontal: 10,
      justifyContent: 'space-around',
    },
    bottomLayInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 10,
    },
    dot: {
      height: 5,
      width: 5,
      borderRadius: theme.roundness,
      backgroundColor: theme.colors.completed,
    },
  });
