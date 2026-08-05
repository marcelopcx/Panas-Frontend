import React from "react";
import { StyleSheet, View } from "react-native";

import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

export type NotificationContainerProps = {
  children: React.ReactNode;
};

export const NotificationContainer = ({
  children,
}: NotificationContainerProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  return <View style={[styles.container, { backgroundColor: colors.borderSubtle }]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
});
