import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { CustomButton } from "@/components/CustomButton/CustomButton";
import { useAppTheme } from "@/providers/AppThemeProvider";
import Colors from "@/constants/Colors";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { colorScheme } = useAppTheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Recuperar contraseña</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Ingresa tu correo y te enviaremos un enlace para restablecer la
        contraseña.
      </Text>

      <View style={styles.backContainer}>
        <CustomButton title="Volver al login" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 32,
    textAlign: "center",
  },
  backContainer: {
    width: "100%",
  },
});
