import { CustomText, TextVariants } from '@/components';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { BlurView } from '@react-native-community/blur';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActionSheetIOS,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

type optionsData = {
  label: string;
  onPress?: () => void;
  destructive?: boolean;
};

type CustomActionSheetProps = {
  options?: optionsData[];
  cancel?: boolean;
  cancelLabel?: string;
  onCancelPress?: () => void;
  showActionSheet: boolean;
  setShowActionSheet: (value: boolean) => void;
};

export const CustomActionSheet = ({
  cancel = true,
  cancelLabel = 'Cancel',
  ...props
}: CustomActionSheetProps) => {
  /**to get the default theme of app */
  const theme = useTheme();

  /** theme integration in styles */
  const styles = makeStyles(theme);

  /** for tranlations */
  const { t } = useTranslation();

  /** ios check */
  const isIos = Platform.OS === 'ios';

  /** options data => string[](label) */
  const labelOfOptions = props.options?.map(item => item.label);

  /**find destructive index */
  const destructiveIndex = props.options?.findIndex(item => item.destructive);

  useEffect(() => {
    if (props.showActionSheet && labelOfOptions && isIos) {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: cancel
            ? [...labelOfOptions, cancelLabel]
            : [...labelOfOptions],
          destructiveButtonIndex:
            destructiveIndex && destructiveIndex > -1
              ? destructiveIndex
              : undefined,
          cancelButtonIndex: cancel ? labelOfOptions.length : undefined,
          userInterfaceStyle: theme.dark ? 'dark' : 'light',
        },
        buttonIndex => {
          props.setShowActionSheet(!props.showActionSheet);
          if (cancel && props.onCancelPress) {
            props.onCancelPress();
          } else {
            props.options?.[buttonIndex]?.onPress?.();
          }
        },
      );
    }
  }, [
    props,
    cancel,
    cancelLabel,
    destructiveIndex,
    labelOfOptions,
    props.options,
    isIos,
    theme.dark,
  ]);

  /** close call */
  const handleClose = () => {
    console.log(t('AddReceiptImage'));
    props.setShowActionSheet(!props.showActionSheet);
  };

  if (isIos) {
    return <></>;
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.showActionSheet}
      onRequestClose={() => {
        props.setShowActionSheet(false);
      }}
    >
      <Pressable style={StyleSheet.absoluteFill} onPress={handleClose}>
        <BlurView
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, styles.blurViewBg]}
          blurType={theme.dark ? 'dark' : 'light'}
          blurAmount={10}
        />
      </Pressable>
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          {props.options?.map((item, index) => (
            <Pressable
              key={item.label}
              style={[
                styles.item,
                props.options && index < props.options?.length - 1
                  ? styles.itemBorder
                  : {},
              ]}
              // disabled={options.disabledButtonIndices?.includes(index)}
              onPress={() => {
                item.onPress && item.onPress();
                props.setShowActionSheet(false);
              }}
            >
              <CustomText
                color={
                  index === destructiveIndex
                    ? theme.colors.danger
                    : theme.colors.links
                }
                variant={TextVariants.titleLarge}
              >
                {item.label}
              </CustomText>
            </Pressable>
          ))}
        </View>
        {cancel && (
          <Pressable
            style={[styles.item, styles.mainContainer]}
            // disabled={options.disabledButtonIndices?.includes(index)}
            onPress={() => {
              props.onCancelPress && props.onCancelPress();
              props.setShowActionSheet(false);
            }}
          >
            <CustomText
              color={theme.colors.links}
              variant={TextVariants.bodyLarge}
            >
              {cancelLabel ? cancelLabel : t('Cancel')}
            </CustomText>
          </Pressable>
        )}
      </View>
    </Modal>
  );
};

const makeStyles = (theme: CustomTheme) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 20,
      right: 0,
      left: 0,
    },
    blurViewBg: {
      backgroundColor: theme.colors.surfaceDisabled,
    },
    mainContainer: {
      borderRadius: theme.roundness,
      marginHorizontal: 10,
      marginVertical: 5,
      overflow: 'hidden',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.surfaceDisabled,
    },
    item: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: theme.colors.surface,
    },
    itemBorder: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.surfaceDisabled,
    },
  });
