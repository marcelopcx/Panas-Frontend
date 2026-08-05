import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

type MessageContainerProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onPickImage: () => void;
  onTakePhoto: () => void;
};

export const MessageContainer = ({
  value,
  onChangeText,
  onSend,
  onPickImage,
  onTakePhoto,
}: MessageContainerProps) => {
  const canSend = value.trim().length > 0;

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.iconButton} onPress={onPickImage}>
          <Ionicons name="image-outline" size={24} color="#94A3B8" />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje..."
          placeholderTextColor="#94A3B8"
          multiline
          value={value}
          onChangeText={onChangeText}
        />

        <TouchableOpacity style={styles.iconButton} onPress={onTakePhoto}>
          <Ionicons name="camera" size={24} color="#94A3B8" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
          onPress={onSend}
          disabled={!canSend}
        >
          <Ionicons
            name="send"
            size={18}
            color={canSend ? "#FFFFFF" : "#CBD5E1"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    backgroundColor: "transparent",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 56,
    borderWidth: 1,
    borderColor: "#D9E3F3",
    shadowColor: "#2C5BA2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  input: {
    flex: 1,
    color: "#0F172A",
    fontSize: 16,
    paddingHorizontal: 12,
    fontFamily: "AlbertSans_400Regular",
    maxHeight: 100,
  },
  iconButton: {
    padding: 4,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2C5BA2",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },
  sendButtonDisabled: {
    backgroundColor: "#C9D5EA",
  },
});
