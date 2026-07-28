import { Images } from '@/theme/assets/images';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { formatCurrency } from '@/utils/utils';
import React, { forwardRef, memo } from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import {
  ImageStyle,
  TextInput as RNTextInput,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { ImageType } from '../customImage/customImage';
import { CustomText, TextVariants } from '../customText/customText';
import CustomTextInput from '../customTextInput/customTextInput';
import { InputVariants } from '../customTextInput/formTextInput';
import { Tap } from '../tap/tap';

type Props<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  infoTooltip?: string;
  style?: StyleProp<ViewStyle>;
  showError?: boolean;
  labelVariant?: TextVariants;
  textSize?: number;
  maxLength?: number;
  prefixTapStyle?: StyleProp<ImageStyle>;
};

const CurrencyFormInputBase = <TFieldValues extends FieldValues>(
  {
    control,
    name,
    label,
    placeholder,
    required,
    infoTooltip,
    style,
    showError = true,
    ...props
  }: Props<TFieldValues>,
  ref: React.ForwardedRef<RNTextInput>,
) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: required ? `${label || 'This field'} is required` : false,
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={[styles.container, style]}>
          {!!label && (
            <View style={styles.labelRow}>
              <CustomText variant={props.labelVariant} style={styles.label}>
                {required && (
                  <CustomText color={theme.colors.error}>* </CustomText>
                )}
                {label}
              </CustomText>
              {!!infoTooltip && (
                <Tap style={styles.infoTap}>
                  <View
                    style={[
                      styles.infoCircle,
                      { borderColor: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    <CustomText
                      variant={TextVariants.labelSmall}
                      color={theme.colors.onSurfaceVariant}
                      style={styles.infoChar}
                    >
                      i
                    </CustomText>
                  </View>
                </Tap>
              )}
            </View>
          )}

          <CustomTextInput
            ref={ref}
            mode={InputVariants.outlined}
            showLabel={false}
            showError={false}
            showErrorIcon={false}
            text={value ?? ''}
            onChangeText={text => {
              const cleaned = text.replace(/[^\d.]/g, '');
              if (props.maxLength && cleaned.length > props.maxLength) {
                return;
              }
              onChange(formatCurrency(text));
            }}
            placeholder={placeholder ?? '0.00'}
            keyboardType="decimal-pad"
            errorMsg={error?.message}
            fillColor={theme.colors.elevation.level0}
            inputStyle={styles.inputOverride}
            contentStyle={styles.content}
            outlineStyle={styles.outline}
            prefixIcon={{
              luicideIcon: <Images.IndianRupee size={15} />,
              type: ImageType.luicide,
            }}
            labelVariant={props.labelVariant}
            textSize={props.textSize}
            prefixTapStyle={props.prefixTapStyle}
          />

          {showError && error?.message && (
            <CustomText
              variant={TextVariants.labelMedium}
              color={theme.colors.error}
              style={styles.error}
            >
              {error?.message}
            </CustomText>
          )}
        </View>
      )}
    />
  );
};

const makeStyles = (theme: CustomTheme) =>
  StyleSheet.create({
    container: {
      marginVertical: 0,
      marginBottom: 20,
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
      gap: 6,
      marginHorizontal: 5,
    },
    label: {
      paddingLeft: 0,
      fontSize: theme.fonts.labelLarge.fontSize,
    },
    infoTap: {
      padding: 2,
    },
    infoCircle: {
      width: 16,
      height: 16,
      borderRadius: 8,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    infoChar: {
      fontSize: theme.fonts.labelSmall.fontSize,
      lineHeight: 13,
    },
    inputOverride: {
      marginTop: 0,
    },
    content: {
      paddingVertical: 0,
      paddingTop: 0,
      paddingLeft: 0,
      fontSize: theme.fonts.labelLarge.fontSize,
    },
    currencyIcon: {
      width: theme.fonts.bodyMedium.fontSize,
      height: theme.fonts.bodyMedium.fontSize,
      bottom: 1.5,
      justifyContent: 'center',
    },
    error: {
      marginTop: 4,
      marginLeft: 12,
      fontSize: 12,
    },
    outline: {
      borderRadius: theme.inputRoundness,
    },
  });

type CurrencyFormInputComponent = <TFieldValues extends FieldValues>(
  props: Props<TFieldValues> & React.RefAttributes<RNTextInput>,
) => React.ReactElement | null;

const CurrencyFormInput = forwardRef(
  CurrencyFormInputBase,
) as CurrencyFormInputComponent;

export default memo(CurrencyFormInput) as CurrencyFormInputComponent;
