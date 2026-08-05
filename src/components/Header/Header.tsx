import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export type HeaderProps = {
  logoSource: ImageSourcePropType;
  onNotificationPress?: () => void;
};

export const Header = ({ logoSource, onNotificationPress }: HeaderProps) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.logoContainer}>
        <Image source={logoSource} style={styles.logo} resizeMode="contain" />
      </View>

      <TouchableOpacity
        style={styles.notificationButton}
        onPress={onNotificationPress}
        activeOpacity={0.7}
      >
        <FontAwesome name="bell" size={18} color="#2C5BA2" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F3F5",
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
