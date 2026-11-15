import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button, Column, Host } from '@expo/ui';
import { typography } from '@/styles/typography';

export default function Tools() {
  const router = useRouter();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const buttonWidth = Math.round(screenWidth * 0.9);
  const buttonHeight = Math.round(screenHeight * 0.1);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>
          Tools
        </Text>
      </View>
      <View style={styles.content}>
        <Host matchContents>
          <Column spacing={15} alignment="start">
            <Button
              style={{ width: buttonWidth, height: buttonHeight }}
              label="Resources"
              onPress={() => router.navigate('/tools/resources')}
            />
            <Button
              style={{ width: buttonWidth, height: buttonHeight }}
              label="Guides"
              onPress={() => router.navigate('/tools/guides')}
            />
          </Column>
        </Host>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  title: {
    ...typography.h2,
    fontSize: 26,
    color: '#000',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
