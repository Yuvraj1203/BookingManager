import { Shadow } from '@/components';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { BlurView } from '@react-native-community/blur';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { bottomTabsData } from '../bottomTabRoute';
import { BottomTabButton } from './bottomTabButton';

const EXTRA_LEFT_SPACE = 5;

const CustomBottomBar = ({ state, navigation }: BottomTabBarProps) => {
  /** to get the default theme of app */
  const theme = useTheme();

  /** theme integration in styles */
  const styles = makeStyle(theme);

  /** width for the screen */
  const { width } = useWindowDimensions();

  const tabWidth = (width - 50) / bottomTabsData.length;

  /** floater animation */
  const leftSlide = useSharedValue(state.index * tabWidth + EXTRA_LEFT_SPACE);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (state.index * tabWidth !== leftSlide.value) {
      leftSlide.value = withTiming(state.index * tabWidth + EXTRA_LEFT_SPACE, {
        duration: 250,
      });
    }
    scale.value = withSequence(
      withTiming(0.7, { duration: 150 }),
      withTiming(1, { duration: 150 }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.index, leftSlide]);

  const animatedStyle = useAnimatedStyle(() => ({
    left: leftSlide.value,
    transform: [
      {
        scale: scale.value,
      },
    ],
  }));

  return (
    <Shadow style={styles.container}>
      <View style={StyleSheet.absoluteFill}>
        {/* rendered first so it stays behind the tabs */}
        <View style={styles.blurClip} pointerEvents="none">
          {Platform.OS === 'ios' ? (
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType={theme.dark ? 'dark' : 'xlight'}
              blurAmount={1}
            />
          ) : (
            // Android BlurView (Dimezis) paints the whole window white/blurred,
            // see margelo/react-native-blur#385 and #595, so use a translucent fill
            <View style={styles.androidGlass} />
          )}
        </View>

        <View style={[StyleSheet.absoluteFill, styles.barContainer]}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;

            const item = bottomTabsData[index];

            const Icon = item.icon;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <BottomTabButton
                key={route.key}
                title={route.name}
                focused={isFocused}
                Icon={Icon}
                onPress={onPress}
              />
            );
          })}
        </View>
        <Animated.View
          style={[
            styles.floater,
            animatedStyle,
            {
              width: tabWidth,
            },
          ]}
        >
          <View style={styles.glassOverlayTab}>
            <></>
          </View>
        </Animated.View>

        {/* <View style={styles.glassOverlay}></View> */}
      </View>
    </Shadow>
  );
};

const makeStyle = (theme: CustomTheme) =>
  StyleSheet.create({
    container: {
      marginBottom: 25,
      marginHorizontal: 20,
      paddingVertical: 10,
      height: 64,
      borderRadius: theme.roundness,
      overflow: 'hidden',
    },
    barContainer: {
      position: 'absolute',
      zIndex: 9,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      left: EXTRA_LEFT_SPACE,
      right: EXTRA_LEFT_SPACE,
      borderRadius: theme.roundness,
    },
    floater: {
      top: 5,
      position: 'absolute',
      bottom: 5,
      overflow: 'hidden',
      borderRadius: theme.roundness,
      zIndex: 1,
    },
    blurClip: {
      ...StyleSheet.absoluteFill,
      borderRadius: theme.roundness,
      overflow: 'hidden',
    },
    androidGlass: {
      ...StyleSheet.absoluteFill,
      backgroundColor: theme.dark
        ? 'rgba(30, 30, 30, 0.92)'
        : 'rgba(255, 255, 255, 0.92)',
    },
    glassOverlay: {
      ...StyleSheet.absoluteFill,
      // Important: translucent, NOT opaque
      backgroundColor: theme.dark
        ? 'rgba(235, 235, 235, 0)'
        : 'rgba(255, 255, 255, 0.51)',
      borderRadius: theme.roundness,
    },
    glassOverlayTab: {
      ...StyleSheet.absoluteFill,
      // Important: translucent, NOT opaque
      backgroundColor: theme.dark
        ? 'rgba(255, 255, 255, 0.23)'
        : 'rgba(170, 170, 170, 0.2)',
      borderRadius: theme.roundness,
    },
  });

export default CustomBottomBar;
