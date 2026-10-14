import { StyleSheet } from 'react-native';
import colors from '@/styles/colors';
import { typography } from '@/styles/typography';

export const LOGIN_FIELD_WIDTH = 318;

const fullWidthBase = {
  width: '100%',
} as const;

const centeredScreenBase = {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
} as const;

const whiteCenteredScreenBase = {
  ...centeredScreenBase,
  backgroundColor: colors.white,
} as const;

const topAlignedAuthScreenBase = {
  flex: 1,
  backgroundColor: colors.white,
  alignItems: 'flex-start',
  paddingTop: 70,
  gap: 12,
} as const;

const authFormContainerBase = {
  ...topAlignedAuthScreenBase,
  paddingHorizontal: 41,
} as const;

const centerContentBase = {
  flex: 1,
  ...fullWidthBase,
  justifyContent: 'center',
  paddingBottom: 80,
} as const;

const centeredTextBase = {
  textAlign: 'center',
} as const;

const titleBase = {
  ...typography.h1,
  color: colors.black,
} as const;

const backButtonBase = {
  width: 40,
  height: 32,
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 12,
} as const;

const backArrowIconBase = {
  width: 21.001,
  height: 13.502,
} as const;

const stepContentBase = {
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 27,
  alignSelf: 'stretch',
} as const;

const dividerBase = {
  ...fullWidthBase,
  height: 1,
  backgroundColor: colors.border,
} as const;

const subtitleBase = {
  ...typography.p2,
  color: colors.text,
} as const;

const labelBase = {
  ...typography.p2,
  marginBottom: 4,
  color: colors.text,
} as const;

const inputBase = {
  ...typography.p2,
  ...fullWidthBase,
  height: 44,
  backgroundColor: colors.inputBackground,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: 'transparent',
  padding: 10,
} as const;

const inputFocusedBase = {
  borderColor: colors.primaryDark,
  backgroundColor: colors.white,
} as const;

const passwordWrapperBase = {
  ...fullWidthBase,
  justifyContent: 'center',
} as const;

const passwordInputBase = {
  paddingRight: 40,
} as const;

const eyeButtonBase = {
  position: 'absolute',
  right: 10,
  height: 44,
  justifyContent: 'center',
} as const;

const eyeIconBase = {
  width: 20,
  height: 20,
} as const;

const errorBase = {
  ...typography.p2,
  color: colors.error,
} as const;

const loginFieldBase = {
  width: LOGIN_FIELD_WIDTH,
} as const;

const centeredLoginFieldBase = {
  ...loginFieldBase,
  alignSelf: 'center',
} as const;

// Shared base for the Confirm/Sign Up style submit buttons rendered
const submitButtonBase = {
  ...fullWidthBase,
  height: 48,
  borderRadius: 10,
  marginTop: 8,
} as const;

// Auth screen
export const shared = StyleSheet.create({
  title: titleBase,
  backButton: backButtonBase,
  backArrowIcon: backArrowIconBase,
  stepContent: stepContentBase,
  divider: dividerBase,
  subtitle: subtitleBase,
  field: fullWidthBase,
  label: labelBase,
  input: inputBase,
  inputFocused: inputFocusedBase,
  passwordWrapper: passwordWrapperBase,
  passwordInput: passwordInputBase,
  eyeButton: eyeButtonBase,
  eyeIcon: eyeIconBase,
  error: errorBase,
  fullWidth: fullWidthBase,
  submitButton: submitButtonBase,
});

//generate styles for the submit button based on whether it is filled or not
export function submitButtonStyle(filled: boolean, extra?: object) {
  return [
    shared.submitButton,
    { backgroundColor: filled ? colors.primary : colors.buttonBackground },
    extra,
  ];
}

export function submitButtonTitleStyle(filled: boolean) {
  return {
    color: filled ? colors.white : colors.text,
    ...typography.p2,
  } as const;
}

export const authLandingStyles = StyleSheet.create({
  container: whiteCenteredScreenBase,
  tagline: {
    ...typography.p2,
    color: colors.text,
  },
  enterApp: {
    ...typography.entryLink,
    padding: 20,
    color: colors.primary,
  },
});

export const callbackStyles = StyleSheet.create({
  container: {
    ...centeredScreenBase,
    padding: 24,
  },
  message: {
    ...typography.p2,
    ...centeredTextBase,
    marginTop: 12,
  },
  error: {
    ...errorBase,
    ...centeredTextBase,
  },
  errorContent: {
    ...fullWidthBase,
    maxWidth: 420,
    alignItems: 'center',
    gap: 16,
  },
  input: {
    ...typography.p2,
    ...fullWidthBase,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  success: {
    ...typography.p2,
    color: colors.success,
    ...centeredTextBase,
  },
  button: fullWidthBase,
});

export const updatePasswordStyles = StyleSheet.create({
  container: {
    ...whiteCenteredScreenBase,
    padding: 24,
    gap: 12,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  message: {
    ...typography.p2,
    color: colors.text,
  },
  input: inputBase,
  linkError: {
    ...errorBase,
    ...centeredTextBase,
    padding: 20,
  },
});

export const loginStyles = StyleSheet.create({
  container: {
    ...centeredScreenBase,
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    gap: 12,
  },
  logo: {
    width: 274,
    height: 81,
    flexShrink: 0,
    alignSelf: 'center',
    marginBottom: 5,
  },
  signInText: {
    ...centeredLoginFieldBase,
    ...typography.displayRegular,
    marginBottom: 9,
  },
  divider: {
    ...dividerBase,
    ...centeredLoginFieldBase,
    marginBottom: 9,
  },
  field: {
    ...fullWidthBase,
    alignItems: 'center',
  },
  label: {
    ...labelBase,
    ...loginFieldBase,
  },
  input: {
    ...inputBase,
    ...loginFieldBase,
    height: 40,
  },
  inputFocused: {
    ...inputFocusedBase,
    borderColor: colors.primary,
  },
  passwordWrapper: {
    ...passwordWrapperBase,
    ...loginFieldBase,
  },
  eyeButton: {
    ...eyeButtonBase,
    height: 40,
  },
  forgotPasswordRow: {
    ...centeredLoginFieldBase,
    alignItems: 'flex-end',
  },
  linkText: {
    ...typography.p2,
    color: colors.text,
  },
  signUpRow: {
    ...typography.p2,
    alignSelf: 'center',
  },
  signUpLink: {
    ...typography.p2,
    color: colors.primary,
  },
  submitButton: loginFieldBase,
});

export const forgotPasswordStyles = StyleSheet.create({
  container: authFormContainerBase,
  centerContent: centerContentBase,
  emailText: {
    ...typography.authEmail,
    color: colors.primaryDark,
  },
});

export const resetPasswordStyles = StyleSheet.create({
  container: authFormContainerBase,
});

export const verifyCodeStyles = StyleSheet.create({
  container: authFormContainerBase,
  centerContent: centerContentBase,
  codeInput: {
    textAlign: 'center',
    letterSpacing: 5,
  },
  failureButton: {
    ...fullWidthBase,
    marginTop: 64,
  },
});

export const signupStyles = StyleSheet.create({
  container: {
    ...topAlignedAuthScreenBase,
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  subtitle: {
    ...typography.authSubtitle,
    color: colors.text,
  },
  securedText: {
    ...typography.authSecureNote,
    color: colors.textMuted,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    ...fullWidthBase,
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  input: {
    ...inputBase,
    height: 40,
  },
  message: {
    ...typography.montserratBody,
    color: colors.textMuted,
    ...centeredTextBase,
  },
});
