import { StyleSheet } from 'react-native';
import colors from '@/styles/colors';

export const LOGIN_FIELD_WIDTH = 318;

const titleBase = {
  fontFamily: 'Montserrat',
  fontSize: 32,
  fontWeight: 700,
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
  width: '100%',
  height: 1,
  backgroundColor: colors.border,
} as const;

const subtitleBase = {
  fontFamily: 'Montserrat',
  fontSize: 14,
  color: colors.textMuted,
} as const;

const fieldBase = {
  width: '100%',
} as const;

const labelBase = {
  marginBottom: 4,
  fontSize: 14,
  color: colors.text,
} as const;

const inputBase = {
  width: '100%',
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
  width: '100%',
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
  color: 'red',
} as const;

// Shared base for the Confirm/Sign Up style submit buttons rendered
const submitButtonBase = {
  width: '100%',
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
  field: fieldBase,
  label: labelBase,
  input: inputBase,
  inputFocused: inputFocusedBase,
  passwordWrapper: passwordWrapperBase,
  passwordInput: passwordInputBase,
  eyeButton: eyeButtonBase,
  eyeIcon: eyeIconBase,
  error: errorBase,
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
  return { color: filled ? colors.white : colors.text };
}

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingTop: 115,
    paddingBottom: 241,
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
    width: LOGIN_FIELD_WIDTH,
    alignSelf: 'center',
    fontFamily: 'Montserrat',
    fontSize: 32,
    fontWeight: 400,
    marginBottom: 9,
  },
  divider: {
    ...dividerBase,
    width: LOGIN_FIELD_WIDTH,
    alignSelf: 'center',
    marginBottom: 9,
  },
  field: {
    ...fieldBase,
    alignItems: 'center',
  },
  label: {
    ...labelBase,
    width: LOGIN_FIELD_WIDTH,
  },
  input: {
    ...inputBase,
    width: LOGIN_FIELD_WIDTH,
    height: 40,
  },
  inputFocused: {
    ...inputFocusedBase,
    borderColor: colors.primary,
  },
  passwordWrapper: {
    ...passwordWrapperBase,
    width: LOGIN_FIELD_WIDTH,
  },
  eyeButton: {
    ...eyeButtonBase,
    height: 40,
  },
  forgotPasswordRow: {
    width: LOGIN_FIELD_WIDTH,
    alignSelf: 'center',
    alignItems: 'flex-end',
  },
  signUpRow: {
    alignSelf: 'center',
  },
  signUpLink: {
    color: colors.primary,
  },
});

export const forgotPasswordStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'flex-start',
    paddingTop: 70,
    paddingHorizontal: 41,
    gap: 12,
  },
  emailText: {
    fontFamily: 'Montserrat',
    fontSize: 22,
    fontWeight: 700,
    color: colors.primaryDark,
  },
});

export const resetPasswordStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'flex-start',
    paddingTop: 70,
    paddingHorizontal: 41,
    gap: 12,
  },
});

export const signupStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'flex-start',
    paddingTop: 70,
    paddingHorizontal: 24,
    paddingBottom: 48,
    gap: 12,
  },
  subtitle: {
    fontFamily: 'Montserrat',
    fontSize: 17,
    fontWeight: 400,
    color: colors.text,
  },
  securedText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.textMuted,
    fontWeight: 400,
    lineHeight: 17,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
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
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
