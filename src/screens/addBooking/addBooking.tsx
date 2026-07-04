import {
  CustomImage,
  CustomText,
  ResizeModeType,
  SafeScreen,
  Tap,
} from '@/components';
import { Images } from '@/theme/assets/images';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { useAppNavigation } from '@/utils/navigationUtils';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

export const AddBooking = () => {
  /**to get the default theme of app */
  const theme = useTheme();

  /** theme integration in styles */
  const styles = makeStyles(theme);

  /** for tranlations */
  const { t } = useTranslation();

  /** for navigation */
  const navigation = useAppNavigation();

  return (
    <SafeScreen>
      <View>
        <CustomImage
          source={Images.splashLoading}
          style={styles.image}
          resizeMode={ResizeModeType.contain}
        />
        <Tap onPress={() => navigation.navigate('DrawerRoute')}>
          <CustomText>{t('GoToHome')}</CustomText>
        </Tap>
      </View>
    </SafeScreen>
  );
};

const makeStyles = (theme: CustomTheme) =>
  StyleSheet.create({
    image: {
      width: 100,
      height: 100,
      alignSelf: 'center',
      marginTop: 20,
      backgroundColor: theme.colors.primary,
    },
  });
