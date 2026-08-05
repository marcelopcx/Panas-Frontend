import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

type HeaderMessageProps = {
  name: string;
  avatarSource: ImageSourcePropType;
  subtitle?: string;
};

export const HeaderMessage = ({
  name,
  avatarSource,
  subtitle,
}: HeaderMessageProps) => {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, borderBottomColor: colors.border },
      ]}
    >
      <View style={styles.leftSection}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons
            name="chevron-back"
            size={26}
            color={colors.text}
          />
        </TouchableOpacity>

        <Image source={avatarSource} style={[styles.avatar, { backgroundColor: colors.border }]} />
        <View style={styles.textContainer}>
          <Text
            style={[styles.name, { color: colors.text }]}
            numberOfLines={1}
          >
            {name}
          </Text>
          {subtitle ? (
            <Text
              style={[
                styles.subtitle,
                { color: colors.textSecondary },
              ]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    shadowColor: "#2C5BA2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 10,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  backButton: {
    paddingRight: 8,
    paddingVertical: 4,
    marginRight: 4,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  textContainer: {
    marginLeft: 12,
    justifyContent: "center",
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontFamily: "AlbertSans_600SemiBold",
  },
  subtitle: {
    marginTop: 1,
    fontSize: 12,
    fontFamily: "AlbertSans_400Regular",
  },
});
