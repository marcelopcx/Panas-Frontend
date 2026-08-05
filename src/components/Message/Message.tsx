import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

const FONT_REGULAR = "AlbertSans_400Regular";
const FONT_SEMIBOLD = "AlbertSans_600SemiBold";

export interface MessageProps {
  text?: string;
  image?: any;
  time: string;
  isMine: boolean;
  onPressImage?: (image: any, time: string) => void;
}

const MAX_VISIBLE_LINES = 4;

export const Message = ({
  text,
  image,
  time,
  isMine,
  onPressImage,
}: MessageProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const [expanded, setExpanded] = useState(false);
  const [isLong, setIsLong] = useState(false);
  const [measured, setMeasanded] = useState(false);
  const hasImageOnly = image && !text;

  const showTruncated = measured && !expanded && isLong;

  return (
    <View
      style={[
        styles.container,
        isMine ? styles.containerRight : styles.containerLeft,
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setExpanded((prev) => !prev)}
        disabled={!measured || !isLong}
        style={styles.bubbleTouchable}
      >
        <View
          style={[
            styles.bubble,
            isMine ? styles.bubbleMine : styles.bubbleTheirs,
            !isMine && { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' },
          ]}
        >
          {image && (
            <View style={styles.imageContainer}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => onPressImage && onPressImage(image, time)}
              >
                <Image
                  source={image}
                  style={styles.messageImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>

              {hasImageOnly && <Text style={styles.timeAbsolute}>{time}</Text>}
            </View>
          )}

          {text && (
            <View>
              <Text
                style={[
                  styles.text,
                  isMine ? styles.textMine : { color: colors.text },
                ]}
                numberOfLines={showTruncated ? 4 : undefined}
                onTextLayout={(e) => {
                  if (!measured) {
                    setIsLong(e.nativeEvent.lines.length > 4);
                    setMeasanded(true);
                  }
                }}
              >
                {text}
              </Text>

              {isLong && (
                <Text
                  style={[
                    styles.showMoreText,
                    { color: isMine ? 'rgba(255,255,255,0.9)' : colors.tint },
                  ]}
                >
                  {expanded ? 'Mostrar menos' : 'Mostrar más'}
                </Text>
              )}
            </View>
          )}

          {!hasImageOnly && (
            <Text
              style={[
                styles.time,
                isMine ? styles.timeMine : { color: colors.textSecondary },
              ]}
            >
              {time}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 6,
    paddingHorizontal: 16,
    flexDirection: "row",
  },
  containerLeft: {
    justifyContent: "flex-start",
  },
  containerRight: {
    justifyContent: "flex-end",
  },
  bubbleTouchable: {
    maxWidth: "80%",
  },
  bubble: {
    padding: 12,
    borderRadius: 16,
    position: "relative",
  },
  bubbleTheirs: {
    borderTopLeftRadius: 4,
  },
  bubbleMine: {
    backgroundColor: "#2C5BA2",
    borderTopRightRadius: 4,
    shadowColor: "#2C5BA2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 1,
  },
  text: {
    fontSize: 15,
    fontFamily: FONT_REGULAR,
    lineHeight: 20,
    marginTop: 4,
  },
  textMine: {
    color: "#FFFFFF",
  },
  showMoreText: {
    fontSize: 12,
    fontFamily: FONT_SEMIBOLD,
    fontWeight: "600",
    marginTop: 6,
  },
  imageContainer: {
    position: "relative",
  },
  messageImage: {
    width: 250,
    height: 250,
    borderRadius: 12,
  },
  timeAbsolute: {
    position: "absolute",
    bottom: 6,
    right: 6,
    fontSize: 10,
    fontFamily: FONT_REGULAR,
    color: "#FFFFFF",
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: "hidden",
  },
  time: {
    fontSize: 11,
    alignSelf: "flex-end",
    marginTop: 4,
    fontFamily: FONT_REGULAR,
  },
  timeMine: {
    color: "rgba(255,255,255,0.9)",
  },
});
