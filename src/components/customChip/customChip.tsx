import React from 'react';
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
  onPress?: () => void;
};

export const CustomChip = ({
  mode = ChipModeEnum.Outlined,
  ...props
}: CustomChipProps) => {
  /**to get the default theme of app */
  //   const theme = useTheme();

  /** theme integration in styles */
  //   const styles = makeStyles(theme);

  /** for tranlations */
  // const { t } = useTranslation();

  /** for navigation */
  // const navigation = useAppNavigation();

  return (
    <Chip icon={props.icon} mode={mode} onPress={props.onPress}>
      {props.label}
    </Chip>
  );
};

// const makeStyles = (theme: CustomTheme) => StyleSheet.create({});
