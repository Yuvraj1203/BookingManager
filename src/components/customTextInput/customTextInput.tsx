import {
  CustomImage,
  CustomText,
  ImageType,
  Tap,
  TextVariants,
} from '@/components';
import { Images } from '@/theme/assets/images';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { containsJavaScript, showSnackbar } from '@/utils/utils';
import React, {
  forwardRef,
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Keyboard,
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  TextInput as RNTextInput,
  StyleProp,
  StyleSheet,
  TextInputSubmitEditingEventData,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { ActivityIndicator, TextInput } from 'react-native-paper';

import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import {
  InputIcon,
  InputModes,
  InputReturnKeyType,
  InputTextAlign,
  InputTextCapitalization,
  InputVariants,
} from './formTextInput';

type Props = {
  ref?: React.Ref<RNTextInput>;
  label?: string;
  text: string;
  mode?: InputVariants;
  onChangeText: (value: string) => void;
  onBlur?: () => boolean;
  onFocus?: () => void;
  errorMsg?: string;
  animate?: boolean;
  borderColor?: string;
  borderRadius?: number;
  height?: number;
  fillColor?: string;
  txtColor?: string;
  textSize?: number;
  placeholder?: string;
  enabled?: boolean;
  hideText?: boolean;
  helperTxt?: string;
  prefixIcon?: InputIcon;
  suffixIcon?: InputIcon;
  inputMode?: InputModes;
  inputFormatters?: RegExp;
  textAlign?: InputTextAlign;
  textCapitalization?: InputTextCapitalization;
  maxLength?: number;
  maxLines?: number;
  multiLine?: boolean;
  onPress?: () => void;
  validator?: z.ZodType<any, any>;
  showLabel?: boolean;
  autoCorrect?: boolean;
  spellCheck?: boolean;
  returnKeyType?: InputReturnKeyType;
  loading?: boolean;
  loadingSize?: number;
  onSubmitEditing?: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<TextStyle>;
  outlineStyle?: StyleProp<ViewStyle>;
  showError?: boolean;
  showErrorIcon?: boolean;
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto' | undefined;
  // Direct override of the keyboard type, bypassing the inputMode→keyboard
  // mapping. Added so wrappers like UqTextInput can pass raw RN
  // KeyboardTypeOptions ("numeric", "email-address", etc.) without forcing
  // every caller to map through the InputModes enum.
  keyboardType?: KeyboardTypeOptions;
  // Extra style merged onto the inner TextInput. Added so wrappers (e.g.
  // UqTextInput) can neutralise the hardcoded textInput.marginTop when
  // managing label spacing themselves.
  inputStyle?: StyleProp<TextStyle>;
  isRequired?: boolean;
  labelVariant?: TextVariants;
  prefixTapStyle?: StyleProp<TextStyle>;
};

type ValidateProps = { value: string; validator?: z.ZodType<any, any> };

// custom hook for single CustomTextInput
export const useValidateCustomTextInput = (props: ValidateProps) => {
  const [errorMsg, setErrorMsg] = useState('');
  const [text, setText] = useState(props.value);
  /** Added by @Akshita 05-02-25 ---> to open in app browser links from comments(FYN-4314)*/

  // hook to set text value in state
  const handleSetText = useCallback((value: string) => {
    setText(value);
    setErrorMsg('');
  }, []);

  // hook for validation
  const Validation = useCallback(() => {
    if (props.validator) {
      const validationResult = props.validator.safeParse(text);
      if (!validationResult.success) {
        setErrorMsg(validationResult.error.message);
        return false;
      }
    }
    setErrorMsg('');
    return true;
  }, [text, props.validator]);

  return { text, setText: handleSetText, Validation, errorMsg };
};

const CustomTextInput = forwardRef<RNTextInput, Props>(
  (
    {
      mode = InputVariants.outlined,
      showLabel = true,
      height = 48,
      inputMode = InputModes.default,
      textAlign = InputTextAlign.left,
      textCapitalization = InputTextCapitalization.sentences,
      maxLines = 1,
      multiLine = false,
      loading = false,
      showError = true,
      showErrorIcon = true,
      isRequired = false,
      labelVariant = TextVariants.bodyMedium,
      enabled = true,
      ...props
    },
    ref,
  ) => {
    const theme = useTheme(); // theme
    const { t } = useTranslation();
    const styles = makeStyles(theme, props); // access StylesSheet with theme implemented
    const inputHeight = useRef<number>(height); // Initial height

    // set keyboard type to show to user on specific input mode. A direct
    // `keyboardType` prop (when provided) takes precedence over the
    // inputMode-derived mapping so wrappers can pass raw RN keyboard types.
    const setKeyboard = useMemo((): KeyboardTypeOptions => {
      if (props.keyboardType) return props.keyboardType;
      const keyTypeMap: Record<string, KeyboardTypeOptions> = {
        phone: 'phone-pad',
        number: 'phone-pad',
        email: 'email-address',
        password: 'default',
      };
      return inputMode ? keyTypeMap[inputMode] || 'default' : 'default';
    }, [inputMode, props.keyboardType]);

    // validate text when user type according to specific input mode
    const validateInput = (value: string): boolean => {
      if (!inputMode && !props.inputFormatters) return true;

      const regexMap: Record<string, RegExp> = {
        phone: /^[0-9]+$/,
        number: /^[0-9]*\.?[0-9]*$/,
        name: /^[a-zA-Z ]*$/,
        address: /^[0-9a-zA-Z\s-_.,()]*$/,
        email: /^[0-9a-zA-Z@-_.]*$/,
        password: /^[0-9a-zA-Z@-_.$]*$/,
      };

      if (props.inputFormatters) {
        return props.inputFormatters.test(value);
      }

      return (
        (value.length === 0 ||
          !inputMode ||
          regexMap[inputMode]?.test(value)) ??
        true
      );
    };

    // on change text
    const handleFormatter = (value: string) => {
      if (containsJavaScript(value)) {
        props.onChangeText('');
        Keyboard.dismiss();
        showSnackbar(t('InvalidJSMsg'), 'danger');
        return;
      }

      if (validateInput(value)) {
        props.onChangeText(value);
      }
    };

    return (
      <View style={props.style}>
        {showLabel && (
          <CustomText variant={labelVariant} style={styles.label}>
            {props.label}
            {isRequired && (
              <CustomText
                variant={labelVariant}
                color={theme.colors.danger}
                style={styles.heading}
              >
                {' *'}
              </CustomText>
            )}
          </CustomText>
        )}

        <View pointerEvents={enabled ? 'auto' : 'none'}>
          {props.prefixIcon != null &&
            props.prefixIcon.type === ImageType.luicide && (
              <View style={[styles.prefixIcon, props.prefixTapStyle]}>
                {props.prefixIcon.luicideIcon}
              </View>
            )}
          <TextInput
            ref={ref}
            mode={mode}
            value={props.text}
            onChangeText={e => handleFormatter(e)}
            onBlur={() => {
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
            error={props.errorMsg ? true : false}
            pointerEvents={props.pointerEvents}
            style={[
              styles.textInput,
              {
                minHeight: inputHeight.current,
                maxHeight: maxLines * 50,
                fontSize: props.textSize,
              },
              props.inputStyle,
            ]}
            contentStyle={[styles.content, props.contentStyle]}
            outlineStyle={[styles.outlineStyle, props.outlineStyle]}
            theme={{ colors: { onSurfaceVariant: theme.colors.labelLight } }}
            maxFontSizeMultiplier={1}
          />

          {props.prefixIcon != null &&
            props.prefixIcon.type !== ImageType.luicide && (
              <Tap
                onPress={props.prefixIcon.tap}
                style={[styles.prefixIcon, props.prefixTapStyle]}
              >
                <CustomImage
                  source={props.prefixIcon.source}
                  color={
                    props.prefixIcon.color
                      ? props.prefixIcon.color
                      : theme.colors.onSurfaceVariant
                  }
                  type={props.prefixIcon.type}
                  resizeMode={props.prefixIcon.resizeMode}
                  style={[styles.prefixIconImage, props.prefixIcon.style]}
                />
              </Tap>
            )}
          {props.errorMsg && showErrorIcon ? (
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
          ) : props.suffixIcon ? (
            <Tap onPress={props.suffixIcon.tap} style={styles.suffixIcon}>
              <CustomImage
                source={props.suffixIcon.source}
                color={
                  props.suffixIcon.color
                    ? props.suffixIcon.color
                    : theme.colors.onSurfaceVariant
                }
                type={props.suffixIcon.type}
                resizeMode={props.suffixIcon.resizeMode}
                style={[styles.suffixIconImage, props.suffixIcon.style]}
              />
            </Tap>
          ) : (
            <></>
          )}
        </View>

        {showError && (
          <View style={styles.bottomLayout}>
            <CustomText
              variant={TextVariants.labelMedium}
              color={
                props.errorMsg
                  ? theme.colors.error
                  : theme.colors.onSurfaceVariant
              }
            >
              {props.errorMsg
                ? props.errorMsg
                : props.helperTxt
                ? props.helperTxt
                : ''}
            </CustomText>
          </View>
        )}
      </View>
    );
  },
);

const makeStyles = (theme: CustomTheme, props: Props) =>
  StyleSheet.create({
    heading: {
      paddingLeft: 5,
    },
    label: {
      marginBottom: 5,
      paddingLeft: 5,
    },
    textInput: {
      paddingLeft: props.prefixIcon ? 30 : 10,
      paddingRight: props.suffixIcon ? 30 : 0,
      backgroundColor: props.fillColor ?? props.fillColor,
    },
    content: {
      paddingTop: props.prefixIcon || props.suffixIcon ? 0 : 5,
      paddingBottom: props.prefixIcon || props.suffixIcon ? 0 : 5,
      paddingLeft: props.prefixIcon ? 10 : 5,
      paddingRight: props.suffixIcon ? 10 : 5,
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
      top: '50%',
      transform: [{ translateY: '-50%' }],
      // Paper's TextInput paints its own box after this sibling, so without
      // a higher zIndex it visually covers the icon.
      zIndex: 1,
    },
    prefixIconImage: {
      height: 20,
      width: 20,
    },
    suffixIcon: {
      right: 10,
      position: 'absolute',
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
      height: 8,
      width: 8,
      marginHorizontal: 10,
    },
    suffixIconImage: {
      height: 18,
      width: 18,
    },
    bottomLayout: {
      marginHorizontal: 12,
      //marginBottom: 3,
      marginTop: 3,
    },
  });

export default memo(CustomTextInput);
