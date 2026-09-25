import {
  isNotificationsEnabled,
  rescheduleAllBookingReminders,
  setupNotifications,
} from '@/services/notificationService';
import {
  useAppLanguageStore,
  useBookingStore,
  useSettingStore,
} from '@/store';
import { useTheme } from '@/theme/themeProvider/paperTheme';
import i18n from '@/translations';
import { ReturnScreenDataProvider } from '@/utils/navigationUtils';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { AppState, StyleSheet } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import RootNavigator from './route';

/** re-schedules every booking's reminders so dropped or inexact triggers get fixed */
const resyncReminders = () => {
  const { notifyOneDayBefore, notifyTwoHoursBefore } =
    useSettingStore.getState();
  rescheduleAllBookingReminders(useBookingStore.getState().bookings, {
    notifyOneDayBefore,
    notifyTwoHoursBefore,
  });
};

const ApplicationNavigator = () => {
  const appTheme = useTheme();
  const styles = makeStyle();

  /* Language Selection (https://react.i18next.com/) START */
  const appLanguage = useAppLanguageStore(state => state.appLanguage); // get language stored in local storage

  useEffect(() => {
    i18n.changeLanguage(appLanguage); // language change on store value change.
  }, [appLanguage]);

  /* Language Selection END */

  /** setup for triggering notification- START */
  useEffect(() => {
    const applyNotificationDefaults = async () => {
      await setupNotifications();
      const enabled = await isNotificationsEnabled();
      useSettingStore.getState().initNotificationDefaults(enabled);
      resyncReminders();
    };

    // wait for persisted settings to load first, so we don't clobber an
    // already-initialized user preference with the one-time default
    if (useSettingStore.persist.hasHydrated()) {
      applyNotificationDefaults();
      return;
    }

    const unsubscribe = useSettingStore.persist.onFinishHydration(() => {
      applyNotificationDefaults();
    });

    return unsubscribe;
  }, []);

  // coming back to the app (e.g. from the "Alarms & reminders" settings screen)
  // may have changed permissions - re-sync so reminders switch to exact timing
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active' && useSettingStore.persist.hasHydrated()) {
        resyncReminders();
      }
    });

    return () => subscription.remove();
  }, []);
  /** setup for triggering notification- END */

  return (
    <GestureHandlerRootView style={styles.main}>
      <I18nextProvider i18n={i18n}>
        <ReturnScreenDataProvider>
          <PaperProvider theme={appTheme}>
            <NavigationContainer theme={appTheme}>
              <RootNavigator />
              <FlashMessage position="bottom" style={{ marginBottom: 64 }} />
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
