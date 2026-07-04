import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { hideKeyboard } from '@/utils/utils';
import { ReactElement, useMemo } from 'react';
import {
  GestureResponderEvent,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Button } from 'react-native-paper';
import {
  CustomImage,
  ImageType,
  ResizeModeType,
} from '../customImage/customImage';

export type ButtonIconsProps = { size: number; color: string };

export enum ButtonVariants {
  text = 'text',
  outlined = 'outlined',
  contained = 'contained',
  elevated = 'elevated',
  containedTonal = 'contained-tonal',
}

export enum Direction {
  left = 'left',
  right = 'right',
}

export type ButtonIcon = {
  color?: string;
  source?: ImageSourcePropType;
  type?: ImageType;
  resizeMode?: ResizeModeType;
  direction?: Direction;
  style?: StyleProp<ViewStyle>;
};

// options for component
type Props = {
  children: React.ReactNode;
  mode?: ButtonVariants;
  color?: string;
  textColor?: string;
  loading?: boolean;
  icon?: ButtonIcon;
  iconElement?: ({ size, color }: ButtonIconsProps) => ReactElement;
  onPress?: (e: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
};

export function CustomButton(props: Props) {
  const theme = useTheme(); //theme

  const styles = makeStyles(theme, props.icon?.direction); // access StylesSheet with theme implemented

  const { icon, iconElement } = props;

  // handle on press event on button
  const handlePress = (e: GestureResponderEvent) => {
    // hide keyboard if keyboard is visible
    hideKeyboard();

    if (props.loading) return; // Prevent press if already loading
    if (props.disabled) return; // Prevent press if disabled

    // call the onPressButton function
    if (props.onPress) {
      props.onPress(e);
    }
  };
  const textColor = () => {
    return props.textColor
      ? props.textColor
      : props.mode
      ? props.mode === ButtonVariants.outlined
        ? theme.colors.onSurfaceVariant
        : theme.colors.surface
      : theme.colors.surface;
  };

  const memoizedIcon = useMemo(() => {
    if (!icon && !iconElement) {
      return undefined;
    }

    if (typeof iconElement === 'function') {
      // icon is <Images.Wallet />
      return ({ size, color }: ButtonIconsProps) => (
        <View>{iconElement && iconElement({ size, color })}</View>
      );
    }

    return ({ size, color }: ButtonIconsProps) => (
      <View style={[{ height: size, width: size }, icon?.style]}>
        <CustomImage
          source={icon?.source}
          type={icon?.type}
          style={{ height: size, width: size }}
          color={icon?.color ?? color}
        />
      </View>
    );
  }, [icon, iconElement]);

  return (
    <Button
      mode={props.mode ? props.mode : ButtonVariants.contained}
      onPress={handlePress}
      labelStyle={props.textStyle}
      textColor={textColor()}
      buttonColor={props.color}
      loading={props.loading}
      disabled={props.disabled}
      style={[styles.button, props.style]}
      contentStyle={[props.contentStyle, styles.content]}
      maxFontSizeMultiplier={1}
      icon={memoizedIcon}
    >
      {props.children}
    </Button>
  );
}

const makeStyles = (theme: CustomTheme, direction?: Direction) =>
  StyleSheet.create({
    button: {
      borderRadius: theme.roundness,
    },
    content: {
      flexDirection: direction === Direction.right ? 'row-reverse' : 'row',
    },
  });
export default CustomButton;
