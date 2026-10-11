import type { ButtonProps as RNButtonProps } from '@rneui/base';
import { Button as RNButton } from '@rneui/themed';
import styles from './styles';

type ButtonProps = {
  disabled: boolean;
  text: string;
  onPress: () => void;
  buttonStyle?: RNButtonProps['buttonStyle'];
  titleStyle?: RNButtonProps['titleStyle'];
  containerStyle?: RNButtonProps['containerStyle'];
};

// A styled button component
// Edit the styles in styles.tsx to change default styles
function Button({
  disabled,
  onPress,
  text,
  buttonStyle,
  titleStyle,
  containerStyle,
}: ButtonProps) {
  return (
    <RNButton
      containerStyle={containerStyle}
      disabledStyle={styles.disabledStyle}
      buttonStyle={[styles.buttonStyle, buttonStyle]}
      disabledTitleStyle={styles.disabledTitleStyle}
      titleStyle={[styles.titleStyle, titleStyle]}
      title={text}
      disabled={disabled}
      onPress={onPress}
    />
  );
}

export default Button;
