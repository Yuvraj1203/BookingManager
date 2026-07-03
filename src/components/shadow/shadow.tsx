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
    <View style={[props.style, styles.shadowContainer]}>{props.children}</View>
  );
};

const makeStyle = (theme: CustomTheme) =>
  StyleSheet.create({
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
