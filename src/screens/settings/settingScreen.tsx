import { CustomText, SafeScreen } from '@/components';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { useAppNavigation } from '@/utils/navigationUtils';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { SettingConfigSchemaType } from './setting.schema';

export const SettingScreen = () => {
  /**to get the default theme of app */
  const theme = useTheme();

  /** theme integration in styles */
  const styles = makeStyle(theme);

  /** for tranlations */
  const { t } = useTranslation();

  /** for navigation */
  const navigation = useAppNavigation();

  /** form */
  const {} = useForm<SettingConfigSchemaType>({
    defaultValues: {},
  });

  return (
    <SafeScreen>
      <CustomText>{'Settings'}</CustomText>
    </SafeScreen>
  );
};

const makeStyle = (theme: CustomTheme) =>
  StyleSheet.create({
    main: {
      flex: 1,
    },
  });
