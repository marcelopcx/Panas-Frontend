import React, { useState, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  LayoutAnimation,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  UIManager,
  View,
} from "react-native";
import { NotificationContainer } from "@/components/NotificationContainer/NotificationContainer";
import { NotificationItem } from "@/components/NotificationItem/NotificationItem";
import { Text } from "@/components/Themed";

const SCREEN_WIDTH = Dimensions.get("window").width;

const INITIAL_NOTIFICATIONS = [
  {
    id: "1",
    message: "Nuevo mensaje de Andrés Arrias",
  },
  {
    id: "2",
    message: "Tu publicación fue vista por 5 personas",
  },
  {
    id: "3",
    message: "Nueva conexión recibida de Laura Gómez",
  },
  {
    id: "4",
    message: "Recordatorio: reunión mañana a las 10am",
  },
];

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
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(-10);
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  const handleCloseItem = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setNotifications((prev) => {
      const next = prev.filter((n) => n.id !== id);
      if (next.length === 0) {
        onClose();
      }
      return next;
    });
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.dropdown,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <NotificationContainer>
                {notifications.length === 0 ? (
                  <Text style={styles.emptyText}>
                    No tienes notificaciones
                  </Text>
                ) : (
                  notifications.map((notif) => (
                    <NotificationItem
                      key={notif.id}
                      message={notif.message}
                      onClose={() => handleCloseItem(notif.id)}
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
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
  },
  dropdown: {
    position: "absolute",
    top: 60,
    right: 10,
    width: SCREEN_WIDTH - 20,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "AlbertSans_400Regular",
    color: "#94A3B8",
    textAlign: "center",
    paddingVertical: 12,
  },
});