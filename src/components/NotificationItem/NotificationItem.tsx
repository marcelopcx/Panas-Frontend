import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

const FONT_REGULAR = "AlbertSans_400Regular";

export type NotificationItemProps = {
  message: string;
  onClose?: () => void;
};

export const NotificationItem = ({
  message,
  onClose,
}: NotificationItemProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, borderColor: colors.border },
      ]}
    >
      <Text
        style={[styles.messageText, { color: colors.textSecondary }]}
        numberOfLines={2}
      >
        {message}
      </Text>

      <TouchableOpacity
        style={[styles.closeButton, { backgroundColor: colors.border }]}
        onPress={onClose}
        activeOpacity={0.7}
      >
        <FontAwesome name="times" size={14} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 4,
    borderWidth: 1,
  },
  messageText: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONT_REGULAR,
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
