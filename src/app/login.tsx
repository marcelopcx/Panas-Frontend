import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AnimatedBackgroundPattern } from "@/components/AnimatedBackgroundPattern";
import { CustomButton } from "@/components/CustomButton/CustomButton";
import { CustomDivider } from "@/components/CustomDivider/CustomDivider";
import { CustomInput } from "@/components/CustomInput/CustomInput";
import { HeaderLogo } from "@/components/HeaderLogo/HeaderLogo";
import { useAppTheme } from "@/providers/AppThemeProvider";
import { useAuth } from "@/providers/AuthProvider";
import Colors from "@/constants/Colors";
import { ApiError } from "@/services/api";

const COLOR_BLUE = "#2B60AD";
const COLOR_TEXT_BLUE = "#2B60AD";
const COLOR_GRAY_TEXT = "#64748B";
const FONT_ALBERT_SANS_REGULAR = "AlbertSans_400Regular";
const FONT_ALBERT_SANS_BOLD = "AlbertSans_700Bold";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const { colorScheme } = useAppTheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      return "El correo es obligatorio.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      return "Ingresa un correo válido.";
    }

    return "";
  };

  const validatePassword = (value: string) => {
    if (!value) {
      return "La contraseña es obligatoria.";
    }

    if (value.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres.";
    }

    return "";
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (emailTouched) {
      setEmailError(validateEmail(value));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    if (passwordTouched) {
      setPasswordError(validatePassword(value));
    }
  };

  const handleLogin = async () => {
    const nextEmailError = validateEmail(email);
    const nextPasswordError = validatePassword(password);

    setEmailTouched(true);
    setPasswordTouched(true);
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);

    if (nextEmailError || nextPasswordError) {
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.replace("/(tabs)/chats");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "No se pudo iniciar sesión. Revisa tu conexión.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? colors.background : COLOR_BLUE }]}>
      <AnimatedBackgroundPattern />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <HeaderLogo />
          </View>

          <View style={[
            styles.formContainer,
            { backgroundColor: colors.surface }
          ]}>
            <CustomInput
              label="Correo"
              placeholder="tucorreo@example.com"
              leftIcon="mail-outline"
              value={email}
              onChangeText={handleEmailChange}
              error={emailTouched ? emailError : ""}
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
            />

            <CustomInput
              label="Contraseña"
              placeholder="********"
              leftIcon="lock-closed-outline"
              isPassword
              value={password}
              onChangeText={handlePasswordChange}
              error={passwordTouched ? passwordError : ""}
              textContentType="password"
            />

            <TouchableOpacity
              onPress={handleForgotPassword}
              activeOpacity={0.7}
              style={styles.forgotPasswordButton}
            ></TouchableOpacity>

            <View style={styles.actionSection}>
              <CustomButton
                title="Iniciar Sesión"
                loadingText="Procesando"
                loading={loading}
                disabled={loading}
                onPress={handleLogin}
              />

              <CustomDivider containerStyle={styles.dividerStyle} />

              <View style={styles.registerContainer}>
                <Text style={[styles.registerPrompt, { color: colors.textSecondary }]}>Sin cuenta? </Text>
                <TouchableOpacity onPress={handleRegister} activeOpacity={0.7}>
                  <Text style={[styles.registerLink, { color: colors.tint }]}>Regístrate</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: "transparent",
    width: "100%",
    alignSelf: "center",
  },
  headerContainer: {
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  logoImage: {
    width: 400,
    height: 400,
  },
  star: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
    opacity: 0.8,
  },
  formContainer: {
    width: "95%",
    alignSelf: "center",
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 24,
  },
  forgotPasswordButton: {
    alignSelf: "center",
    marginTop: 4,
    marginBottom: 28,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: COLOR_TEXT_BLUE,
    fontFamily: FONT_ALBERT_SANS_REGULAR,
  },
  actionSection: {
    marginTop: "auto",
    width: "100%",
  },
  dividerStyle: {
    marginVertical: 24,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  registerPrompt: {
    fontSize: 14,
    fontFamily: FONT_ALBERT_SANS_REGULAR,
  },
  registerLink: {
    fontSize: 14,
    fontFamily: FONT_ALBERT_SANS_BOLD,
    fontWeight: "700",
  },
});
