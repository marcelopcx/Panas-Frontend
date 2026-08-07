import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
} from "react-native";

import { ChatItem } from "@/components/ChatItem/ChatItem";
import { CustomInput } from "@/components/CustomInput/CustomInput";
import { Header } from "@/components/Header/Header";
import { NotificationDropdown } from "@/components/NotificationDropdown/NotificationDropdown";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useAppTheme } from "@/providers/AppThemeProvider";
import { ApiError, listChats } from "@/services/api";
import type { ChatListItem } from "@/types/api";
import { avatarSource, formatChatTime } from "@/utils/format";

const FONT_SEMIBOLD = "AlbertSans_600SemiBold";
const FONT_REGULAR = "AlbertSans_400Regular";

export default function ChatsScreen() {
  const router = useRouter();
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [notifVisible, setNotifVisible] = useState(false);
  const { colorScheme } = useAppTheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const loadChats = useCallback(async () => {
    setLoading(true);
    try {
      const items = await listChats();
      setChats(items);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "No se pudieron cargar los chats.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadChats();
    }, [loadChats]),
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return chats;
    return chats.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.last_message.toLowerCase().includes(q),
    );
  }, [chats, query]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        logoSource={require("../../../assets/images/logo blue.png")}
        onNotificationPress={() => setNotifVisible((v) => !v)}
      />
      <NotificationDropdown
        visible={notifVisible}
        onClose={() => setNotifVisible(false)}
      />

      <View style={styles.searchWrap}>
        <CustomInput
          type="search"
          placeholder="Buscar chats…"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.tint} style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id_chat)}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.empty}>
              <FontAwesome
                name="comments"
                size={40}
                color={colors.tabIconDefault}
              />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Aún no tienes chats. Acepta amistades para empezar.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <ChatItem
              name={item.name}
              lastMessage={item.last_message}
              updatedAt={formatChatTime(item.updated_at)}
              unreadCount={item.unread}
              avatarSource={avatarSource(item.url_avatar)}
              onPress={() =>
                router.push({
                  pathname: "/messageScreen",
                  params: {
                    id: String(item.id_chat),
                    name: item.name,
                    updatedAt: formatChatTime(item.updated_at),
                    avatarUrl: item.url_avatar ?? "",
                  },
                })
              }
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchWrap: { paddingHorizontal: 16, marginBottom: 4 },
  listContent: { paddingBottom: 24 },
  empty: { alignItems: "center", marginTop: 48, gap: 12, paddingHorizontal: 32 },
  emptyText: {
    fontFamily: FONT_REGULAR,
    fontSize: 14,
    textAlign: "center",
  },
});
