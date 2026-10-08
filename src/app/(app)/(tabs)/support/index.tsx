import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Column, Host } from '@expo/ui';

export default function Support() {
  const router = useRouter();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const buttonWidth = Math.round(screenWidth * 0.9);
  const buttonHeight = Math.round(screenHeight * 0.1);

  return (
    <View style={styles.container}>
      <View>
        <Host matchContents>
          {/* <Column verticalArrangement={{ spacedBy: 15 }} horizontalAlignment="center"> */}
          <Column spacing={15} alignment="start">
            <Button
              style={{ width: buttonWidth, height: buttonHeight }}
              label="Guides"
              onPress={() => router.navigate('/support/guides')}
            />
            <Button
              style={{ width: buttonWidth, height: buttonHeight }}
              label="Resources"
              onPress={() => router.navigate('/support/resources')}
            />
            <Button
              style={{ width: buttonWidth, height: buttonHeight }}
              label="Support Line"
              onPress={() => router.navigate('/support/support-line')}
            />
          </Column>
        </Host>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: '5%',
  },
});
