import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";

import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

export interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  loadingText?: string;
}

const FONT_ALBERT_SANS_SEMIBOLD = "AlbertSans_600SemiBold";

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  loading = false,
  disabled = false,
  variant = "secondary",
  fullWidth = true,
  size = "md",
  containerStyle,
  textStyle,
  loadingText,
  onPress,
  ...touchableProps
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const isButtonDisabled = disabled && !loading;

  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const isOutline = variant === "outline";
  const isGhost = variant === "ghost";

  const buttonSizes = {
    sm: { height: 44, paddingHorizontal: 12 },
    md: { height: 52, paddingHorizontal: 16 },
    lg: { height: 60, paddingHorizontal: 20 },
  };

  let backgroundColor = colors.card;
  let borderColor = "transparent";
  let borderWidth = 0;
  let textColor = "#FFFFFF";
  let spinnerColor = "#FFFFFF";

  if (variant === "primary") {
    backgroundColor = colors.tint;
  } else if (variant === "secondary") {
    backgroundColor = isDark ? "#1E293B" : "#0F172A";
  } else if (variant === "outline") {
    backgroundColor = "transparent";
    borderColor = colors.tint;
    borderWidth = 1.5;
    textColor = colors.tint;
    spinnerColor = colors.tint;
  } else if (variant === "ghost") {
    backgroundColor = colors.borderSubtle;
    textColor = colors.tint;
    spinnerColor = colors.tint;
  }

  if (loading && (isPrimary || isSecondary)) {
    backgroundColor = colors.tint;
  }

  if (isButtonDisabled) {
    if (isOutline || isGhost) {
      textColor = colors.tabIconDefault;
      spinnerColor = colors.tabIconDefault;
      borderColor = isOutline ? colors.border : "transparent";
      borderWidth = isOutline ? 1.5 : 0;
    } else {
      backgroundColor = colors.borderSubtle;
      borderColor = colors.border;
      borderWidth = 1.5;
      textColor = colors.tabIconDefault;
      spinnerColor = colors.tabIconDefault;
    }
  }

  const displayTitle = loading ? loadingText || "Procesando" : title;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      onPress={onPress}
      style={[
        styles.button,
        !fullWidth && styles.buttonInline,
        { backgroundColor, borderColor, borderWidth },
        buttonSizes[size],
        isButtonDisabled && { borderColor: colors.border },
        containerStyle,
      ]}
      {...touchableProps}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={spinnerColor}
          style={styles.spinner}
        />
      ) : null}

      <Text
        style={[
          styles.text,
          isButtonDisabled
            ? { color: textColor }
            : [
                isPrimary || isSecondary
                  ? styles.textOnDark
                  : styles.textOnLight,
                { color: textColor },
              ],
          textStyle,
        ]}
      >
        {displayTitle}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  buttonInline: {
    width: undefined,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 16,
    fontFamily: FONT_ALBERT_SANS_SEMIBOLD,
    fontWeight: "600",
    textAlign: "center",
  },
  textOnDark: {
    color: "#FFFFFF",
  },
  textOnLight: {
    color: "#2B60AD",
  },
  spinner: {
    marginRight: 8,
  },
});
