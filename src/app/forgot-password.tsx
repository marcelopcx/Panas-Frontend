import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { CustomButton } from "@/components/CustomButton/CustomButton";

export default function ForgotPasswordScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar contraseña</Text>
      <Text style={styles.subtitle}>
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
    backgroundColor: "#FFFFFF",
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
    color: "#64748B",
    marginBottom: 32,
    textAlign: "center",
  },
  backContainer: {
    width: "100%",
  },
});
