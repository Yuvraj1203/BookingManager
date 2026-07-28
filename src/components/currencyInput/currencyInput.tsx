import { Images } from '@/theme/assets/images';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { formatCurrency } from '@/utils/utils';
import { ImageStyle } from '@d11/react-native-fast-image';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { ImageType } from '../customImage/customImage';
import { CustomText, TextVariants } from '../customText/customText';
import CustomTextInput from '../customTextInput/customTextInput';
import { InputVariants } from '../customTextInput/formTextInput';
import { Tap } from '../tap/tap';

type Props = {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  errorText?: string;
  style?: StyleProp<ViewStyle>;
  required?: boolean;
  infoTooltip?: string;
  maxLength?: number;
  labelVariant?: TextVariants;
  iconStyle?: StyleProp<ImageStyle>;
  textSize?: number;
  prefixTapStyle?: StyleProp<ImageStyle>;
};

function CurrencyInput(props: Props) {
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <View style={[styles.container, props.style]}>
      {!!props.label && (
        <View style={styles.labelRow}>
          <CustomText
            variant={props.labelVariant ?? TextVariants.bodyMedium}
            color={theme.colors.onSurface}
            style={styles.label}
          >
            {props.required && (
              <CustomText color={theme.colors.error}>* </CustomText>
            )}
            {props.label}
          </CustomText>
          {!!props.infoTooltip && (
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
        mode={InputVariants.outlined}
        showLabel={false}
        showError={false}
        showErrorIcon={false}
        text={props.value ?? ''}
        onChangeText={text => props.onChange(formatCurrency(text))}
        placeholder={props.placeholder ?? '0.00'}
        keyboardType="decimal-pad"
        errorMsg={props.errorText}
        fillColor={theme.colors.elevation.level0}
        inputStyle={styles.inputOverride}
        contentStyle={styles.content}
        outlineStyle={styles.outline}
        prefixIcon={{
          luicideIcon: <Images.IndianRupee />,
          type: ImageType.luicide,
          // color: theme.colors.onSurfaceVariant,
          // style: [styles.currencyIcon, props.iconStyle],
        }}
        textSize={props.textSize}
        prefixTapStyle={props.prefixTapStyle}
      />

      {!!props.errorText && (
        <CustomText
          variant={TextVariants.labelMedium}
          color={theme.colors.error}
          style={styles.error}
        >
          {props.errorText}
        </CustomText>
      )}
    </View>
  );
}

const makeStyles = (theme: CustomTheme) =>
  StyleSheet.create({
    container: {
      marginVertical: 8,
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
      gap: 6,
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
      top: 0,
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

export default CurrencyInput;
