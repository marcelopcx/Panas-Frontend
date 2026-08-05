import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  ImageSourcePropType,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type ShowImageChatModalProps = {
  visible: boolean;
  imageSource: ImageSourcePropType | null;
  time?: string;
  onClose: () => void;
};

export const ShowImageChatModal = ({
  visible,
  imageSource,
  time,
  onClose,
}: ShowImageChatModalProps) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0.9);
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
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
  }, [visible, scaleAnim, fadeAnim]);

  if (!imageSource) return null;

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
                styles.modalCard,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <View style={styles.imageWrapper}>
                <Image
                  source={imageSource}
                  style={styles.fullImage}
                  resizeMode="contain"
                />
              </View>

              {time ? <Text style={styles.timeText}>{time}</Text> : null}
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
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#F8FAFC",
    borderRadius: 24,
    padding: 16,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    alignItems: "center",
  },
  header: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  imageWrapper: {
    width: "100%",
    height: 320,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#E2E8F0",
  },
  fullImage: {
    width: "100%",
    height: "100%",
  },
  timeText: {
    marginTop: 12,
    fontSize: 12,
    fontFamily: "AlbertSans_400Regular",
    color: "#64748B",
    alignSelf: "flex-end",
  },
});
