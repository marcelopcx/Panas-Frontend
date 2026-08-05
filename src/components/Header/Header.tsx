import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

export type HeaderProps = {
  logoSource: ImageSourcePropType;
  onNotificationPress?: () => void;
};

export const Header = ({ logoSource, onNotificationPress }: HeaderProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const effectiveLogoSource = isDark
    ? require("../../../assets/images/logo white.png")
    : logoSource;

  return (
    <View
      style={[
        styles.headerContainer,
        { backgroundColor: colors.background, borderBottomColor: colors.border },
      ]}
    >
      <View style={styles.logoContainer}>
        <Image
          source={effectiveLogoSource}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <TouchableOpacity
        style={[
          styles.notificationButton,
          { backgroundColor: colors.border },
        ]}
        onPress={onNotificationPress}
        activeOpacity={0.7}
      >
        <FontAwesome
          name="bell"
          size={18}
          color={isDark ? "#FFFFFF" : "#2C5BA2"}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  logoContainer: {
    height: 36,
    justifyContent: "center",
  },
  logo: {
    width: 100,
    height: 30,
  },
  notificationButton: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
});
