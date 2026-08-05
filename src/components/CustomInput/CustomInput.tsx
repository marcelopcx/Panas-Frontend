import { Ionicons } from "@expo/vector-icons";
import React, { forwardRef, useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export type CustomInputType = "text" | "image" | "search";

export interface CustomInputProps extends Omit<TextInputProps, "style"> {
  type?: CustomInputType;
  label?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  isPassword?: boolean;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  imageUri?: string | null;
  onImagePress?: () => void;
  imageSize?: number;
  allowSpaces?: boolean;
}

const COLOR_BLUE = "#0088FF";
const COLOR_RED = "#FF2D55";
const COLOR_GRAY = "#94A3B8";
const COLOR_SEARCH_BG = "#2A5CA8"; // Color del fondo de búsqueda de la imagen
const FONT_ALBERT_SANS_REGULAR = "AlbertSans_400Regular";
const FONT_ALBERT_SANS_MEDIUM = "AlbertSans_500Medium";
const FONT_ALBERT_SANS_SEMIBOLD = "AlbertSans_600SemiBold";

export const CustomInput = forwardRef<TextInput, CustomInputProps>(
  (
    {
      type = "text",
      label,
      leftIcon,
      rightIcon,
      onRightIconPress,
      isPassword = false,
      error,
      containerStyle,
      inputStyle,
      onFocus,
      onBlur,
      onChangeText,
      placeholder = type === "search" ? "Buscar..." : undefined,
      secureTextEntry,
      imageUri,
      onImagePress,
      imageSize = 120,
      allowSpaces = type === "search" ? true : false,
      maxLength = 50,
      ...textInputProps
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const isError = !!error;
    const isSearch = type === "search";

    const sanitizeText = (text: string): string => {
      let sanitized = text;
      sanitized = sanitized.replace(/[\0<>]|\u0000/g, "");
      if (allowSpaces) {
        sanitized = sanitized.replace(/\s+/g, " ");
        sanitized = sanitized.replace(/^\s+/, "");
        return sanitized;
      }

      sanitized = sanitized.replace(/\s+/g, "");
      sanitized = sanitized.replace(/([^\w])\1+/g, "$1");
      return sanitized;
    };

    const handleChangeText = (text: string) => {
      const cleanText = sanitizeText(text);
      onChangeText?.(cleanText);
    };

    const handleFocus = (e: any) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    const effectiveLeftIcon = isSearch ? "search-outline" : leftIcon;

    const effectiveRightIcon = isPassword
      ? showPassword
        ? "eye-off-outline"
        : "eye-outline"
      : rightIcon;

    const handleRightPress = isPassword
      ? togglePasswordVisibility
      : onRightIconPress;

    const activeColor = isError
      ? COLOR_RED
      : isFocused
        ? COLOR_BLUE
        : COLOR_GRAY;

    const contentColor = isSearch ? "#FFFFFF" : activeColor;

    if (type === "image") {
      return (
        <View style={[styles.imageWrapper, containerStyle]}>
          <TouchableOpacity
            onPress={onImagePress}
            activeOpacity={0.8}
            style={[
              styles.imageContainer,
              {
                width: imageSize,
                height: imageSize,
                borderRadius: imageSize / 2,
                borderColor: activeColor,
              },
            ]}
          >
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={{
                  width: imageSize,
                  height: imageSize,
                  borderRadius: imageSize / 2,
                }}
              />
            ) : (
              <Ionicons name="camera-outline" size={32} color="#000000" />
            )}
          </TouchableOpacity>

          {label && (
            <Text style={[styles.imageLabel, { color: "#FFFFFF" }]}>
              {label}
            </Text>
          )}

          {isError && <Text style={styles.errorText}>{error}</Text>}
        </View>
      );
    }

    return (
      <View style={[styles.wrapper, containerStyle]}>
        <View
          style={[
            styles.inputContainer,
            isSearch
              ? styles.searchInputContainer
              : { borderColor: activeColor },
          ]}
        >
          {label && !isSearch && (
            <View style={styles.labelWrapper}>
              <Text style={[styles.label, { color: activeColor }]}>
                {label}
              </Text>
            </View>
          )}

          {effectiveLeftIcon && (
            <Ionicons
              name={effectiveLeftIcon}
              size={20}
              style={styles.leftIcon}
              color={contentColor}
            />
          )}

          <TextInput
            ref={ref}
            style={[styles.input, { color: contentColor }, inputStyle]}
            placeholder={placeholder}
            placeholderTextColor={isSearch ? "#FFFFFF99" : activeColor}
            secureTextEntry={isPassword ? !showPassword : secureTextEntry}
            textContentType={
              isPassword ? "password" : textInputProps.textContentType
            }
            autoComplete={isPassword ? "off" : textInputProps.autoComplete}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={handleChangeText}
            maxLength={maxLength}
            autoCorrect={false}
            autoCapitalize="none"
            underlineColorAndroid="transparent"
            selectionColor={contentColor}
            {...textInputProps}
          />

          {effectiveRightIcon && (
            <TouchableOpacity
              onPress={handleRightPress}
              disabled={!handleRightPress}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              activeOpacity={0.6}
            >
              <Ionicons
                name={effectiveRightIcon}
                size={20}
                style={styles.rightIcon}
                color={contentColor}
              />
            </TouchableOpacity>
          )}
        </View>

        {isError && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  },
);

CustomInput.displayName = "CustomInput";

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 10,
    marginBottom: 16,
    width: "100%",
  },
  imageWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    marginTop: 10,
  },
  imageContainer: {
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    overflow: "hidden",
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: "#ffffff",
    position: "relative",
  },
  searchInputContainer: {
    backgroundColor: COLOR_SEARCH_BG,
    borderWidth: 0,
    borderRadius: 16,
  },
  labelWrapper: {
    position: "absolute",
    top: -11,
    left: 20,
    backgroundColor: "#ffffff",
    paddingHorizontal: 4,
    zIndex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: FONT_ALBERT_SANS_SEMIBOLD,
  },
  imageLabel: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: FONT_ALBERT_SANS_SEMIBOLD,
    marginTop: 8,
    textAlign: "center",
    backgroundColor: "transparent",
    color: "#FFFFFF",
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    fontFamily: FONT_ALBERT_SANS_MEDIUM,
    paddingVertical: 8,
    ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
  },
  leftIcon: {
    marginRight: 10,
  },
  rightIcon: {
    marginLeft: 10,
  },
  errorText: {
    fontSize: 12,
    color: COLOR_RED,
    marginTop: 4,
    marginLeft: 8,
    fontFamily: FONT_ALBERT_SANS_REGULAR,
  },
});
