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

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={26} color="#1E293B" />
        </TouchableOpacity>

        <Image source={avatarSource} style={styles.avatar} />
        <View style={styles.textContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      <TouchableOpacity style={styles.searchButton} activeOpacity={0.7}>
        <Ionicons name="search-outline" size={22} color="#64748B" />
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
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#D9E3F3",
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
    backgroundColor: "#F1F5F9",
  },
  textContainer: {
    marginLeft: 12,
    justifyContent: "center",
    flex: 1,
  },
  name: {
    fontSize: 17,
    color: "#0F172A",
    fontFamily: "AlbertSans_600SemiBold",
  },
  subtitle: {
    marginTop: 1,
    fontSize: 12,
    color: "#64748B",
    fontFamily: "AlbertSans_400Regular",
  },
  searchButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
});
