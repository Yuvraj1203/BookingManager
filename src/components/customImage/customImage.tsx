import { Images } from '@/theme/assets/images';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import FastImage, { ImageStyle } from '@d11/react-native-fast-image';
import React, { useState } from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, View } from 'react-native';

export enum ImageType {
  png = 'png',
  svg = 'svg',
}

export enum ResizeModeType {
  cover = 'cover',
  contain = 'contain',
  stretch = 'stretch',
  center = 'center',
}

export type CustomImageProps = {
  source: any; // Accepts require() for local images or a URI for remote images
  errorSource?: any;
  color?: string; // Optional tint color
  fillColor?: string; // Optional tint color
  style?: StyleProp<ImageStyle>; // Unified style prop for both SVG and PNG
  type?: ImageType;
  resizeMode?: ResizeModeType;
};

export function CustomImage({
  errorSource = Images.errorImage,
  ...props
}: CustomImageProps) {
  const theme = useTheme(); // theme

  const styles = makeStyles(theme); // access StylesSheet with theme implemented

  const [hasError, setHasError] = useState(false);

  const [loading, setLoading] = useState(false);

  if (hasError) {
    return (
      <FastImage
        source={errorSource}
        style={[props.style as StyleProp<ImageStyle>]}
        resizeMode={FastImage.resizeMode.contain}
      />
    );
  }

  return (
    <View style={[props.style as StyleProp<ImageStyle>]}>
      <FastImage
        source={props.source}
        style={[props.style as StyleProp<ImageStyle>]}
        tintColor={props.color}
        resizeMode={props.resizeMode && FastImage.resizeMode[props.resizeMode]}
        onError={() => {
          setHasError(true);
        }}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
      />
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
}

const makeStyles = (theme: CustomTheme) =>
  StyleSheet.create({
    loader: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: 'center',
      alignContent: 'center',
      borderRadius: theme.lightRoundness,
    },
  });
