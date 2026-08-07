import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { useAuth } from "@/providers/AuthProvider";
import { useAppTheme } from "@/providers/AppThemeProvider";
import Colors from "@/constants/Colors";

export default function Index() {
  const { loading, isAuthenticated } = useAuth();
  const { colorScheme } = useAppTheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator color={colors.tint} />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/chats" />;
  }

  return <Redirect href="/login" />;
}
