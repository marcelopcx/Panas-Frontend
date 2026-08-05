import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { CustomButton } from "@components/CustomButton/CustomButton";

const FONT_SEMIBOLD = "AlbertSans_600SemiBold";

export interface DynamicFormModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  buttonTitle?: string;
  onConfirm: () => void;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

export const DynamicFormModal = ({
  visible,
  onClose,
  title,
  buttonTitle = "Confirmar",
  onConfirm,
  loading = false,
  disabled = false,
  children,
}: DynamicFormModalProps) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.backButton}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons name="arrow-back" size={26} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>

        <View style={styles.footer}>
          <CustomButton
            title={buttonTitle}
            variant="secondary"
            onPress={onConfirm}
            loading={loading}
            disabled={disabled}
            fullWidth
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontFamily: FONT_SEMIBOLD,
    color: "#2B60AD",
    fontWeight: "600",
  },
  placeholder: {
    width: 34,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  contentContainer: {
    paddingTop: 16,
    paddingBottom: 40,
    gap: 8,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 34 : 24,
    paddingTop: 16,
    backgroundColor: "#FFFFFF",
  },
});
