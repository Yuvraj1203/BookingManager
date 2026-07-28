import { useAppLanguageStore } from '@/store';
import { useTheme } from '@/theme/themeProvider/paperTheme';
import i18n from '@/translations';
import { ReturnScreenDataProvider } from '@/utils/navigationUtils';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import RootNavigator from './route';

const ApplicationNavigator = () => {
  const appTheme = useTheme();
  const styles = makeStyle();

  /* Language Selection (https://react.i18next.com/) START */
  const appLanguage = useAppLanguageStore(state => state.appLanguage); // get language stored in local storage

  useEffect(() => {
    i18n.changeLanguage(appLanguage); // language change on store value change.
  }, [appLanguage]);

  /* Language Selection END */

  return (
    <GestureHandlerRootView style={styles.main}>
      <I18nextProvider i18n={i18n}>
        <ReturnScreenDataProvider>
          <PaperProvider theme={appTheme}>
            <NavigationContainer theme={appTheme}>
              <RootNavigator />
            </NavigationContainer>
          </PaperProvider>
        </ReturnScreenDataProvider>
      </I18nextProvider>
    </GestureHandlerRootView>
  );
};

const makeStyle = () =>
  StyleSheet.create({
    main: {
      flex: 1,
    },
  });

export default ApplicationNavigator;
