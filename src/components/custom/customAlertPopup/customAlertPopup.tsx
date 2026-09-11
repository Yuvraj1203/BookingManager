import {
  CustomImage,
  CustomImageProps,
  CustomText,
  Shadow,
  Tap,
  TextVariants,
} from '@/components';
import { usePopupManagerStore } from '@/store';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { handlePopupDismiss } from '@/utils/utils';
import { BlurView } from '@react-native-community/blur';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { Divider, Portal } from 'react-native-paper';
import LoadingView from '../loadingView/loadingView';

// options for component
type Props = {
  title?: string;
  msg?: string;
  PositiveText?: string;
  NegativeText?: string;
  onPositivePress?: () => void;
  onNegativePress?: () => void;
  shown: boolean;
  compact?: boolean;
  dismissOnBackPress?: boolean;
  loading?: boolean;
  setShown: (value: boolean) => void;
  statusIcon?: CustomImageProps;
  style?: StyleProp<ViewStyle>;
  popupId?: string;
};

function CustomAlertPopup({ dismissOnBackPress = true, ...props }: Props) {
  const theme = useTheme(); // theme
  const styles = makeStyles(theme); // access StylesSheet with theme implemented
  const { t } = useTranslation(); //translation

  const registerPopup = usePopupManagerStore(state => state.registerPopup);
  const unregisterPopup = usePopupManagerStore(state => state.unregisterPopup);

  const popupId = props.popupId || 'custom-popup';

  const dimiss = () => {
    props.setShown(false);
    unregisterPopup(popupId);
  };

  useEffect(() => {
    if (props.shown) {
      registerPopup(popupId, dimiss);
      return () => {
        unregisterPopup(popupId);
      };
    } else {
      unregisterPopup(popupId);
    }
  }, [props.shown, popupId, registerPopup, unregisterPopup]);

  /** added by @YUvraj 10-10-2025 --> dismiss the popup when security minimize popup shows */
  handlePopupDismiss(props.shown, dimiss);

  const renderPopup = () => {
    return (
      <Tap
        onPress={() => {
          if (dismissOnBackPress) {
            dimiss();
          }
        }}
        containerStyle={styles.container}
        style={styles.content}
        isAnimate={false}
      >
        <>
          {Platform.OS === 'android' && (
            <BlurView
              style={[StyleSheet.absoluteFill]}
              blurType={theme.dark ? 'dark' : 'light'}
              blurAmount={1}
            />
          )}
          <Shadow
            style={[
              props.compact ? styles.cardCompact : styles.card,
              props.style,
            ]}
          >
            <View>
              {props.statusIcon && (
                <CustomImage
                  source={props.statusIcon?.source}
                  type={props.statusIcon?.type}
                  color={props.statusIcon?.color}
                  resizeMode={props.statusIcon?.resizeMode}
                  style={
                    props.statusIcon.style
                      ? props.statusIcon.style
                      : styles.statusIcon
                  }
                />
              )}

              <CustomText
                variant={TextVariants.bodyLarge}
                style={styles.heading}
              >
                {props.title ? props.title : t('Message')}
              </CustomText>
              <View style={styles.cardContent}>
                <CustomText style={styles.body}>{props.msg}</CustomText>
                <Divider
                  style={props.compact ? styles.dividerCompact : styles.divider}
                />
              </View>
              <View style={styles.cardActions}>
                {props.onNegativePress ? (
                  <View style={styles.actionLayout}>
                    <Tap
                      onPress={props.onNegativePress}
                      containerStyle={styles.flex}
                      style={styles.negativeBtn}
                    >
                      <CustomText
                        variant={TextVariants.bodyMedium}
                        color={theme.colors.tertiary}
                        style={styles.negativeBtnTxt}
                      >
                        {props.NegativeText ? props.NegativeText : t('No')}
                      </CustomText>
                    </Tap>
                    <View style={styles.actionDivider} />

                    <Tap
                      onPress={() => {
                        if (props.onPositivePress && !props.loading) {
                          props.onPositivePress();
                        }
                      }}
                      style={styles.positiveBtn}
                      containerStyle={styles.flex}
                    >
                      <View style={{ flex: 1 }}>
                        <CustomText
                          variant={TextVariants.bodyMedium}
                          color={theme.colors.tertiary}
                          style={styles.positiveBtnTxt}
                        >
                          {props.PositiveText ? props.PositiveText : t('Yes')}
                        </CustomText>
                        {props.loading && <LoadingView />}
                      </View>
                    </Tap>
                  </View>
                ) : (
                  <Tap
                    onPress={() => {
                      if (props.onPositivePress && !props.loading) {
                        props.onPositivePress();
                      }
                    }}
                    style={styles.positiveSingleBtn}
                  >
                    <View>
                      <CustomText
                        variant={TextVariants.bodyMedium}
                        color={theme.colors.tertiary}
                        style={styles.positiveBtnTxt}
                      >
                        {props.PositiveText ? props.PositiveText : t('Done')}
                      </CustomText>
                      {props.loading && <LoadingView />}
                    </View>
                  </Tap>
                )}
              </View>
            </View>
          </Shadow>
        </>
      </Tap>
    );
  };

  return (
    <Portal>
      {Platform.OS === 'ios' ? (
        <Modal
          visible={props.shown}
          transparent={true}
          onRequestClose={() => {
            if (dismissOnBackPress) {
              dimiss();
            }
          }}
          animationType={'slide'}
        >
          {renderPopup()}
        </Modal>
      ) : (
        // Android: rendered without RN's <Modal> — its native Dialog window
        // doesn't reliably span the full Activity content (it was leaving
        // the bottom tab bar and nav bar visible below this popup instead
        // of dimming/covering them). <Portal> alone teleports this content
        // to the app root (under PaperProvider, above the navigators) as
        // plain absolutely-positioned views in the SAME view hierarchy as
        // the tab bar, so it reliably covers the whole screen. See the same
        // fix already applied in customBottomPopup.tsx.
        props.shown && renderPopup()
      )}
    </Portal>
  );
}

const makeStyles = (theme: CustomTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    flex: {
      flex: 1,
    },
    card: {
      borderRadius: theme.roundness,
      marginHorizontal: 50,
      padding: 5,
      position: 'absolute',
      alignSelf: 'center',
      zIndex: 10,
      backgroundColor: theme.colors.surface,
    },
    cardCompact: {
      borderRadius: theme.roundness,
      marginHorizontal: 70,
      padding: 5,
      position: 'absolute',
      alignSelf: 'center',
      zIndex: 10,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.surface,
    },
    cardContent: {
      paddingHorizontal: 10,
    },
    cardActions: {
      flex: 1,
    },
    statusIcon: { height: 50, width: 50, alignSelf: 'center' },
    heading: {
      alignSelf: 'center',
      marginTop: 5,
      textAlign: 'center',
    },
    body: {
      alignSelf: 'center',
      marginTop: 10,
      textAlign: 'center',
    },
    divider: {
      marginTop: 32,
    },
    dividerCompact: {
      marginTop: 22,
    },
    actionLayout: {
      flex: 1,
      flexDirection: 'row',
    },
    negativeBtn: {
      flex: 1,
      alignItems: 'center',
      borderBottomLeftRadius: theme.roundness,
    },
    negativeBtnTxt: {
      paddingVertical: 5,
      paddingHorizontal: 5,
    },
    actionDivider: {
      width: 0.54,
      marginVertical: 8,
      borderRadius: theme.roundness,
      backgroundColor: theme.colors.outlineVariant,
    },
    positiveBtn: {
      flex: 1,
      alignItems: 'center',
      borderBottomRightRadius: theme.roundness,
    },
    positiveSingleBtn: {
      flex: 1,
      marginLeft: 0,
      alignItems: 'center',
      borderBottomLeftRadius: theme.roundness,
      borderBottomRightRadius: theme.roundness,
    },
    positiveBtnTxt: {
      paddingVertical: 5,
      paddingHorizontal: 5,
    },
  });

export default CustomAlertPopup;
