import {
  CustomButton,
  CustomMenu,
  CustomText,
  FormTextInput,
  MenuActionWithHandler,
  Shadow,
  TextVariants,
} from '@/components';
import { CustomAlertPopup } from '@/components/custom';
import {
  InputModes,
  InputTextCapitalization,
} from '@/components/customTextInput/formTextInput';
import {
  canScheduleExactAlarms,
  enableNotifications,
  isNotificationsEnabled,
  openExactAlarmSettings,
  rescheduleAllBookingReminders,
} from '@/services/notificationService';
import { useBookingStore, useSettingStore } from '@/store';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { showSnackbar } from '@/utils/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Platform, RefreshControl, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Switch } from 'react-native-paper';
import { SettingConfigSchemaType, settingConfigSchema } from './setting.schema';

type CurrencyOption = { code: string; symbol: string };

const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: 'INR', symbol: '₹' },
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
];

export const SettingScreen = () => {
  /**to get the default theme of app */
  const theme = useTheme();

  /** theme integration in styles */
  const styles = makeStyle(theme);

  /** for tranlations */
  const { t } = useTranslation();

  /** setting store */
  const settingStore = useSettingStore();

  /** Controls loading status for refreshing data. (FYN-4314)*/
  const [loading, setLoading] = useState(false);

  /** open notification popup for notification services on */
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  /** cached OS permission status, refreshed on focus so the toggle can check
   * it synchronously instead of awaiting a native bridge call on every flip */
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  /** open popup asking for exact alarm access so reminders fire on time */
  const [showAlarmPopup, setShowAlarmPopup] = useState(false);

  /** asks for "Alarms & reminders" access if it's missing (Android 12+) */
  const checkExactAlarmAccess = async () => {
    if (!(await canScheduleExactAlarms())) {
      setShowAlarmPopup(true);
    }
  };

  /** turn on notification */
  const turnOnNotification = async () => {
    const granted = await enableNotifications();
    setNotificationsEnabled(granted);
    if (granted) {
      checkExactAlarmAccess();
    }
  };

  /** reminder toggles need notification permission first, then exact alarm access */
  const handleReminderToggle = (
    switchValue: boolean,
    onChange: (value: boolean) => void,
  ) => {
    if (!switchValue) {
      onChange(false);
      return;
    }
    if (!notificationsEnabled) {
      setShowNotificationPopup(true);
      return;
    }
    onChange(true);
    checkExactAlarmAccess();
  };

  /** currency menu actions */
  const currencyMenuActions: MenuActionWithHandler[] = CURRENCY_OPTIONS.map(
    item => ({
      id: item.symbol,
      title: `${item.symbol} (${item.code})`,
    }),
  );

  /** form */
  const { control, handleSubmit, setValue, reset } =
    useForm<SettingConfigSchemaType>({
      defaultValues: {
        businessName: settingStore.businessName,
        businessPhone: settingStore.businessPhone,
        invoicePrefix: settingStore.invoicePrefix,
        currency: settingStore.currency,
        notifyOneDayBefore: settingStore.notifyOneDayBefore,
        notifyTwoHoursBefore: settingStore.notifyTwoHoursBefore,
      },
      resolver: zodResolver(settingConfigSchema),
    });

  const getDefaultValues = (): SettingConfigSchemaType => ({
    businessName: settingStore.businessName,
    businessPhone: settingStore.businessPhone,
    invoicePrefix: settingStore.invoicePrefix,
    currency: settingStore.currency,
    notifyOneDayBefore: settingStore.notifyOneDayBefore,
    notifyTwoHoursBefore: settingStore.notifyTwoHoursBefore,
  });

  /** reset on focus, and refresh cached notification permission status
   * (it may have changed if the user came back from device settings) */
  useFocusEffect(
    useCallback(() => {
      reset(getDefaultValues());
      isNotificationsEnabled().then(setNotificationsEnabled);

      return () => {};
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      reset,
      settingStore.businessName,
      settingStore.businessPhone,
      settingStore.invoicePrefix,
      settingStore.currency,
      settingStore.notifyOneDayBefore,
      settingStore.notifyTwoHoursBefore,
    ]),
  );

  /** save the settings */
  const onSubmit = (data: SettingConfigSchemaType) => {
    settingStore.updateSettings({
      businessName: data.businessName,
      businessPhone: data.businessPhone ?? '',
      invoicePrefix: data.invoicePrefix,
      currency: data.currency,
      notifyOneDayBefore: data.notifyOneDayBefore,
      notifyTwoHoursBefore: data.notifyTwoHoursBefore,
    });

    //apply changed reminder toggles to already-saved bookings
    if (
      data.notifyOneDayBefore !== settingStore.notifyOneDayBefore ||
      data.notifyTwoHoursBefore !== settingStore.notifyTwoHoursBefore
    ) {
      rescheduleAllBookingReminders(useBookingStore.getState().bookings, {
        notifyOneDayBefore: data.notifyOneDayBefore,
        notifyTwoHoursBefore: data.notifyTwoHoursBefore,
      });
    }

    showSnackbar(t('SettingsSaved'), 'success');
  };

  return (
    <View style={styles.main}>
      <ScrollView
        style={styles.mainContainer}
        automaticallyAdjustKeyboardInsets
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              setLoading(true);
              reset();
              setTimeout(() => setLoading(false), 1000);
            }}
          />
        }
      >
        <FormTextInput
          control={control}
          name={'businessName'}
          placeholder={t('BusinessName')}
          label={t('BusinessName')}
          isRequired
          style={styles.field}
        />
        <FormTextInput
          control={control}
          name={'businessPhone'}
          placeholder={t('BusinessPhone')}
          label={t('BusinessPhone')}
          inputMode={InputModes.phone}
          maxLength={10}
          style={styles.field}
          isRequired
        />
        <View style={styles.flexRow}>
          <FormTextInput
            control={control}
            name={'invoicePrefix'}
            placeholder={t('InvoicePrefix')}
            label={t('InvoicePrefix')}
            textCapitalization={InputTextCapitalization.characters}
            isRequired
            style={[styles.field, styles.flex]}
          />
          <CustomMenu
            actions={currencyMenuActions}
            onCommonPress={id => setValue('currency', id)}
            trigger={
              <FormTextInput
                control={control}
                name={'currency'}
                placeholder={t('Currency')}
                label={t('Currency')}
                enabled={false}
                isRequired
                style={[styles.field, styles.flex]}
              />
            }
          />
        </View>

        <Shadow inset style={styles.notificationCard}>
          <CustomText variant={TextVariants.titleMedium}>
            {t('Notifications')}
          </CustomText>

          <View style={[styles.notificationRow, styles.notificationDivider]}>
            <CustomText style={styles.flex}>
              {t('OneDayBeforeBooking')}
            </CustomText>
            <Controller
              control={control}
              name={'notifyOneDayBefore'}
              render={({ field: { onChange, value } }) => (
                <Switch
                  value={value}
                  onValueChange={switchValue =>
                    handleReminderToggle(switchValue, onChange)
                  }
                />
              )}
            />
          </View>

          <View style={styles.notificationRow}>
            <CustomText style={styles.flex}>
              {t('TwoHoursBeforeBooking')}
            </CustomText>
            <Controller
              control={control}
              name={'notifyTwoHoursBefore'}
              render={({ field: { onChange, value } }) => (
                <Switch
                  value={value}
                  onValueChange={switchValue =>
                    handleReminderToggle(switchValue, onChange)
                  }
                />
              )}
            />
          </View>

          <CustomText
            variant={TextVariants.labelMedium}
            color={theme.colors.labelLight}
            style={styles.notificationHelperText}
          >
            {t('RemindersLocalInfo')}
          </CustomText>
        </Shadow>

        <CustomButton
          onPress={handleSubmit(onSubmit)}
          style={styles.saveButton}
          textColor={theme.colors.onPrimary}
        >
          {t('SaveSettings')}
        </CustomButton>

        <CustomText
          variant={TextVariants.labelMedium}
          color={theme.colors.labelLight}
          style={styles.footerText}
        >
          {t('DataStoredLocally')}
        </CustomText>
      </ScrollView>

      <CustomAlertPopup
        title={t('AllowNotification')}
        msg={t('AllowNotificationMsg')}
        shown={showNotificationPopup}
        setShown={setShowNotificationPopup}
        onNegativePress={() => setShowNotificationPopup(false)}
        onPositivePress={() => {
          turnOnNotification();
          setShowNotificationPopup(false);
        }}
        PositiveText={t('Allow')}
        NegativeText={t('Cancel')}
      />

      <CustomAlertPopup
        title={t('AllowAlarmsReminders')}
        msg={t('AllowAlarmsRemindersMsg')}
        shown={showAlarmPopup}
        setShown={setShowAlarmPopup}
        onNegativePress={() => setShowAlarmPopup(false)}
        onPositivePress={() => {
          openExactAlarmSettings();
          setShowAlarmPopup(false);
        }}
        PositiveText={t('Allow')}
        NegativeText={t('Cancel')}
      />
    </View>
  );
};

const makeStyle = (theme: CustomTheme) =>
  StyleSheet.create({
    main: {
      flex: 1,
      paddingTop: Platform.select({ ios: 10, android: 0 }),
    },
    flex: {
      flex: 1,
    },
    mainContainer: {
      flex: 1,
      paddingHorizontal: 10,
      paddingBottom: theme.bottomBarHeight,
    },
    field: {
      marginTop: 5,
    },
    flexRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 15,
    },
    notificationCard: {
      padding: 15,
      marginVertical: 15,
      gap: 10,
      backgroundColor: theme.colors.background,
    },
    notificationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    notificationDivider: {
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    notificationHelperText: {
      marginTop: 5,
    },
    saveButton: {
      marginTop: 20,
    },
    footerText: {
      textAlign: 'center',
      marginTop: 10,
      marginBottom: 20,
    },
  });
