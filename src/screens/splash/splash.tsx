import { CustomImage, ResizeModeType, SafeScreen } from '@/components';
import { Images } from '@/theme/assets/images';
import { useAppNavigation } from '@/utils/navigationUtils';
import { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SplashScreen = () => {
  /** Added by @Yuvraj 21-06-2026 -> to access app theme(colors, roundness, fonts, etc) */
  //   const theme = useTheme();

  /** Added by @Yuvraj 21-06-2026 -> access StylesSheet with theme implemented */
  const styles = makeStyles();

  //redirect to dashboard
  const navigation = useAppNavigation();

  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      navigation.navigate('DrawerRoute');
    }, 5000);

    return () => clearTimeout(redirectTimeout);
  });

  return (
    <SafeScreen>
      <View style={styles.container}>
        <CustomImage
          source={Images.appBanner}
          style={styles.image}
          resizeMode={ResizeModeType.contain}
        />

        <CustomImage
          source={Images.splashLoading}
          style={styles.splashLoadingGif}
          //   resizeMode={ResizeModeType.contain}
        />
      </View>
    </SafeScreen>
  );
};

const makeStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: width, // Adjust the size as needed
      height: height * 0.4, // Adjust the size as needed
    },
    splashLoadingGif: {
      width: 150,
      height: 150,
      alignSelf: 'center',
    },
  });
