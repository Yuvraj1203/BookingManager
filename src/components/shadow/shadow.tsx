import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { JSX, ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Tap } from '../tap/tap';

type ShadowProps = {
  children: ReactNode | JSX.Element;
  style?: StyleProp<ViewStyle>;
  inset?: boolean;
  onPress?: () => void;
};
export const Shadow = ({ inset = false, ...props }: ShadowProps) => {
  /**to get the default theme of app */
  const theme = useTheme();

  /** theme integration in styles */
  const styles = makeStyle(theme);

  const Style = [
    {
      ...styles.shadowContainer,
      boxShadow: inset ? theme.insetShadow : theme.boxShadow,
    },
    props.style,
  ];

  if (props.onPress) {
    return (
      <Tap style={Style} onPress={props.onPress}>
        {props.children}
      </Tap>
    );
  }

  return <View style={Style}>{props.children}</View>;
};

const makeStyle = (theme: CustomTheme) =>
  StyleSheet.create({
    shadowContainer: {
      padding: 10,

      borderRadius: theme.roundness,
    },
  });
