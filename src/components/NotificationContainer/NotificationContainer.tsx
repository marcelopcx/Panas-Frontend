import React from "react";
import { StyleSheet, View } from "react-native";

export type NotificationContainerProps = {
  children: React.ReactNode;
};

export const NotificationContainer = ({
  children,
}: NotificationContainerProps) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
});
