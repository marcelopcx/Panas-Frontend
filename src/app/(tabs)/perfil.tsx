import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, TouchableOpacity, View } from "react-native";

import { CustomInput } from "@/components/CustomInput/CustomInput";
import { DynamicFormModal } from "@/components/DynamicFormModal/DynamicFormModal";
import { OptionItem } from "@/components/OptionItem/OptionItem";
import { Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useAppTheme } from "@/providers/AppThemeProvider";
import { useAuth } from "@/providers/AuthProvider";
import { ApiError } from "@/services/api";
import {
  avatarSource,
  PRIVACY_API_TO_UI,
  PRIVACY_UI_TO_API,
} from "@/utils/format";

const FONT_SEMIBOLD = "AlbertSans_600SemiBold";

type ProfileModalKey =
  | "name"
  | "photo"
  | "theme"
  | "privacy"
  | "activity"
  | "account"
  | null;

type ThemePreference = "Claro" | "Oscuro";
type PrivacyPreference = "Público" | "Privado" | "Solo amigos";
type PhotoSource = "Galería" | "Cámara";

const sanitizeProfileName = (value: string) => {
  return value
    .replace(/[^A-Za-zÀ-ÿ\s]/g, "")
    .replace(/\s+/g, " ")
    .trimStart();
};

export default function PerfilScreen() {
  const router = useRouter();
  const { colorScheme, setColorScheme } = useAppTheme();
  const {
    profile,
    logout,
    updateProfile,
    uploadProfileAvatar,
    deleteAccount,
    refreshProfile,
  } = useAuth();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const [name, setName] = useState(profile?.name ?? "");
  const [draftName, setDraftName] = useState(name);
  const [themePreference, setThemePreference] = useState<ThemePreference>(
    isDark ? "Oscuro" : "Claro",
  );
  const [draftThemePreference, setDraftThemePreference] =
    useState<ThemePreference>(isDark ? "Oscuro" : "Claro");
  const [privacyPreference, setPrivacyPreference] =
    useState<PrivacyPreference>(
      (profile?.privacidad && PRIVACY_API_TO_UI[profile.privacidad]) ||
        "Público",
    );
  const [draftPrivacyPreference, setDraftPrivacyPreference] =
    useState<PrivacyPreference>(privacyPreference);
  const [photoPreference, setPhotoPreference] =
    useState<PhotoSource>("Galería");
  const [draftPhotoPreference, setDraftPhotoPreference] =
    useState<PhotoSource>("Galería");
  const [photoUri, setPhotoUri] = useState<string | null>(
    profile?.url_avatar ?? null,
  );
  const [draftPhotoUri, setDraftPhotoUri] = useState<string | null>(photoUri);
  const [draftAccountName, setDraftAccountName] = useState("");
  const [activeModal, setActiveModal] = useState<ProfileModalKey>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

  useEffect(() => {
    if (!profile) return;
    setName(profile.name);
    setPhotoUri(profile.url_avatar ?? null);
    setPrivacyPreference(
      PRIVACY_API_TO_UI[profile.privacidad] ?? "Público",
    );
  }, [profile]);

  const openModal = (modal: Exclude<ProfileModalKey, null>) => {
    setActiveModal(modal);
    setDraftName(name);
    setDraftThemePreference(themePreference);
    setDraftPrivacyPreference(privacyPreference);
    setDraftPhotoPreference(photoPreference);
    setDraftPhotoUri(photoUri);
    setDraftAccountName("");
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleOpenPhotoPicker = async () => {
    try {
      const launchOptions: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      };

      const permissionResult =
        draftPhotoPreference === "Cámara"
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permiso requerido",
          draftPhotoPreference === "Cámara"
            ? "Necesitamos acceso a la cámara para tomar la foto."
            : "Necesitamos acceso a la galería para seleccionar una imagen.",
        );
        return;
      }

      const pickerResult =
        draftPhotoPreference === "Cámara"
          ? await ImagePicker.launchCameraAsync(launchOptions)
          : await ImagePicker.launchImageLibraryAsync(launchOptions);

      if (pickerResult.canceled || pickerResult.assets.length === 0) {
        return;
      }

      setDraftPhotoUri(pickerResult.assets[0].uri);
    } catch {
      Alert.alert(
        "No se pudo abrir el selector",
        "Intenta de nuevo en unos segundos.",
      );
    }
  };

  const modalConfig = (() => {
    switch (activeModal) {
      case "name":
        return {
          title: "Editar nombre",
          buttonTitle: "Guardar cambios",
          content: (
            <View style={styles.modalSection}>
              <Text
                style={[
                  styles.modalDescription,
                  { color: colors.textSecondary },
                ]}
              >
                Actualiza el nombre que ven los demás en tu perfil.
              </Text>
              <CustomInput
                label="Nombre"
                value={draftName}
                onChangeText={(value) =>
                  setDraftName(sanitizeProfileName(value))
                }
                leftIcon="person-outline"
                allowSpaces
                maxLength={40}
                containerStyle={styles.modalInput}
              />
            </View>
          ),
          onConfirm: async () => {
            const nextName = sanitizeProfileName(draftName).trim();
            if (nextName.length === 0) {
              closeModal();
              return;
            }
            setSaving(true);
            try {
              await updateProfile({ full_name: nextName });
              setName(nextName);
              closeModal();
            } catch (error) {
              const message =
                error instanceof ApiError
                  ? error.message
                  : "No se pudo actualizar el nombre.";
              Alert.alert("Error", message);
            } finally {
              setSaving(false);
            }
          },
        };

      case "photo":
        return {
          title: "Foto de perfil",
          buttonTitle: "Guardar selección",
          content: (
            <View style={styles.modalSection}>
              <Text
                style={[
                  styles.modalDescription,
                  { color: colors.textSecondary },
                ]}
              >
                Usa el control de imagen para previsualizar el cambio y luego
                elige desde dónde quieres tomar la foto.
              </Text>

              <CustomInput
                type="image"
                label="Foto de perfil"
                imageUri={draftPhotoUri}
                onImagePress={handleOpenPhotoPicker}
                imageSize={132}
                containerStyle={styles.imageInput}
              />

              <View style={styles.choiceList}>
                {(["Galería", "Cámara"] as const).map((option) => {
                  const isSelected = draftPhotoPreference === option;

                  return (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.choiceButton,
                        isSelected && styles.choiceButtonSelected,
                        isDark && styles.choiceButtonDark,
                        isSelected && isDark && styles.choiceButtonSelectedDark,
                      ]}
                      onPress={() => setDraftPhotoPreference(option)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.choiceButtonText,
                          isSelected && styles.choiceButtonTextSelected,
                          isDark && styles.choiceButtonTextDark,
                          isSelected &&
                            isDark &&
                            styles.choiceButtonTextSelectedDark,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ),
          onConfirm: async () => {
            setSaving(true);
            try {
              if (draftPhotoUri && draftPhotoUri !== profile?.url_avatar) {
                const updated = await uploadProfileAvatar(draftPhotoUri);
                setPhotoUri(updated.url_avatar ?? draftPhotoUri);
              } else {
                setPhotoUri(draftPhotoUri);
              }
              setPhotoPreference(draftPhotoPreference);
              closeModal();
            } catch (error) {
              const message =
                error instanceof ApiError
                  ? error.message
                  : "No se pudo actualizar la foto.";
              Alert.alert("Error", message);
            } finally {
              setSaving(false);
            }
          },
        };

      case "theme":
        return {
          title: "Tema",
          buttonTitle: "Guardar tema",
          content: (
            <View style={styles.modalSection}>
              <Text
                style={[
                  styles.modalDescription,
                  { color: colors.textSecondary },
                ]}
              >
                Selecciona el tema que quieres usar en la app.
              </Text>

              <View style={styles.choiceList}>
                {(["Claro", "Oscuro"] as const).map((option) => {
                  const isSelected = draftThemePreference === option;

                  return (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.choiceButton,
                        isSelected && styles.choiceButtonSelected,
                        isDark && styles.choiceButtonDark,
                        isSelected && isDark && styles.choiceButtonSelectedDark,
                      ]}
                      onPress={() => setDraftThemePreference(option)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.choiceButtonText,
                          isSelected && styles.choiceButtonTextSelected,
                          isDark && styles.choiceButtonTextDark,
                          isSelected &&
                            isDark &&
                            styles.choiceButtonTextSelectedDark,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ),
          onConfirm: () => {
            const nextScheme =
              draftThemePreference === "Oscuro" ? "dark" : "light";
            setColorScheme(nextScheme);
            setThemePreference(draftThemePreference);
            closeModal();
          },
        };

      case "privacy":
        return {
          title: "Privacidad",
          buttonTitle: "Guardar privacidad",
          content: (
            <View style={styles.modalSection}>
              <Text
                style={[
                  styles.modalDescription,
                  { color: colors.textSecondary },
                ]}
              >
                Define quién puede ver tu información principal.
              </Text>

              <View style={styles.choiceList}>
                {(["Público", "Privado", "Solo amigos"] as const).map(
                  (option) => {
                    const isSelected = draftPrivacyPreference === option;

                    return (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.choiceButton,
                          isSelected && styles.choiceButtonSelected,
                          isDark && styles.choiceButtonDark,
                          isSelected &&
                            isDark &&
                            styles.choiceButtonSelectedDark,
                        ]}
                        onPress={() => setDraftPrivacyPreference(option)}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.choiceButtonText,
                            isSelected && styles.choiceButtonTextSelected,
                            isDark && styles.choiceButtonTextDark,
                            isSelected &&
                              isDark &&
                              styles.choiceButtonTextSelectedDark,
                          ]}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    );
                  },
                )}
              </View>
            </View>
          ),
          onConfirm: async () => {
            setSaving(true);
            try {
              await updateProfile({
                privacidad: PRIVACY_UI_TO_API[draftPrivacyPreference],
              });
              setPrivacyPreference(draftPrivacyPreference);
              closeModal();
            } catch (error) {
              const message =
                error instanceof ApiError
                  ? error.message
                  : "No se pudo guardar la privacidad.";
              Alert.alert("Error", message);
            } finally {
              setSaving(false);
            }
          },
        };

      case "activity":
        return {
          title: "Cerrar sesión",
          buttonTitle: "Aceptar",
          content: (
            <View style={styles.modalSection}>
              <Text
                style={[
                  styles.modalDescription,
                  { color: colors.textSecondary },
                ]}
              >
                ¿Quieres cerrar sesión en esta cuenta?
              </Text>
              <View style={[styles.infoCard, isDark && styles.infoCardDark]}>
                <Text
                  style={[styles.infoCardText, { color: colors.textSecondary }]}
                >
                  Se cerrará tu sesión en este dispositivo.
                </Text>
              </View>
            </View>
          ),
          onConfirm: async () => {
            await logout();
            closeModal();
            router.replace("/login");
          },
        };

      case "account":
        return {
          title: "Cuenta",
          buttonTitle: "Eliminar cuenta",
          content: (
            <View style={styles.modalSection}>
              <Text
                style={[
                  styles.modalDescription,
                  { color: colors.textSecondary },
                ]}
              >
                Escribe tu nombre exacto para habilitar la eliminación de tu
                cuenta.
              </Text>

              <View
                style={[
                  styles.infoCard,
                  styles.dangerCard,
                  isDark && styles.dangerCardDark,
                ]}
              >
                <Text
                  style={[
                    styles.infoCardTitle,
                    styles.dangerTitle,
                    { color: colors.text },
                  ]}
                >
                  Esta acción es irreversible.
                </Text>
                <Text
                  style={[styles.infoCardText, { color: colors.textSecondary }]}
                >
                  Debes confirmar tu identidad antes de continuar.
                </Text>
              </View>

              <CustomInput
                label="Tu nombre"
                value={draftAccountName}
                onChangeText={setDraftAccountName}
                leftIcon="person-outline"
                allowSpaces
                maxLength={40}
                containerStyle={styles.modalInput}
              />
            </View>
          ),
          onConfirm: async () => {
            if (draftAccountName.trim() !== name.trim()) return;
            setSaving(true);
            try {
              await deleteAccount();
              closeModal();
              router.replace("/login");
            } catch (error) {
              const message =
                error instanceof ApiError
                  ? error.message
                  : "No se pudo eliminar la cuenta.";
              Alert.alert("Error", message);
            } finally {
              setSaving(false);
            }
          },
          disabled: draftAccountName.trim() !== name.trim() || saving,
        };

      default:
        return null;
    }
  })();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.patternBackground}>
        <Image
          source={
            isDark
              ? require("../../../assets/images/background_dark.png")
              : require("../../../assets/images/background white.png")
          }
          style={styles.patternImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.profileHeader}>
        <View
          style={[styles.avatarContainer, { backgroundColor: colors.surface }]}
        >
          <Image
            source={avatarSource(photoUri)}
            style={styles.avatarImage}
          />
        </View>
        <Text style={[styles.profileName, { color: colors.text }]}>{name}</Text>
      </View>

      <View style={[styles.optionsContainer, { backgroundColor: colors.background }]}>
        <OptionItem
          iconName="person"
          title="Nombre"
          subtitle={name}
          onPress={() => openModal("name")}
        />
        <OptionItem
          iconName="camera"
          title="Foto de Perfil"
          subtitle={photoPreference}
          onPress={() => openModal("photo")}
        />
        <OptionItem
          iconName="contrast"
          title="Tema"
          subtitle={themePreference}
          onPress={() => openModal("theme")}
        />
        <OptionItem
          iconName="lock-closed"
          title="Privacidad"
          subtitle={privacyPreference}
          onPress={() => openModal("privacy")}
        />
        <OptionItem
          iconName="log-out"
          title="Actividad"
          subtitle="Cerrar Sesión"
          onPress={() => openModal("activity")}
        />
        <OptionItem
          iconName="trash"
          title="Cuenta"
          subtitle="Eliminar Cuenta"
          onPress={() => openModal("account")}
        />
      </View>

      {modalConfig ? (
        <DynamicFormModal
          visible={activeModal !== null}
          onClose={closeModal}
          title={modalConfig.title}
          buttonTitle={modalConfig.buttonTitle}
          onConfirm={modalConfig.onConfirm}
          loading={saving}
          disabled={Boolean(modalConfig.disabled) || saving}
        >
          {modalConfig.content}
        </DynamicFormModal>
      ) : null}

      <View style={styles.logoContainer}>
        <Image
          source={
            isDark
              ? require("../../../assets/images/logo white.png")
              : require("../../../assets/images/logo blue.png")
          }
          style={styles.bottomLogo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  patternBackground: {
    height: 160,
    width: "100%",
  },
  patternImage: {
    width: "100%",
    height: "100%",
    opacity: 0.5,
  },
  profileHeader: {
    alignItems: "center",
    marginTop: -60,
    marginBottom: 4,
  },
  avatarContainer: {
    width: 104,
    height: 104,
    borderRadius: 52,
    padding: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarPlaceholder: {
    flex: 1,
    borderRadius: 52,
  },
  avatarImage: {
    flex: 1,
    borderRadius: 52,
  },
  profileName: {
    fontSize: 20,
    fontFamily: FONT_SEMIBOLD,
    marginTop: 6,
    fontWeight: "600",
  },
  optionsContainer: {
    flex: 1,
    paddingHorizontal: 8,
    justifyContent: "flex-start",
    gap: 0,
  },
  modalSection: {
    gap: 16,
  },
  modalDescription: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "AlbertSans_400Regular",
  },
  modalInput: {
    marginTop: 0,
    marginBottom: 0,
  },
  imageInput: {
    marginTop: 4,
    marginBottom: 0,
  },
  choiceList: {
    gap: 10,
  },
  choiceButton: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
  },
  choiceButtonSelected: {
    borderColor: "#2B60AD",
    backgroundColor: "#EFF6FF",
  },
  choiceButtonDark: {
    backgroundColor: "#1E293B",
    borderColor: "#334155",
  },
  choiceButtonSelectedDark: {
    borderColor: "#7FB2FF",
    backgroundColor: "#1E293B",
  },
  choiceButtonText: {
    fontSize: 14,
    color: "#0F172A",
    fontFamily: "AlbertSans_600SemiBold",
    fontWeight: "600",
  },
  choiceButtonTextSelected: {
    color: "#2B60AD",
  },
  choiceButtonTextDark: {
    color: "#F8FAFC",
  },
  choiceButtonTextSelectedDark: {
    color: "#7FB2FF",
  },
  infoCard: {
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 6,
  },
  infoCardDark: {
    backgroundColor: "#1E293B",
    borderColor: "#334155",
  },
  dangerCard: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  dangerCardDark: {
    backgroundColor: "rgba(185, 28, 28, 0.15)",
    borderColor: "rgba(185, 28, 28, 0.3)",
  },
  infoCardTitle: {
    fontSize: 15,
    fontFamily: FONT_SEMIBOLD,
    fontWeight: "600",
  },
  dangerTitle: {
    color: "#B91C1C",
  },
  infoCardText: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "AlbertSans_400Regular",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingTop: 10,
    paddingBottom: 20,
  },
  bottomLogo: {
    width: "100%",
    height: 60,
  },
});
