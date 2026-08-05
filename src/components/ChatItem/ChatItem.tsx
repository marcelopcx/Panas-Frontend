import React from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const FONT_SEMIBOLD = "AlbertSans_600SemiBold";
const FONT_REGULAR = "AlbertSans_400Regular";

export type ChatItemProps = {
  name: string;
  lastMessage: string;
  updatedAt: string;
  unreadCount?: number;
  avatarSource?: ImageSourcePropType;
  onPress?: () => void;
};

export const ChatItem = ({
  name,
  lastMessage,
  updatedAt,
  unreadCount = 0,
  avatarSource,
  onPress,
}: ChatItemProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chatContainer,
        pressed && styles.chatPressed,
      ]}
    >
      {avatarSource ? (
        <Image source={avatarSource} style={styles.avatar} />
      ) : (
        <View style={styles.avatar} />
      )}

      <View style={styles.contentContainer}>
        <View style={styles.topRow}>
          <Text style={styles.chatTitle}>{name}</Text>
          <Text style={styles.timeText}>{updatedAt}</Text>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.chatMessage} numberOfLines={1}>
            {lastMessage}
          </Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginVertical: 4,
  },
  chatPressed: {
    backgroundColor: "#F1F3F5",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#D9D9D9",
    marginRight: 14,
  },
  contentContainer: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  chatTitle: {
    fontSize: 16,
    fontFamily: FONT_SEMIBOLD,
    color: "#1E293B",
    fontWeight: "700",
  },
  timeText: {
    fontSize: 12,
    fontFamily: FONT_REGULAR,
    color: "#94A3B8",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatMessage: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONT_REGULAR,
    color: "#64748B",
    marginRight: 8,
  },
  badge: {
    backgroundColor: "#212529",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontFamily: FONT_SEMIBOLD,
    fontWeight: "700",
  },
});
