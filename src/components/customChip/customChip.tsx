import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Chip } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

export enum ChipModeEnum {
  Flat = 'flat',
  Outlined = 'outlined',
}

type CustomChipProps = {
  label?: string;
  mode?: ChipModeEnum;
  icon?: IconSource;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

export const CustomChip = ({
  mode = ChipModeEnum.Outlined,
  selected = false,
  ...props
}: CustomChipProps) => {
  /**to get the default theme of app */
  const theme = useTheme();

  /** theme integration in styles */
  const styles = makeStyles(theme);

  return (
    <Chip
      icon={props.icon}
      mode={selected ? ChipModeEnum.Flat : mode}
      selected={selected}
      showSelectedCheck={false}
      onPress={props.onPress}
      style={[styles.chip, selected && styles.selected, props.style]}
      textStyle={selected && styles.selectedText}
    >
      {props.label}
    </Chip>
  );
};

const makeStyles = (theme: CustomTheme) =>
  StyleSheet.create({
    // Paper's Surface (used internally by Chip) can end up stretching to
    // fill the row on iOS when it isn't told to shrink to its own content.
    chip: {
      alignSelf: 'flex-start',
    },
    selected: {
      backgroundColor: theme.colors.primary,
    },
    selectedText: {
      color: theme.colors.onPrimary,
    },
  });
