import React from 'react';
import { Image, StyleSheet } from 'react-native';
import BPLogo from '~/assets/bp-adaptive-icon.png';

export default function Logo() {
  return <Image source={BPLogo} style={styles.logo} />;
}

const styles = StyleSheet.create({
  logo: {
    width: 60,
    height: 60,
    marginBottom: 12,
  },
});
