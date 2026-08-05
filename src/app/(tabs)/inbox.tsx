import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState } from "react";
import { FlatList, StyleSheet } from "react-native";

import { FriendNotificationItem } from "@/components/FriendNotificationItem/FriendNotificationItem";
import { Header } from "@/components/Header/Header";
import { NotificationDropdown } from "@/components/NotificationDropdown/NotificationDropdown";
import { Text, View } from "@/components/Themed";
import { useAppTheme } from "@/providers/AppThemeProvider";
import Colors from "@/constants/Colors";

const FONT_SEMIBOLD = "AlbertSans_600SemiBold";
const FONT_REGULAR = "AlbertSans_400Regular";

export type FriendRequestItem = {
  id: string;
  name: string;
  message: string;
  onAccept?: () => void;
  onReject?: () => void;
};

const REQUESTS_DATA: FriendRequestItem[] = [
  {
    id: "1",
    name: "Andres Arrias",
    message: "Te ha enviado una solicitud...",
    onAccept: () => console.log("Aceptado 1"),
    onReject: () => console.log("Rechazado 1"),
  },
  {
    id: "2",
    name: "Mariana Gómez",
    message: "Te ha enviado una solicitud...",
    onAccept: () => console.log("Aceptado 2"),
    onReject: () => console.log("Rechazado 2"),
  },
  {
    id: "3",
    name: "Carlos Pérez",
    message: "Te ha enviado una solicitud...",
    onAccept: () => console.log("Aceptado 3"),
    onReject: () => console.log("Rechazado 3"),
  },
];

export default function InboxScreen() {
  const [requests, setRequests] = useState<FriendRequestItem[]>(REQUESTS_DATA);
  const [notifVisible, setNotifVisible] = useState(false);
  const { colorScheme } = useAppTheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const toggleNotif = () => {
    setNotifVisible((prev) => !prev);
  };

  const closeNotif = () => {
    setNotifVisible(false);
  };

  const renderItem = ({ item }: { item: FriendRequestItem }) => (
    <FriendNotificationItem
      name={item.name}
      message={item.message}
      onAccept={() =>
        setRequests((prev) => prev.filter((r) => r.id !== item.id))
      }
      onReject={() =>
        setRequests((prev) => prev.filter((r) => r.id !== item.id))
      }
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        logoSource={require("../../../assets/images/logo blue.png")}
        onNotificationPress={toggleNotif}
      />
      <NotificationDropdown visible={notifVisible} onClose={closeNotif} />

      <FlatList
        data={requests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          requests.length === 0 && styles.emptyListContainer,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
            <View style={[styles.iconCircle, { backgroundColor: colors.iconCircle }]}>
              <FontAwesome name="inbox" size={36} color={colors.tabIconDefault} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Bandeja vacía</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              No tienes solicitudes ni notificaciones pendientes por ahora.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingTop: 8,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: FONT_SEMIBOLD,
    marginBottom: 6,
    textAlign: "center",
    fontWeight: "700",
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: FONT_REGULAR,
    textAlign: "center",
    lineHeight: 20,
  },
});
