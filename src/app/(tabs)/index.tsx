import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panas</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.subtitle}>React Native + Expo</Text>
      <Text style={styles.hint}>Estructura base lista para desarrollar.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  hint: {
    marginTop: 12,
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.6,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
