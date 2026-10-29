import { StyleSheet } from 'react-native';
import colors from './colors';

export default StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    alignItems: 'stretch',
    padding: '5%',
  },
  'search-group': {
    width: '100%',
    marginTop: 18,
    marginBottom: 10,
  },
  'search-bar': {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 22,
    borderRadius: 28,
    backgroundColor: colors.inputBackground,
    borderColor: colors.inputBackground,
  },
  'search-bar-with-results': {
    borderBottomColor: colors.border,
    borderWidth: 1,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 1,
  },
  'linked-text': {
    color: colors.primary,
    fontSize: 16,
  },
  'indented-text': {
    marginLeft: '5%',
  },
  'recommended-boxes-container': {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  'recommended-boxes': {
    width: 150,
    aspectRatio: 1,
    backgroundColor: colors.buttonBackground,
  },
  'assessment-box': {
    backgroundColor: colors.buttonBackground,
    width: '100%',
    height: 180,
  },
  'header-2': {
    fontSize: 22,
    fontWeight: 600,
  },
  'results-with-items': {
    maxHeight: 204,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 10,
    fontSize: 18,
    color: colors.text,
  },
  'no-results': {
    paddingHorizontal: 18,
    paddingVertical: 20,
    color: colors.textMuted,
  },
});
