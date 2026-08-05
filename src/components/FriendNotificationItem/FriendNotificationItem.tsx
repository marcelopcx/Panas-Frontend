import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const FONT_SEMIBOLD = "AlbertSans_600SemiBold";
const FONT_REGULAR = "AlbertSans_400Regular";

export type FriendNotificationItemProps = {
  name: string;
  message: string;
  onAccept?: () => void;
  onReject?: () => void;
};

export const FriendNotificationItem = ({
  name,
  message,
  onAccept,
  onReject,
}: FriendNotificationItemProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatar} />

      <View style={styles.contentContainer}>
        <Text style={styles.nameText} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.messageText} numberOfLines={1}>
          {message}
        </Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={onAccept}
          activeOpacity={0.7}
        >
          <Text style={styles.acceptButtonText}>Aceptar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.rejectButton}
          onPress={onReject}
          activeOpacity={0.7}
        >
          <Text style={styles.rejectButtonText}>Rechazar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: "#F1F3F5",
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#D9D9D9",
    marginRight: 10,
  },
  contentContainer: {
    flex: 1,
    marginRight: 8,
    justifyContent: "center",
  },
  nameText: {
    fontSize: 14,
    fontFamily: FONT_SEMIBOLD,
    color: "#1E293B",
    marginBottom: 1,
    fontWeight: "700",
  },
  messageText: {
    fontSize: 12,
    fontFamily: FONT_REGULAR,
    color: "#64748B",
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 6,
  },
  acceptButton: {
    backgroundColor: "#E2E8F0",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptButtonText: {
    fontSize: 11,
    fontFamily: FONT_SEMIBOLD,
    color: "#475569",
    fontWeight: "600",
  },
  rejectButton: {
    backgroundColor: "#F1F5F9",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  rejectButtonText: {
    fontSize: 11,
    fontFamily: FONT_SEMIBOLD,
    color: "#64748B",
    fontWeight: "600",
  },
});
