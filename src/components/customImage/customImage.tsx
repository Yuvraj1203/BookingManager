import FastImage, { ImageStyle } from '@d11/react-native-fast-image';
// @ts-ignore - untyped RN internal; used to detect local .svg assets
import { getAssetByID } from '@react-native/assets-registry/registry';
import React, { memo, useState } from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, View } from 'react-native';
import { SvgProps, SvgUri } from 'react-native-svg';
import { LocalSvg } from 'react-native-svg/css';

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
  color?: string; // Optional tint color
  fillColor?: string; // Optional tint color
  style?: StyleProp<ImageStyle> | SvgProps; // Unified style prop for both SVG and PNG
  type?: ImageType;
  resizeMode?: ResizeModeType;
};

// Helper function to determine if the source is a URI
const isUri = (source: any): source is { uri: string } =>
  typeof source === 'object' && source !== null && 'uri' in source;

// Local require('x.svg') assets are detected from Metro's asset registry,
// so callers don't have to pass `type={ImageType.svg}`. Without this they
// fall through to FastImage, which can't decode SVGs (release builds on
// newer Android fail with onError).
const isLocalSvgAsset = (source: any): boolean => {
  if (typeof source !== 'number') {
    return false;
  }
  try {
    return getAssetByID(source)?.type === 'svg';
  } catch {
    return false;
  }
};

function CustomImageBase({ type = ImageType.png, ...props }: CustomImageProps) {
  const styles = makeStyles(); // access StylesSheet with theme implemented

  const [loading, setLoading] = useState(false);

  const isSvg = type === ImageType.svg || isLocalSvgAsset(props.source);

  //checking if the image is remote or local
  const isRemote = isUri(props.source);

  if (isSvg) {
    // SVG dimensions come from width/height PROPS, not a `style` object —
    // and callers (or wrappers like CustomTextInput) frequently pass an
    // ARRAY of styles. Spreading an array directly would yield numeric
    // keys ({0:…, 1:…}) instead of width/height, so the size silently
    // never applied. Flatten to a single plain object first so width /
    // height (and any other props) reach the SVG correctly.
    const svgStyle = (StyleSheet.flatten(
      props.style as StyleProp<ImageStyle>,
    ) ?? {}) as SvgProps;

    const colorProps = props.fillColor
      ? { color: props.color, fill: props.fillColor }
      : { color: props.color };

    if (isRemote) {
      // Handle remote SVG using SvgUri
      return (
        <SvgUri uri={props.source.uri} {...svgStyle} {...colorProps} />
      );
    }

    // Handle local SVG file
    return <LocalSvg asset={props.source} {...svgStyle} {...colorProps} />;
  }

  return (
    <View style={[props.style as StyleProp<ImageStyle>]}>
      <FastImage
        source={props.source}
        style={[props.style as StyleProp<ImageStyle>]}
        tintColor={props.color}
        resizeMode={props.resizeMode && FastImage.resizeMode[props.resizeMode]}
        onLoadStart={() => isRemote && setLoading(true)}
        onLoadEnd={() => isRemote && setLoading(false)}
      />
      {isRemote && loading && (
        <View style={styles.loader}>
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    loader: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: 'center',
      alignContent: 'center',
    },
  });

export const CustomImage = memo(CustomImageBase);

export default CustomImage;
