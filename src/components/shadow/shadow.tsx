import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { JSX, ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

type ShadowProps = {
  children: ReactNode | JSX.Element;
  style?: StyleProp<ViewStyle>;
};
export const Shadow = (props: ShadowProps) => {
  /**to get the default theme of app */
  const theme = useTheme();

  /** theme integration in styles */
  const styles = makeStyle(theme);

  return (
    <View style={[styles.shadowContainer, props.style]}>{props.children}</View>
  );
};

const makeStyle = (theme: CustomTheme) =>
  StyleSheet.create({
    shadowContainer: {
      padding: 10,
      boxShadow: theme.boxShadow,
      borderRadius: theme.roundness,
    },
  });
