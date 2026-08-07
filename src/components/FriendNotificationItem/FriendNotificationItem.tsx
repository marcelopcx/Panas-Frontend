import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

const FONT_SEMIBOLD = "AlbertSans_600SemiBold";
const FONT_REGULAR = "AlbertSans_400Regular";

export type FriendNotificationItemProps = {
  name: string;
  message: string;
  avatarSource?: ImageSourcePropType;
  onAccept?: () => void;
  onReject?: () => void;
};

export const FriendNotificationItem = ({
  name,
  message,
  avatarSource,
  onAccept,
  onReject,
}: FriendNotificationItemProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderColor: colors.borderSubtle }]}>
      {avatarSource ? (
        <Image source={avatarSource} style={styles.avatarImage} />
      ) : (
        <View style={[styles.avatar, { backgroundColor: colors.border }]} />
      )}

      <View style={styles.contentContainer}>
        <Text style={[styles.nameText, { color: colors.text }]} numberOfLines={1}>
          {name}
        </Text>
        <Text style={[styles.messageText, { color: colors.textSecondary }]} numberOfLines={1}>
          {message}
        </Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.acceptButton, { backgroundColor: colors.borderSubtle }]}
          onPress={onAccept}
          activeOpacity={0.7}
        >
          <Text style={[styles.acceptButtonText, { color: colors.text }]}>Aceptar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.rejectButton, { backgroundColor: colors.borderSubtle }]}
          onPress={onReject}
          activeOpacity={0.7}
        >
          <Text style={[styles.rejectButtonText, { color: colors.textSecondary }]}>Rechazar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginVertical: 4,
    borderWidth: 1,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
  },
  avatarImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
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
    marginBottom: 1,
    fontWeight: "700",
  },
  messageText: {
    fontSize: 12,
    fontFamily: FONT_REGULAR,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 6,
  },
  acceptButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptButtonText: {
    fontSize: 11,
    fontFamily: FONT_SEMIBOLD,
    fontWeight: "600",
  },
  rejectButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  rejectButtonText: {
    fontSize: 11,
    fontFamily: FONT_SEMIBOLD,
    fontWeight: "600",
  },
});
