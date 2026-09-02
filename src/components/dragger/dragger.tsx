import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export const Dragger = () => {
  /**to get the default theme of app */
  const theme = useTheme();

  /** theme integration in styles */
  const styles = makeStyles(theme);

  return (
    <View style={styles.dragger}>
      <></>
    </View>
  );
};

const makeStyles = (theme: CustomTheme) =>
  StyleSheet.create({
    dragger: {
      alignSelf: 'center',
      height: 4,
      width: 50,
      backgroundColor: theme.colors.surfaceDisabled,
      borderRadius: theme.extraRoundness,
      marginBottom: 20,
      marginTop: 10,
    },
  });
