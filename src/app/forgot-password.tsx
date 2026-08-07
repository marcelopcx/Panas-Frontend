import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import { CustomButton } from "@/components/CustomButton/CustomButton";
import { CustomInput } from "@/components/CustomInput/CustomInput";
import Colors from "@/constants/Colors";
import { useAppTheme } from "@/providers/AppThemeProvider";
import { ApiError, forgotPassword } from "@/services/api";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { colorScheme } = useAppTheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Ingresa tu correo.");
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email.trim());
      Alert.alert(
        "Listo",
        "Si el correo existe, recibirás instrucciones para restablecer la contraseña.",
        [{ text: "OK", onPress: () => router.back() }],
      );
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "No se pudo procesar la solicitud.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Recuperar contraseña
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Ingresa tu correo y te enviaremos un enlace para restablecer la
        contraseña.
      </Text>

      <View style={styles.form}>
        <CustomInput
          label="Correo"
          placeholder="tucorreo@example.com"
          leftIcon="mail-outline"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
        />
        <CustomButton
          title={loading ? "Enviando..." : "Enviar"}
          onPress={handleSubmit}
          disabled={loading}
        />
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
    marginBottom: 24,
    textAlign: "center",
  },
  form: {
    width: "100%",
    gap: 12,
  },
});
