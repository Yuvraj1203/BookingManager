import {
  CustomButton,
  CustomMenu,
  CustomText,
  FormTextInput,
  MenuActionWithHandler,
  Shadow,
  TextVariants,
} from '@/components';
import {
  InputModes,
  InputTextCapitalization,
} from '@/components/customTextInput/formTextInput';
import { useSettingStore } from '@/store';
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

  /** reset on focus */
  useFocusEffect(
    useCallback(() => {
      reset(getDefaultValues());

      return () => {};
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
                <Switch value={value} onValueChange={onChange} />
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
                <Switch value={value} onValueChange={onChange} />
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
