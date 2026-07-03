import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { ReactNode } from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type TapProps = PressableProps & {
  containerStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
  shadow?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const Tap = ({
  containerStyle,
  children,
  style,
  shadow = false,
  ...props
}: TapProps) => {
  const scale = useSharedValue(1);

  const theme = useTheme();

  const styles = makeStyle(theme);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withTiming(0.8);
      }}
      onPressOut={() => {
        scale.value = withTiming(1);
      }}
      style={[containerStyle]}
      {...props}
    >
      <Animated.View
        style={[
          animatedStyle,
          styles.roundeness,
          ...(shadow ? [styles.shadowContainer] : []),
          style,
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
};

const makeStyle = (theme: CustomTheme) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    roundeness: {
      borderRadius: theme.roundness,
    },
    shadowContainer: {
      padding: 10,
      shadowColor: theme.colors.outline,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 8, // Android
      borderRadius: theme.roundness,
    },
  });
