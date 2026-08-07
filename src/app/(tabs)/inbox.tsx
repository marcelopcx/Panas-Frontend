import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";

import { FriendNotificationItem } from "@/components/FriendNotificationItem/FriendNotificationItem";
import { Header } from "@/components/Header/Header";
import { NotificationDropdown } from "@/components/NotificationDropdown/NotificationDropdown";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useAppTheme } from "@/providers/AppThemeProvider";
import {
  ApiError,
  aceptarSolicitud,
  listPendientes,
  rechazarSolicitud,
} from "@/services/api";
import type { SolicitudPendiente } from "@/types/api";
import { avatarSource } from "@/utils/format";

const FONT_SEMIBOLD = "AlbertSans_600SemiBold";
const FONT_REGULAR = "AlbertSans_400Regular";

export default function InboxScreen() {
  const [requests, setRequests] = useState<SolicitudPendiente[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifVisible, setNotifVisible] = useState(false);
  const { colorScheme } = useAppTheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const items = await listPendientes();
      setRequests(items);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "No se pudieron cargar las solicitudes.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadRequests();
    }, [loadRequests]),
  );

  const toggleNotif = () => setNotifVisible((prev) => !prev);
  const closeNotif = () => setNotifVisible(false);

  const handleAccept = async (id: number) => {
    try {
      await aceptarSolicitud(id);
      setRequests((prev) => prev.filter((r) => r.id_solicitud !== id));
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "No se pudo aceptar la solicitud.";
      Alert.alert("Error", message);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rechazarSolicitud(id);
      setRequests((prev) => prev.filter((r) => r.id_solicitud !== id));
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "No se pudo rechazar la solicitud.";
      Alert.alert("Error", message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        logoSource={require("../../../assets/images/logo blue.png")}
        onNotificationPress={toggleNotif}
      />
      <NotificationDropdown visible={notifVisible} onClose={closeNotif} />

      <Text style={[styles.title, { color: colors.text }]}>Bandeja</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Solicitudes de amistad pendientes
      </Text>

      {loading ? (
        <ActivityIndicator color={colors.tint} style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => String(item.id_solicitud)}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.empty}>
              <FontAwesome
                name="inbox"
                size={40}
                color={colors.tabIconDefault}
              />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No tienes solicitudes pendientes
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <FriendNotificationItem
              name={item.name}
              message={item.message}
              avatarSource={avatarSource(item.url_avatar)}
              onAccept={() => void handleAccept(item.id_solicitud)}
              onReject={() => void handleReject(item.id_solicitud)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontSize: 22,
    fontFamily: FONT_SEMIBOLD,
    marginHorizontal: 16,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: FONT_REGULAR,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  listContent: { paddingHorizontal: 12, paddingBottom: 24 },
  empty: { alignItems: "center", marginTop: 48, gap: 12 },
  emptyText: { fontFamily: FONT_REGULAR, fontSize: 14 },
});
