import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

type DividerProps = {
  style?: StyleProp<ViewStyle>;
  width?: number;
};

const Divider = ({ width = 1, ...props }: DividerProps) => {
  /**to get the default theme of app */
  const theme = useTheme();

  /** theme integration in styles */
  const styles = makeStyles(theme);
  return (
    <View
      style={[styles.divider, props.style, { borderTopWidth: width }]}
    ></View>
  );
};

const makeStyles = (theme: CustomTheme) =>
  StyleSheet.create({
    divider: {
      borderTopColor: theme.colors.border,
      borderBottomColor: theme.colors.border,
      borderLeftColor: theme.colors.border,
      borderRightColor: theme.colors.border,
      borderStyle: 'solid',
    },
  });

export default Divider;
