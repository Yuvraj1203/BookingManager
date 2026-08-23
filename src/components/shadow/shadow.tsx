import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { JSX, ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

type ShadowProps = {
  children: ReactNode | JSX.Element;
  style?: StyleProp<ViewStyle>;
  inset?: boolean;
};
export const Shadow = ({ inset = false, ...props }: ShadowProps) => {
  /**to get the default theme of app */
  const theme = useTheme();

  /** theme integration in styles */
  const styles = makeStyle(theme);

  return (
    <View
      style={[
        {
          ...styles.shadowContainer,
          boxShadow: inset ? theme.insetShadow : theme.boxShadow,
        },
        props.style,
      ]}
    >
      {props.children}
    </View>
  );
};

const makeStyle = (theme: CustomTheme) =>
  StyleSheet.create({
    shadowContainer: {
      padding: 10,

      borderRadius: theme.roundness,
    },
  });
