import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

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
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const canSend = value.trim().length > 0;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TouchableOpacity style={styles.iconButton} onPress={onPickImage}>
          <Ionicons name="image-outline" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Escribe un mensaje..."
          placeholderTextColor={colors.textSecondary}
          multiline
          value={value}
          onChangeText={onChangeText}
        />

        <TouchableOpacity style={styles.iconButton} onPress={onTakePhoto}>
          <Ionicons name="camera" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: colors.border },
            !canSend && { backgroundColor: colors.borderSubtle },
          ]}
          onPress={onSend}
          disabled={!canSend}
        >
          <Ionicons
            name="send"
            size={18}
            color={canSend ? colors.text : colors.textSecondary}
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
    borderRadius: 28,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 56,
    borderWidth: 1,
    shadowColor: "#2C5BA2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  input: {
    flex: 1,
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
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },
});
