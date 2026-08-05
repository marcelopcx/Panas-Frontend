import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useAppTheme } from "@/providers/AppThemeProvider";
import Colors from "@/constants/Colors";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={22} {...props} />;
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useAppTheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={["top", "left", "right"]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "#FFFFFF",
            tabBarInactiveTintColor: "#FFFFFF",
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: "600",
              fontFamily: "AlbertSans_600SemiBold",
              textAlign: "center",
              marginTop: 2,
            },

            tabBarStyle: [
              styles.tabBar,
              { marginBottom: Math.max(insets.bottom, 10), backgroundColor: colors.tabBar },
            ],
            tabBarItemStyle: styles.tabBarItem,
          }}
        >
          <Tabs.Screen
            name="chats"
            options={{
              title: "Chats",
              tabBarIcon: ({ color, focused }) => (
                <View
                  style={[
                    styles.iconContainer,
                    focused && styles.activeIconContainer,
                  ]}
                >
                  <TabBarIcon name="commenting" color={color} />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="meet"
            options={{
              title: "Conocer",
              tabBarIcon: ({ color, focused }) => (
                <View
                  style={[
                    styles.iconContainer,
                    focused && styles.activeIconContainer,
                  ]}
                >
                  <TabBarIcon name="users" color={color} />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="inbox"
            options={{
              title: "Bandeja",
              tabBarIcon: ({ color, focused }) => (
                <View
                  style={[
                    styles.iconContainer,
                    focused && styles.activeIconContainer,
                  ]}
                >
                  <TabBarIcon name="inbox" color={color} />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="perfil"
            options={{
              title: "Perfil",
              tabBarIcon: ({ color, focused }) => (
                <View
                  style={[
                    styles.iconContainer,
                    focused && styles.activeIconContainer,
                  ]}
                >
                  <TabBarIcon name="user" color={color} />
                </View>
              ),
            }}
          />
        </Tabs>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  tabBar: {
    borderRadius: 14,
    height: 65,
    width: "95%",
    alignSelf: "center",
    borderTopWidth: 0,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingTop: 6,
    paddingBottom: 6,
  },
  tabBarItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 40,
    height: 28,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  activeIconContainer: {
    backgroundColor: "#1D4B8A",
  },
});
