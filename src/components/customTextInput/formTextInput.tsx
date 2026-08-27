import {
  CustomImage,
  CustomText,
  ImageType,
  ResizeModeType,
  Tap,
  TextVariants,
} from '@/components';
import { Images } from '@/theme/assets/images';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { containsJavaScript, showSnackbar } from '@/utils/utils';
import React, { forwardRef, memo, ReactNode, useMemo, useRef } from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  ImageSourcePropType,
  Keyboard,
  KeyboardTypeOptions,
  TextInput as RNTextInput,
  StyleProp,
  StyleSheet,
  TextInputSubmitEditingEvent,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
// CustomImage uses fast-image's stricter ImageStyle (numeric-only), so the
// optional override here must use the same type to avoid a downstream
// assignment error when forwarded into CustomImage.
import { ImageStyle } from '@d11/react-native-fast-image';
import { ActivityIndicator, TextInput } from 'react-native-paper';
export enum InputVariants {
  flat = 'flat',
  outlined = 'outlined',
}

export enum InputModes {
  phone = 'phone',
  number = 'number',
  name = 'name',
  address = 'address',
  email = 'email',
  password = 'password',
  default = 'default',
  decimal = 'decimal',
  numeric = 'numeric',
}

export enum InputTextCapitalization {
  sentences = 'sentences',
  none = 'none',
  words = 'words',
  characters = 'characters',
}

export enum InputTextAlign {
  left = 'left',
  center = 'center',
  right = 'right',
}

export enum InputReturnKeyType {
  default = 'default',
  go = 'go',
  google = 'google',
  join = 'join',
  next = 'next',
  route = 'route',
  search = 'search',
  send = 'send',
  yahoo = 'yahoo',
  done = 'done',
  emergencyCall = 'emergency-call',
}

export type InputIcon = {
  color?: string;
  source?: ImageSourcePropType;
  type?: ImageType;
  resizeMode?: ResizeModeType;
  tap?: () => void;
  // Optional style override for the icon image. Added so wrappers (e.g.
  // CurrencyInput) can keep their existing icon sizing when delegating to
  // CustomTextInput's prefix/suffix icon slot instead of being forced to
  // CustomTextInput's hardcoded 20×20.
  style?: StyleProp<ImageStyle>;
  luicideIcon?: ReactNode;
};

type Props<TFieldValues extends FieldValues> = {
  ref?: React.Ref<RNTextInput>;
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  text?: string;
  mode?: InputVariants;
  onChangeText?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  borderRadius?: number;
  height?: number;
  fillColor?: string;
  txtColor?: string;
  textSize?: number;
  placeholder?: string;
  enabled?: boolean;
  hideText?: boolean;
  helperTxt?: string;
  extraInfoTxt?: string;
  prefixIcon?: InputIcon;
  suffixIcon?: InputIcon;
  inputMode?: InputModes;
  inputFormatters?: RegExp;
  textAlign?: InputTextAlign;
  textCapitalization?: InputTextCapitalization;
  maxLength?: number;
  maxLines?: number;
  multiLine?: boolean;
  autoCorrect?: boolean;
  spellCheck?: boolean;
  returnKeyType?: InputReturnKeyType;
  loading?: boolean;
  loadingSize?: number;
  onSubmitEditing?: (e: TextInputSubmitEditingEvent) => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<TextStyle>;
  outlineStyle?: StyleProp<ViewStyle>;
  preserveSuffixIconOnError?: boolean;
  showError?: boolean;
  showErrorIcon?: boolean;
  labelVariant?: TextVariants;
  isRequired?: boolean;
  prefixTapStyle?: StyleProp<TextStyle>;
};

const FormTextInputBase = <TFieldValues extends FieldValues>(
  {
    mode = InputVariants.outlined,
    height = 48,
    inputMode = InputModes.default,
    textAlign = InputTextAlign.left,
    textCapitalization = InputTextCapitalization.sentences,
    maxLines = 1,
    multiLine = false,
    enabled = true,
    loading = false,
    showError = true,
    showErrorIcon = true,
    preserveSuffixIconOnError = false,
    labelVariant = TextVariants.bodyMedium,
    ...props
  }: Props<TFieldValues>,
  ref: React.ForwardedRef<RNTextInput>,
) => {
  const theme = useTheme(); // theme
  const styles = makeStyles(theme, props); // access StylesSheet with theme implemented
  const { t } = useTranslation();
  const inputHeight = useRef<number>(height); // Initial height

  // set keyboard type to show to user on specific input mode
  const setKeyboard = useMemo((): KeyboardTypeOptions => {
    const keyTypeMap: Record<string, KeyboardTypeOptions> = {
      phone: 'phone-pad',
      number: 'phone-pad',
      email: 'email-address',
      password: 'default',
      decimal: 'decimal-pad',
      numeric: 'numeric',
    };
    return inputMode ? keyTypeMap[inputMode] || 'default' : 'default';
  }, [inputMode]);

  // validate text when user type according to specific input mode
  const validateInput = (value: string): boolean => {
    if (!inputMode && !props.inputFormatters) return true;

    const regexMap: Record<string, RegExp> = {
      phone: /^[0-9]+$/,
      number: /^[0-9]*\.?[0-9]+$/,
      name: /^[a-zA-Z ]*$/,
      address: /^[0-9a-zA-Z\s-_.,()]*$/,
      email: /^[0-9a-zA-Z@-_.]*$/,
      password: /^[0-9a-zA-Z@-_.$]*$/,
      decimal: /^\d*(\.\d{0,2})?$/,
      numeric: /^\d+$/,
    };

    if (props.inputFormatters) {
      return props.inputFormatters.test(value);
    }

    return (
      (value.length === 0 || !inputMode || regexMap[inputMode]?.test(value)) ??
      true
    );
  };

  // on change text
  const handleFormatter = (
    value: string,
    onChangeText: (value: string) => void,
  ) => {
    // 🚫 BLOCK JAVASCRIPT / SCRIPT CONTENT
    if (containsJavaScript(value)) {
      onChangeText('');
      props.onChangeText?.('');
      Keyboard.dismiss();
      showSnackbar(t('InvalidJSMsg'), 'danger');
      return;
    }
    if (validateInput(value)) {
      onChangeText(value);
      props.onChangeText?.(value);
    }
  };

  return (
    <Controller
      control={props.control}
      name={props.name}
      rules={{
        required: true,
      }}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View style={props.style}>
          {props.label ? (
            <CustomText variant={labelVariant} style={styles.heading}>
              {props.label}
              {props.isRequired && (
                <CustomText
                  variant={labelVariant}
                  color={theme.colors.danger}
                  style={styles.heading}
                >
                  {' *'}
                </CustomText>
              )}
            </CustomText>
          ) : (
            <></>
          )}
          <View pointerEvents={enabled ? 'auto' : 'none'}>
            {props.prefixIcon != null &&
            props.prefixIcon.type === ImageType.luicide ? (
              <View style={[styles.prefixIcon, props.prefixTapStyle]}>
                {props.prefixIcon.luicideIcon}
              </View>
            ) : (
              (props.prefixIcon?.type === ImageType.png ||
                props.prefixIcon?.type === ImageType.svg) && (
                <View style={[styles.prefixIcon, props.prefixTapStyle]}>
                  <Tap style={styles.prefixTap} onPress={props.prefixIcon?.tap}>
                    <CustomImage
                      source={props.prefixIcon?.source}
                      color={
                        props.prefixIcon?.color
                          ? props.prefixIcon.color
                          : undefined
                      }
                      type={props.prefixIcon?.type}
                      resizeMode={props.prefixIcon?.resizeMode}
                      style={[styles.prefixIconImage, props.prefixIcon?.style]}
                    />
                  </Tap>
                </View>
              )
            )}
            <TextInput
              ref={ref}
              mode={mode}
              value={value}
              onChangeText={e => handleFormatter(e, onChange)}
              onBlur={() => {
                onBlur();
                if (props.onBlur) {
                  props.onBlur();
                }
              }}
              onFocus={() => {
                if (props.onFocus) {
                  props.onFocus();
                }
              }}
              editable={enabled}
              placeholder={props.placeholder}
              secureTextEntry={props.hideText}
              keyboardType={setKeyboard}
              returnKeyType={
                props.returnKeyType
                  ? props.returnKeyType
                  : InputReturnKeyType.default
              }
              onSubmitEditing={props.onSubmitEditing}
              textAlign={textAlign}
              textAlignVertical="top"
              autoCapitalize={textCapitalization}
              maxLength={props.maxLength ?? props.maxLength}
              numberOfLines={maxLines}
              multiline={multiLine}
              dense={true}
              autoCorrect={props.autoCorrect}
              spellCheck={props.spellCheck}
              error={error?.message ? true : false}
              style={[
                styles.textInput,
                {
                  minHeight: inputHeight.current,
                  fontSize: props.textSize,
                },
                maxLines
                  ? {
                      maxHeight: maxLines * 50,
                      paddingTop: multiLine ? 1 * 5 : undefined,
                    }
                  : {},
              ]}
              contentStyle={[
                styles.content,
                props.contentStyle,
                error && styles.paddingRight,
              ]}
              outlineStyle={[styles.outlineStyle, props.outlineStyle]}
              theme={{
                colors: { onSurfaceVariant: theme.colors.labelLight },
              }}
              maxFontSizeMultiplier={1}
            />
            {error?.message && showErrorIcon ? (
              <Tap style={styles.suffixIcon}>
                <CustomImage
                  source={Images.error}
                  color={theme.colors.error}
                  type={ImageType.svg}
                  style={styles.suffixIconImage}
                />
              </Tap>
            ) : loading ? (
              <Tap style={styles.loadingIcon}>
                <ActivityIndicator
                  size={props.loadingSize}
                  style={styles.inputLoader}
                />
              </Tap>
            ) : error?.message ? (
              !!error?.message && !preserveSuffixIconOnError ? (
                <Tap style={styles.suffixIcon}>
                  <CustomImage
                    source={Images.error}
                    color={theme.colors.error}
                    type={ImageType.svg}
                    style={styles.suffixIconImage}
                  />
                </Tap>
              ) : !!props.suffixIcon &&
                (!error?.message || !!preserveSuffixIconOnError) ? (
                <Tap onPress={props.suffixIcon?.tap} style={styles.suffixIcon}>
                  <CustomImage
                    source={props.suffixIcon?.source}
                    color={
                      props.suffixIcon?.color
                        ? props.suffixIcon.color
                        : theme.colors.onSurfaceVariant
                    }
                    type={props.suffixIcon?.type}
                    resizeMode={props.suffixIcon?.resizeMode}
                    style={styles.suffixIconImage}
                  />
                </Tap>
              ) : (
                <></>
              )
            ) : !!props.suffixIcon &&
              (!error?.message || !!preserveSuffixIconOnError) ? (
              <Tap onPress={props.suffixIcon?.tap} style={styles.suffixIcon}>
                <CustomImage
                  source={props.suffixIcon?.source}
                  color={
                    props.suffixIcon?.color
                      ? props.suffixIcon.color
                      : theme.colors.onSurfaceVariant
                  }
                  type={props.suffixIcon?.type}
                  resizeMode={props.suffixIcon?.resizeMode}
                  style={styles.suffixIconImage}
                />
              </Tap>
            ) : (
              <></>
            )}
          </View>

          {props.extraInfoTxt && (
            <View style={styles.bottomLayout}>
              <CustomText
                variant={TextVariants.labelMedium}
                color={theme.colors.labelLight}
              >
                {props.extraInfoTxt}
              </CustomText>
            </View>
          )}
          {showError && (
            <View style={styles.bottomLayout}>
              <CustomText
                variant={TextVariants.labelMedium}
                color={
                  error?.message
                    ? theme.colors.error
                    : theme.colors.onSurfaceVariant
                }
              >
                {error?.message
                  ? error?.message
                  : props.helperTxt
                  ? props.helperTxt
                  : ''}
              </CustomText>
            </View>
          )}
        </View>
      )}
    />
  );
};

const makeStyles = <TFieldValues extends FieldValues>(
  theme: CustomTheme,
  props: Props<TFieldValues>,
) =>
  StyleSheet.create({
    heading: {
      paddingLeft: 5,
    },
    textInput: {
      paddingLeft: props.prefixIcon ? 30 : 10,
      paddingRight: props.suffixIcon ? 30 : 10,
      backgroundColor:
        props.fillColor != null
          ? props.fillColor
          : theme.colors.elevation.level0,
      marginTop: 5,
    },
    content: {
      paddingTop: props.prefixIcon || props.suffixIcon ? 0 : 5,
      paddingBottom: props.prefixIcon || props.suffixIcon ? 0 : 5,
      paddingLeft: props.prefixIcon ? 10 : 5,
      paddingRight: props.suffixIcon ? 10 : 5,
    },
    paddingRight: {
      paddingRight: 25,
    },
    outlineStyle: {
      borderRadius: props.borderRadius
        ? props.borderRadius
        : theme.inputRoundness,
      borderColor: theme.colors.surfaceDisabled,
      boxShadow: theme.boxShadow,
    },
    prefixIcon: {
      left: 10,
      position: 'absolute',
      justifyContent: 'center',
      top: '50%',
      transform: [{ translateY: '-50%' }],
      // Paper's TextInput paints its own box after this sibling, so without
      // a higher zIndex it visually covers the icon.
      zIndex: 1,
    },
    prefixTap: {
      marginTop: 3,
    },
    prefixIconImage: {
      height: 20,
      width: 20,
    },
    suffixIcon: {
      right: 10,
      position: 'absolute',
      justifyContent: 'center',
      top: '50%',
      transform: [{ translateY: '-50%' }],
      zIndex: 1,
    },
    loadingIcon: {
      right: 10,
      position: 'absolute',
      justifyContent: 'center',
      top: 20,
    },
    inputLoader: {
      height: 7,
      width: 7,
      marginHorizontal: 10,
    },
    suffixIconImage: {
      height: 20,
      width: 20,
    },
    bottomLayout: {
      marginHorizontal: 12,
      marginTop: 3,
    },
  });

type FormTextInputComponent = <TFieldValues extends FieldValues>(
  props: Props<TFieldValues> & React.RefAttributes<RNTextInput>,
) => React.ReactElement | null;

const FormTextInput = forwardRef(FormTextInputBase) as FormTextInputComponent;

export default memo(FormTextInput) as FormTextInputComponent;
