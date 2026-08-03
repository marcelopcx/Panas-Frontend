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

const COLOR_BLUE = "#0088FF";
const COLOR_BLUE_DARK = "#0072E6";
const COLOR_BLUE_LIGHT = "#4DA6FF";
const COLOR_BLUE_50 = "#EFF6FF";
const COLOR_SLATE_900 = "#0F172A";
const COLOR_SLATE_800 = "#1E293B";
const COLOR_WHITE = "#FFFFFF";
const COLOR_DISABLED_BG = "#F1F5F9";
const COLOR_DISABLED_BORDER = "#CBD5E1";
const COLOR_DISABLED_TEXT = "#94A3B8";

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

  let backgroundColor = COLOR_SLATE_900;
  let borderColor = "transparent";
  let borderWidth = 0;
  let textColor = COLOR_WHITE;
  let spinnerColor = COLOR_WHITE;

  if (variant === "primary") {
    backgroundColor = COLOR_BLUE;
  } else if (variant === "secondary") {
    backgroundColor = COLOR_SLATE_900;
  } else if (variant === "outline") {
    backgroundColor = "transparent";
    borderColor = COLOR_BLUE;
    borderWidth = 1.5;
    textColor = COLOR_BLUE;
    spinnerColor = COLOR_BLUE;
  } else if (variant === "ghost") {
    backgroundColor = COLOR_BLUE_50;
    textColor = COLOR_BLUE;
    spinnerColor = COLOR_BLUE;
  }

  if (loading && (isPrimary || isSecondary)) {
    backgroundColor = COLOR_BLUE;
  }

  if (isButtonDisabled) {
    if (isOutline || isGhost) {
      textColor = COLOR_DISABLED_TEXT;
      spinnerColor = COLOR_DISABLED_TEXT;
      borderColor = isOutline ? COLOR_DISABLED_BORDER : "transparent";
      borderWidth = isOutline ? 1.5 : 0;
    } else {
      backgroundColor = COLOR_DISABLED_BG;
      borderColor = COLOR_DISABLED_BORDER;
      borderWidth = 1.5;
      textColor = COLOR_DISABLED_TEXT;
      spinnerColor = COLOR_DISABLED_TEXT;
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
        isButtonDisabled && styles.buttonDisabledBorder,
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
            ? styles.textDisabled
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
  buttonDisabledBorder: {
    borderColor: COLOR_DISABLED_BORDER,
  },
  text: {
    fontSize: 16,
    fontFamily: FONT_ALBERT_SANS_SEMIBOLD,
    fontWeight: "600",
    textAlign: "center",
  },
  textOnDark: {
    color: COLOR_WHITE,
  },
  textOnLight: {
    color: COLOR_BLUE,
  },
  textDisabled: {
    color: COLOR_DISABLED_TEXT,
  },
  spinner: {
    marginRight: 8,
  },
});
