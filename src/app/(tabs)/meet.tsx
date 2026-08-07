import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { CardUser, UserProfile } from "@/components/CardUser/CardUser";
import { Header } from "@/components/Header/Header";
import { NotificationDropdown } from "@/components/NotificationDropdown/NotificationDropdown";
import { Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useAppTheme } from "@/providers/AppThemeProvider";
import {
  ApiError,
  enviarSolicitud,
  listDescubrir,
  pasarDescubrir,
} from "@/services/api";
import { avatarSource } from "@/utils/format";

const FONT_SEMIBOLD = "AlbertSans_600SemiBold";
const FONT_REGULAR = "AlbertSans_400Regular";

export default function MeetScreen() {
  const [people, setPeople] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notifVisible, setNotifVisible] = useState(false);
  const { colorScheme } = useAppTheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const loadPeople = useCallback(async () => {
    setLoading(true);
    try {
      const items = await listDescubrir(20);
      setPeople(
        items.map((item) => ({
          id: String(item.id_usuario),
          name: item.name,
          image: avatarSource(item.url_avatar),
        })),
      );
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "No se pudieron cargar personas.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPeople();
  }, [loadPeople]);

  const toggleNotif = () => setNotifVisible((prev) => !prev);
  const closeNotif = () => setNotifVisible(false);

  const current = people[0];

  const goToNextUser = () => {
    setPeople((prev) => prev.slice(1));
  };

  const handleSwipeLeft = async () => {
    if (!current || busy) return;
    setBusy(true);
    const id = Number(current.id);
    goToNextUser();
    try {
      await pasarDescubrir(id);
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "No se pudo pasar.";
      Alert.alert("Error", message);
      void loadPeople();
    } finally {
      setBusy(false);
    }
  };

  const handleSwipeRight = async () => {
    if (!current || busy) return;
    setBusy(true);
    const id = Number(current.id);
    goToNextUser();
    try {
      await enviarSolicitud(id);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "No se pudo enviar la solicitud.";
      Alert.alert("Error", message);
      void loadPeople();
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        logoSource={require("../../../assets/images/logo blue.png")}
        onNotificationPress={toggleNotif}
      />
      <NotificationDropdown visible={notifVisible} onClose={closeNotif} />

      <View style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator color={colors.tint} style={{ marginTop: 40 }} />
        ) : people.length > 0 ? (
          <>
            <View style={styles.heroContainer}>
              <Text style={[styles.heroTitle, { color: colors.text }]}>
                Conoce gente nueva
              </Text>
              <Text
                style={[styles.heroSubtitle, { color: colors.textSecondary }]}
              >
                Descubre personas de forma aleatoria. Desliza o usa los botones
                para enviar una solicitud o pasar al siguiente.
              </Text>
            </View>

            <View style={styles.deckContainer}>
              {people.slice(0, 3).map((user, index) => (
                <CardUser
                  key={user.id}
                  user={user}
                  index={index}
                  isFirst={index === 0}
                  onSwipeLeft={handleSwipeLeft}
                  onSwipeRight={handleSwipeRight}
                />
              ))}
            </View>

            <View style={styles.instructionsContainer}>
              <View
                style={[
                  styles.instructionsCard,
                  isDark && styles.instructionsCardDark,
                ]}
              >
                <TouchableOpacity
                  style={styles.instructionRow}
                  onPress={handleSwipeLeft}
                  activeOpacity={0.7}
                  disabled={busy}
                >
                  <View
                    style={[
                      styles.instructionIconSoft,
                      {
                        backgroundColor: isDark
                          ? "rgba(100, 116, 139, 0.15)"
                          : "rgba(100, 116, 139, 0.1)",
                      },
                    ]}
                  >
                    <FontAwesome
                      name="angle-double-left"
                      size={16}
                      color={colors.tabIconDefault}
                    />
                  </View>
                  <Text
                    style={[
                      styles.instructionText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Pasar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.instructionRow}
                  onPress={handleSwipeRight}
                  activeOpacity={0.7}
                  disabled={busy}
                >
                  <View
                    style={[
                      styles.instructionIconSoft,
                      {
                        backgroundColor: isDark
                          ? "rgba(43, 96, 173, 0.2)"
                          : "rgba(43, 96, 173, 0.12)",
                      },
                    ]}
                  >
                    <FontAwesome
                      name="angle-double-right"
                      size={16}
                      color={colors.tint}
                    />
                  </View>
                  <Text style={[styles.instructionText, { color: colors.tint }]}>
                    Solicitud
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <View
              style={[
                styles.emptyIconWrap,
                {
                  backgroundColor: isDark
                    ? "rgba(59, 130, 246, 0.15)"
                    : "rgba(59, 130, 246, 0.1)",
                },
              ]}
            >
              <FontAwesome
                name="user-plus"
                size={48}
                color={colors.tabIconDefault}
              />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No hay nadie cerca
            </Text>
            <Text
              style={[styles.emptySubtitle, { color: colors.textSecondary }]}
            >
              Vuelve a intentar más tarde para encontrar nuevas personas.
            </Text>
            <TouchableOpacity
              onPress={() => void loadPeople()}
              style={{ marginTop: 16 }}
            >
              <Text style={{ color: colors.tint, fontFamily: FONT_SEMIBOLD }}>
                Recargar
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { flex: 1, paddingHorizontal: 16 },
  heroContainer: { marginTop: 8, marginBottom: 12 },
  heroTitle: { fontSize: 22, fontFamily: FONT_SEMIBOLD },
  heroSubtitle: { fontSize: 14, fontFamily: FONT_REGULAR, marginTop: 4 },
  deckContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyIconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 20, fontFamily: FONT_SEMIBOLD },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: FONT_REGULAR,
    textAlign: "center",
    marginTop: 8,
  },
  instructionsContainer: { paddingBottom: 24 },
  instructionsCard: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderRadius: 16,
    paddingVertical: 12,
  },
  instructionsCardDark: {},
  instructionRow: { alignItems: "center", gap: 6 },
  instructionIconSoft: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  instructionText: { fontSize: 13, fontFamily: FONT_SEMIBOLD },
});
