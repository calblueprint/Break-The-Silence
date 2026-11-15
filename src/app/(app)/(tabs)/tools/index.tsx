import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Button from '@/components/Button/Button';
import colors from '@/styles/colors';
import { typography } from '@/styles/typography';

export default function Tools() {
  const router = useRouter();

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>
          Tools
        </Text>
      </View>
      <View style={styles.content}>
        <View style={styles.buttonGroup}>
          <Button
            disabled={false}
            text="Resources"
            buttonStyle={styles.button}
            titleStyle={styles.buttonTitle}
            onPress={() => router.navigate('/tools/resources')}
          />
          <Button
            disabled={false}
            text="Guides"
            buttonStyle={styles.button}
            titleStyle={styles.buttonTitle}
            onPress={() => router.navigate('/tools/guides')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  title: {
    ...typography.h2,
    fontSize: 26,
    color: colors.black,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  buttonGroup: {
    width: '100%',
    maxWidth: 360,
    gap: 16,
  },
  button: {
    minHeight: 64,
  },
  buttonTitle: {
    ...typography.p1,
  },
});
