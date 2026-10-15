import { StyleSheet } from 'react-native';

export const fontFamilies = {
  montserrat: 'Montserrat',
  montserratBold: 'Montserrat-Bold',
  montserratItalic: 'Montserrat-Italic',
  nunitoSans: 'Nunito Sans',
} as const;

const montserratRegular = {
  fontFamily: fontFamilies.montserrat,
} as const;

const montserratBold = {
  fontFamily: fontFamilies.montserratBold,
} as const;

const nunitoSansRegular = {
  fontFamily: fontFamilies.nunitoSans,
} as const;

export const typography = StyleSheet.create({
  h1: {
    ...montserratBold,
    fontSize: 32,
  },
  h2: {
    ...montserratBold,
    fontSize: 28,
  },
  h3: {
    ...montserratBold,
    fontSize: 24,
  },
  h4: {
    ...montserratBold,
    fontSize: 20,
  },
  p1: {
    ...nunitoSansRegular,
    fontSize: 16,
  },
  p2: {
    ...nunitoSansRegular,
    fontSize: 14,
  },
  p3: {
    ...nunitoSansRegular,
    fontSize: 12,
  },
  displayRegular: {
    ...montserratRegular,
    fontSize: 32,
  },
  authSubtitle: {
    ...montserratRegular,
    fontSize: 17,
  },
  authEmail: {
    ...montserratBold,
    fontSize: 22,
  },
  authSecureNote: {
    fontFamily: fontFamilies.montserratItalic,
    fontSize: 14,
    lineHeight: 17,
  },
  montserratBody: {
    ...montserratRegular,
    fontSize: 14,
  },
  entryLink: {
    ...montserratBold,
    fontSize: 18,
  },
});
