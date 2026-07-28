import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import {
  CameraOptions,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import { CustomActionSheet } from '../customActionSheet/customActionSheet';

type Props = {
  showPicker: boolean;
  setShowPicker: (value: boolean) => void;
};

const cameraOptions: CameraOptions = {
  mediaType: 'photo',
  quality: 0.8,
};

const galleryOptions: ImageLibraryOptions = {
  mediaType: 'photo',
  quality: 0.8,
};

const fileOptions: ImageLibraryOptions = {
  mediaType: 'mixed',
  quality: 0.8,
};

type PickerSource = 'camera' | 'gallery' | 'file';

const CustomImagePicker = ({ ...props }: Props) => {
  const theme = useTheme(); // theme

  const styles = makeStyles(theme); // access StylesSheet with theme implemented

  const { t } = useTranslation();

  const launchPicker = async (
    source: PickerSource,
    // onChange: (value: string) => void,
  ) => {
    const result = await (source === 'camera'
      ? launchCamera(cameraOptions)
      : launchImageLibrary(source === 'file' ? fileOptions : galleryOptions));

    if (result.didCancel || result.errorCode) return;

    // const uri = result.assets?.[0]?.uri;
    // if (uri) onChange(uri);
  };

  const getOptions = () => [
    {
      label: t('TakePhoto'),
      onPress: () => launchPicker('camera'),
    },
    {
      label: t('ChooseFromGallery'),
      onPress: () => launchPicker('gallery'),
    },
    {
      label: t('ChooseFile'),
      onPress: () => launchPicker('file'),
    },
  ];

  return (
    <CustomActionSheet
      showActionSheet={props.showPicker}
      setShowActionSheet={props.setShowPicker}
      options={getOptions()}
    />
  );
};

const makeStyles = (theme: CustomTheme) =>
  StyleSheet.create({
    main: {
      backgroundColor: theme.colors.transparent,
    },
  });

export default memo(CustomImagePicker);
