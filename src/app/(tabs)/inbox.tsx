import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState } from "react";
import { FlatList, StyleSheet } from "react-native";

import { FriendNotificationItem } from "@/components/FriendNotificationItem/FriendNotificationItem";
import { Header } from "@/components/Header/Header";
import { NotificationDropdown } from "@/components/NotificationDropdown/NotificationDropdown";
import { Text, View } from "@/components/Themed";

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
    <View style={styles.container}>
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
          <View style={styles.emptyContainer}>
            <View style={styles.iconCircle}>
              <FontAwesome name="inbox" size={36} color="#94A3B8" />
            </View>
            <Text style={styles.emptyTitle}>Bandeja vacía</Text>
            <Text style={styles.emptySubtitle}>
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
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#F1F3F5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: FONT_SEMIBOLD,
    color: "#1E293B",
    marginBottom: 6,
    textAlign: "center",
    fontWeight: "700",
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: FONT_REGULAR,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
  },
});
