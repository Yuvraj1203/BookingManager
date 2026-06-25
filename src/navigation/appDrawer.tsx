import {
  CustomImage,
  CustomText,
  ResizeModeType,
  SafeScreen,
  TextVariants,
} from '@/components';
import { Images } from '@/theme/assets/images';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const AppDrawer = (props: any) => {
  /**for getting custom theme */
  const theme = useTheme();

  const insets = useSafeAreaInsets(); // Handle status/navigation bar safely

  /**for sending to styles custom theme */
  const styles = makeStyle(theme, insets);
  return (
    <SafeScreen style={styles.main}>
      <View style={styles.header}>
        <CustomImage
          source={Images.appBanner}
          color={theme.dark ? theme.colors.onSurfaceVariant : undefined}
          style={styles.logo}
          resizeMode={ResizeModeType.contain}
        />
      </View>

      {/* Drawer Items */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerContent}
        style={styles.main}
      >
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* drawer footer */}
      <View style={styles.bottomLay}>
        <View style={styles.dot} />
        <View style={styles.versionLay}>
          <CustomText variant={TextVariants.labelMedium}>
            {'Build Version'}
          </CustomText>
          <CustomText variant={TextVariants.labelMedium}>
            {'Version'}
          </CustomText>
        </View>
      </View>
    </SafeScreen>
  );
};

const makeStyle = (
  theme: CustomTheme,
  insets: { top: number; bottom: number },
) =>
  StyleSheet.create({
    main: {
      flex: 1,
    },
    header: {
      alignItems: 'center',
    },
    logo: {
      alignSelf: 'center',
      height: 60,
      width: 100,
    },
    drawerContent: {
      flex: 1,
    },
    bottomLay: {
      flexDirection: 'row',
      paddingTop: 20,
      paddingBottom: insets.bottom,
      paddingHorizontal: 10,
      alignItems: 'flex-start',
      borderTopWidth: 0.5,
      borderColor: theme.colors.border,
      gap: 20,
    },
    dot: {
      height: 5,
      width: 5,
      borderRadius: theme.roundness,
      backgroundColor: theme.colors.completed,
      marginTop: 7,
    },
    versionLay: {
      //   flexDirection: 'row',
      //   marginHorizontal: 10,
    },
  });
