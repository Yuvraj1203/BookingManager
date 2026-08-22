import { Tap } from '@/components';
import { usePopupManagerStore } from '@/store';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { handlePopupDismiss } from '@/utils/utils';
import { ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ColorValue,
  Modal,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { Portal } from 'react-native-paper';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';

enum PopupPositionEnum {
  Top = 'Top',
  Bottom = 'Bottom',
}

type Props = {
  children: ReactNode;
  shown: boolean;
  setShown: (value: boolean) => void;
  dismissOnBackPress?: boolean;
  style?: StyleProp<ViewStyle>;
  popupId?: string;
  inset?: number;
  position?: PopupPositionEnum;
  bottomMargin?: number;
  topMargin?: number;
  layerBg?: ColorValue;
  noLayer?: boolean;
};

function CustomPopup({
  dismissOnBackPress = true,
  inset = 0,
  position = PopupPositionEnum.Bottom,
  ...props
}: Props) {
  const theme = useTheme(); // theme

  const safeAreaInsets = useSafeAreaInsets();

  const styles = makeStyles(theme, safeAreaInsets); // access StylesSheet with theme implemented

  const { t } = useTranslation(); //translation

  const registerPopup = usePopupManagerStore(state => state.registerPopup);
  const unregisterPopup = usePopupManagerStore(state => state.unregisterPopup);

  const popupId = props.popupId || 'custom-common-popup';

  // Register popup when shown, unregister when hidden
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

  // dismiss bottom card
  const dimiss = () => {
    props.setShown(false);
    unregisterPopup(popupId);
  };

  /** added by @Yuvraj 10-10-2025 --> dismiss the popup when security minimize popup shows */
  handlePopupDismiss(props.shown, dimiss);

  // Extracted so it can render either directly under <Portal> (Android) or
  // nested inside <Modal> (iOS) — see the return statement below for why.
  const renderPopupContent = () => (
    <>
      {!props.noLayer && (
        <Animated.View
          entering={FadeIn.springify()}
          exiting={FadeOut.duration(50)}
          style={{
            ...styles.background,
            backgroundColor: props.layerBg
              ? props.layerBg
              : theme.colors.popupBg,
          }}
        >
          <Tap
            style={StyleSheet.absoluteFill}
            onPress={() => dismissOnBackPress && dimiss()}
          >
            <View></View>
          </Tap>
        </Animated.View>
      )}
      <Animated.View
        entering={SlideInDown.springify()}
        exiting={SlideOutDown.duration(100)}
        style={[
          styles.container,
          {
            left: inset,
            right: inset,
            ...(position == PopupPositionEnum.Bottom
              ? { bottom: props.bottomMargin ?? inset }
              : { top: props.topMargin ?? inset }),
          },
          props.style,
        ]}
      >
        {props.children}
      </Animated.View>
    </>
  );

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
        >
          {renderPopupContent()}
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
        props.shown && renderPopupContent()
      )}
    </Portal>
  );
}

const makeStyles = (theme: CustomTheme, safeAreaInsets: EdgeInsets) =>
  StyleSheet.create({
    background: {
      flex: 1,
      position: 'absolute',
      height: '100%',
      width: '100%',
      zIndex: 1,
    },
    main: {
      flex: 1,
    },
    container: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.surface,
      zIndex: 10,
    },
    slideInHelperContainer: {
      position: 'absolute',
      width: '100%',
      height: 60,
      bottom: 0,
      backgroundColor: theme.colors.surface,
      zIndex: 1,
    },
    titleActionItem: {
      // marginHorizontal: 15,
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      backgroundColor: theme.colors.surface,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    tapActionItem: {
      padding: 0,
    },
    actionsItem: {
      flexDirection: 'row',
      paddingVertical: 10,
      paddingHorizontal: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cancelActionsItemLay: {
      // paddingHorizontal: 15, paddingVertical: 4
    },
    cancelDivider: {
      width: '95%',
      backgroundColor: theme.colors.onSurface,
      alignSelf: 'center',
    },
    cancelTapActionItem: {
      backgroundColor: theme.colors.surface,
      // paddingVertical: 4,
      paddingHorizontal: 10,
      // borderRadius: theme.roundness,
    },
    cancelActionsItem: {
      backgroundColor: theme.colors.surface,
      // borderRadius: theme.roundness,
      flexDirection: 'row',
      paddingVertical: 10,
      paddingHorizontal: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      marginHorizontal: 17,
    },
    closeIcon: { height: 25, width: 25 },
    loadingContainer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      borderRadius: 32,
      backgroundColor: theme.colors.gradientColorLevel2,
    },
  });

export default CustomPopup;
