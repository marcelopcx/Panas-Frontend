import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, ImageSourcePropType, StyleSheet } from "react-native";

import { ChatItem } from "@/components/ChatItem/ChatItem";
import { CustomInput } from "@/components/CustomInput/CustomInput";
import { Header } from "@/components/Header/Header";
import { NotificationDropdown } from "@/components/NotificationDropdown/NotificationDropdown";
import { Text, View } from "@/components/Themed";

const FONT_SEMIBOLD = "AlbertSans_600SemiBold";
const FONT_REGULAR = "AlbertSans_400Regular";

export type Chat = {
  id: string;
  name: string;
  lastMessage: string;
  updatedAt: string;
  unread: number;
  avatarId: "user1" | "user2" | "user3";
  avatar: ImageSourcePropType;
};

const CHATS_DATA: Chat[] = [
  {
    id: "1",
    name: "Jhon Doe",
    lastMessage: "El que abre mucho la boca busca que se la rompan...",
    updatedAt: "10:30pm",
    unread: 5,
    avatarId: "user1",
    avatar: require("../../../assets/images/user1.jpg"),
  },
  {
    id: "2",
    name: "Mariana López",
    lastMessage: "El que abre mucho la boca busca que se la rompan...",
    updatedAt: "10:30pm",
    unread: 5,
    avatarId: "user2",
    avatar: require("../../../assets/images/user2.webp"),
  },
  {
    id: "3",
    name: "Carlos Pérez",
    lastMessage: "El que abre mucho la boca busca que se la rompan...",
    updatedAt: "10:30pm",
    unread: 5,
    avatarId: "user3",
    avatar: require("../../../assets/images/user3.jpg"),
  },
  {
    id: "4",
    name: "Sofía Ramírez",
    lastMessage: "El que abre mucho la boca busca que se la rompan...",
    updatedAt: "10:30pm",
    unread: 5,
    avatarId: "user1",
    avatar: require("../../../assets/images/user1.jpg"),
  },
  {
    id: "5",
    name: "Jhon Doe",
    lastMessage: "El que abre mucho la boca busca que se la rompan...",
    updatedAt: "10:30pm",
    unread: 5,
    avatarId: "user2",
    avatar: require("../../../assets/images/user2.webp"),
  },
  {
    id: "6",
    name: "Ana Torres",
    lastMessage: "El que abre mucho la boca busca que se la rompan...",
    updatedAt: "10:30pm",
    unread: 5,
    avatarId: "user3",
    avatar: require("../../../assets/images/user3.jpg"),
  },
  {
    id: "7",
    name: "Miguel Rojas",
    lastMessage: "El que abre mucho la boca busca que se la rompan...",
    updatedAt: "10:30pm",
    unread: 5,
    avatarId: "user1",
    avatar: require("../../../assets/images/user1.jpg"),
  },
  {
    id: "8",
    name: "Valentina Castro",
    lastMessage: "El que abre mucho la boca busca que se la rompan...",
    updatedAt: "10:30pm",
    unread: 5,
    avatarId: "user2",
    avatar: require("../../../assets/images/user2.webp"),
  },
  {
    id: "9",
    name: "Andrés Gómez",
    lastMessage: "El que abre mucho la boca busca que se la rompan...",
    updatedAt: "10:30pm",
    unread: 5,
    avatarId: "user3",
    avatar: require("../../../assets/images/user3.jpg"),
  },
];

export default function ChatsScreen() {
  const router = useRouter();
  const [chats] = useState<Chat[]>(CHATS_DATA);
  const [notifVisible, setNotifVisible] = useState(false);

  const toggleNotif = () => {
    setNotifVisible((prev) => !prev);
  };

  const closeNotif = () => {
    setNotifVisible(false);
  };

  const handlePressChat = (chat: Chat) => {
    router.push({
      pathname: "/messageScreen",
      params: {
        id: chat.id,
        name: chat.name,
        updatedAt: chat.updatedAt,
        avatarId: chat.avatarId,
      },
    });
  };

  const handleNewChat = () => {
    //router.push("/chats/new");
  };

  const renderItem = ({ item }: { item: Chat }) => (
    <ChatItem
      avatarSource={item.avatar}
      name={item.name}
      lastMessage={item.lastMessage}
      updatedAt={item.updatedAt}
      unreadCount={item.unread}
      onPress={() => handlePressChat(item)}
    />
  );

  return (
    <View style={styles.container}>
      <Header
        logoSource={require("../../../assets/images/logo blue.png")}
        onNotificationPress={toggleNotif}
      />
      <NotificationDropdown visible={notifVisible} onClose={closeNotif} />

      <View style={styles.contentInput}>
        <CustomInput type="search" placeholder="Buscar chats..." />
      </View>

      <FlatList
        data={chats}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          chats.length === 0 && styles.emptyListContainer,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.iconCircle}>
              <FontAwesome name="comment-o" size={36} color="#94A3B8" />
            </View>
            <Text style={styles.emptyTitle}>No hay chats aún</Text>
            <Text style={styles.emptySubtitle}>
              Inicia una conversación para empezar.
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
  contentInput: {
    paddingHorizontal: 8,
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
    marginBottom: 16,
  },
  newChatButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#2B60AD",
    borderRadius: 14,
    height: 48,
    paddingHorizontal: 20,
  },
  newChatButtonText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: FONT_SEMIBOLD,
    fontWeight: "700",
  },
});
