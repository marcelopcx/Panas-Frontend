import * as ImagePicker from "expo-image-picker";
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
import { useAppTheme } from "@/providers/AppThemeProvider";
import { useAuth } from "@/providers/AuthProvider";
import Colors from "@/constants/Colors";
import { ApiError } from "@/services/api";

const COLOR_BLUE = "#2B60AD";
const COLOR_TEXT_BLUE = "#2B60AD";
const COLOR_GRAY_TEXT = "#64748B";
const FONT_ALBERT_SANS_REGULAR = "AlbertSans_400Regular";
const FONT_ALBERT_SANS_BOLD = "AlbertSans_700Bold";

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const { colorScheme } = useAppTheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullNameTouched, setFullNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const sanitizeFullName = (value: string) => {
    const lettersAndSpacesOnly = value.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
    return lettersAndSpacesOnly.replace(/\s+/g, " ").replace(/^\s+/, "");
  };

  const validateFullName = (value: string) => {
    if (!value.trim()) {
      return "El nombre completo es obligatorio.";
    }

    if (value.trim().length < 3) {
      return "Ingresa un nombre completo válido.";
    }

    return "";
  };

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

  const validateConfirmPassword = (value: string) => {
    if (!value) {
      return "Confirma tu contraseña.";
    }

    if (value !== password) {
      return "Las contraseñas no coinciden.";
    }

    return "";
  };

  const handleFullNameChange = (value: string) => {
    const sanitizedValue = sanitizeFullName(value);
    setFullName(sanitizedValue);

    if (fullNameTouched) {
      setFullNameError(validateFullName(sanitizedValue));
    }
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

    if (confirmPasswordTouched) {
      setConfirmPasswordError(validateConfirmPassword(confirmPassword));
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);

    if (confirmPasswordTouched) {
      setConfirmPasswordError(validateConfirmPassword(value));
    }
  };

  const handleFullNameBlur = () => {
    setFullNameTouched(true);
    setFullNameError(validateFullName(fullName));
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    setEmailError(validateEmail(email));
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
    setPasswordError(validatePassword(password));
  };

  const handleConfirmPasswordBlur = () => {
    setConfirmPasswordTouched(true);
    setConfirmPasswordError(validateConfirmPassword(confirmPassword));
  };

  const handleCreateAccount = async () => {
    const nextFullNameError = validateFullName(fullName);
    const nextEmailError = validateEmail(email);
    const nextPasswordError = validatePassword(password);
    const nextConfirmPasswordError = validateConfirmPassword(confirmPassword);

    setFullNameTouched(true);
    setEmailTouched(true);
    setPasswordTouched(true);
    setConfirmPasswordTouched(true);
    setFullNameError(nextFullNameError);
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setConfirmPasswordError(nextConfirmPasswordError);

    if (
      nextFullNameError ||
      nextEmailError ||
      nextPasswordError ||
      nextConfirmPasswordError
    ) {
      return;
    }

    setLoading(true);
    try {
      await register({
        email,
        password,
        full_name: fullName,
        avatarUri: profileImage,
      });
      router.replace("/(tabs)/chats");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "No se pudo crear la cuenta. Intenta de nuevo.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleProfileImagePress = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!pickerResult.canceled && pickerResult.assets.length > 0) {
      setProfileImage(pickerResult.assets[0].uri);
    }
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
            <CustomInput
              type="image"
              imageUri={profileImage}
              label="Sube una Imagen"
              onImagePress={handleProfileImagePress}
              imageSize={124}
              containerStyle={styles.headerImageInput}
            />
          </View>

          <View style={[styles.formContainer, { backgroundColor: colors.surface }]}>
            <CustomInput
              label="Nombre completo"
              placeholder="Tu nombre completo"
              leftIcon="person-outline"
              value={fullName}
              onChangeText={handleFullNameChange}
              error={fullNameTouched ? fullNameError : ""}
              autoComplete="name"
              textContentType="name"
              allowSpaces
            />

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

            <CustomInput
              label="Confirmar contraseña"
              placeholder="********"
              leftIcon="lock-closed-outline"
              isPassword
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              error={confirmPasswordTouched ? confirmPasswordError : ""}
              textContentType="newPassword"
            />

            <View style={styles.actionSection}>
              <CustomButton
                title="Crear Cuenta"
                loadingText="Creando"
                loading={loading}
                disabled={loading}
                onPress={handleCreateAccount}
              />

              <CustomDivider containerStyle={styles.dividerStyle} />

              <View style={styles.loginContainer}>
                <Text style={[styles.loginPrompt, { color: colors.textSecondary }]}>¿Ya tienes cuenta? </Text>
                <TouchableOpacity onPress={handleLogin} activeOpacity={0.7}>
                  <Text style={[styles.loginLink, { color: colors.tint }]}>Inicia sesión</Text>
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
  formContainer: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 24,
    width: "95%",
    alignSelf: "center",
  },
  headerImageInput: {
    marginBottom: 0,
  },
  actionSection: {
    marginTop: "auto",
    width: "100%",
  },
  dividerStyle: {
    marginVertical: 24,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  loginPrompt: {
    fontSize: 14,
    fontFamily: FONT_ALBERT_SANS_REGULAR,
  },
  loginLink: {
    fontSize: 14,
    fontFamily: FONT_ALBERT_SANS_BOLD,
    fontWeight: "700",
  },
});
