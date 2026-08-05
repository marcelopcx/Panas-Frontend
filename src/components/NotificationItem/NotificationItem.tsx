import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const FONT_REGULAR = "AlbertSans_400Regular";

export type NotificationItemProps = {
  message: string;
  onClose?: () => void;
};

export const NotificationItem = ({
  message,
  onClose,
}: NotificationItemProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.messageText} numberOfLines={2}>
        {message}
      </Text>

      <TouchableOpacity
        style={styles.closeButton}
        onPress={onClose}
        activeOpacity={0.7}
      >
        <FontAwesome name="times" size={14} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  messageText: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONT_REGULAR,
    color: "#475569",
    marginRight: 12,
  },
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },
});
