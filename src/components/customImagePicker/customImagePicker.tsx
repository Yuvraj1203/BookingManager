import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CameraOptions,
  ImageLibraryOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import { CustomActionSheet } from '../customActionSheet/customActionSheet';

type Props = {
  showPicker: boolean;
  setShowPicker: (value: boolean) => void;
  mediaList: (value: ImagePickerResponse) => void;
  hasFile?: boolean;
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

enum PickerSourceEnum {
  Camera = 'Camera',
  Gallery = 'Gallery',
  File = 'File',
}

const CustomImagePicker = ({ hasFile = false, ...props }: Props) => {
  // const theme = useTheme(); // theme

  // const styles = makeStyles(theme); // access StylesSheet with theme implemented

  const { t } = useTranslation();

  const launchPicker = async (
    source: PickerSourceEnum,
    // onChange: (value: string) => void,
  ) => {
    const result = await (source === PickerSourceEnum.Camera
      ? launchCamera(cameraOptions)
      : launchImageLibrary(
          source === PickerSourceEnum.File ? fileOptions : galleryOptions,
        ));

    if (result.didCancel || result.errorCode) return;

    const uri = result.assets?.[0]?.uri;
    if (uri) props.mediaList(result);
  };

  const getOptions = () => [
    {
      label: t('TakePhoto'),
      onPress: () => launchPicker(PickerSourceEnum.Camera),
    },
    {
      label: t('ChooseFromGallery'),
      onPress: () => launchPicker(PickerSourceEnum.Gallery),
    },
    ...(hasFile
      ? [
          {
            label: t('ChooseFile'),
            onPress: () => launchPicker(PickerSourceEnum.File),
          },
        ]
      : []),
  ];

  return (
    <CustomActionSheet
      showActionSheet={props.showPicker}
      setShowActionSheet={props.setShowPicker}
      options={getOptions()}
    />
  );
};

// const makeStyles = (theme: CustomTheme) =>
//   StyleSheet.create({
//     main: {
//       backgroundColor: theme.colors.transparent,
//     },
//   });

export default memo(CustomImagePicker);
