import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  LayoutAnimation,
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  UIManager,
  View,
} from "react-native";

import { NotificationContainer } from "@/components/NotificationContainer/NotificationContainer";
import { NotificationItem } from "@/components/NotificationItem/NotificationItem";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import {
  eliminarNotificacion,
  listNotificaciones,
} from "@/services/api";
import type { Notificacion } from "@/types/api";

const SCREEN_WIDTH = Dimensions.get("window").width;

if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const NotificationDropdown = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const [notifications, setNotifications] = useState<Notificacion[]>([]);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const load = useCallback(async () => {
    try {
      const data = await listNotificaciones(false);
      setNotifications(data.items);
    } catch {
      setNotifications([]);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      void load();
      slideAnim.setValue(-10);
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, load, slideAnim, fadeAnim]);

  const handleCloseItem = async (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setNotifications((prev) =>
      prev.filter((n) => n.id_notificacion !== id),
    );
    try {
      await eliminarNotificacion(id);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (visible && notifications.length === 0) {
      // keep open briefly; user can dismiss overlay
    }
  }, [visible, notifications.length]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.dropdown,
                {
                  backgroundColor: colors.surface,
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <NotificationContainer>
                {notifications.length === 0 ? (
                  <Text
                    style={{
                      color: colors.textSecondary,
                      padding: 16,
                      textAlign: "center",
                    }}
                  >
                    No hay notificaciones
                  </Text>
                ) : (
                  notifications.map((item) => (
                    <NotificationItem
                      key={item.id_notificacion}
                      message={item.mensaje}
                      onClose={() => void handleCloseItem(item.id_notificacion)}
                    />
                  ))
                )}
              </NotificationContainer>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    paddingTop: 72,
    alignItems: "flex-end",
    paddingRight: 12,
  },
  dropdown: {
    width: Math.min(SCREEN_WIDTH - 32, 340),
    borderRadius: 16,
    overflow: "hidden",
    maxHeight: 360,
  },
});
