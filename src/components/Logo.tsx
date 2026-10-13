import React from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet } from 'react-native';
import BPLogo from '~/assets/bp-adaptive-icon.png';

type LogoProps = {
  style?: StyleProp<ImageStyle>;
};

export default function Logo({ style }: LogoProps) {
  return <Image source={BPLogo} style={[styles.logo, style]} />;
}

const styles = StyleSheet.create({
  logo: {
    width: 60,
    height: 60,
    marginBottom: 12,
  },
});
