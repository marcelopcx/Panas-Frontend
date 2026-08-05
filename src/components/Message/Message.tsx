import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface MessageProps {
  text?: string;
  image?: any;
  time: string;
  isMine: boolean;
  onPressImage?: (image: any, time: string) => void;
}

export const Message = ({
  text,
  image,
  time,
  isMine,
  onPressImage,
}: MessageProps) => {
  const hasImageOnly = image && !text;

  return (
    <View
      style={[
        styles.container,
        isMine ? styles.containerRight : styles.containerLeft,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isMine ? styles.bubbleMine : styles.bubbleTheirs,
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
          <Text
            style={[styles.text, isMine ? styles.textMine : styles.textTheirs]}
          >
            {text}
          </Text>
        )}

        {!hasImageOnly && (
          <Text
            style={[styles.time, isMine ? styles.timeMine : styles.timeTheirs]}
          >
            {time}
          </Text>
        )}
      </View>
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
  bubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    position: "relative",
  },
  bubbleTheirs: {
    backgroundColor: "#E8EEF7",
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
    fontFamily: "AlbertSans_400Regular",
    lineHeight: 20,
    marginTop: 4,
  },
  textTheirs: {
    color: "#0F172A",
  },
  textMine: {
    color: "#FFFFFF",
  },
  imageContainer: {
    position: "relative",
  },
  messageImage: {
    width: 250,
    height: 150,
    borderRadius: 12,
  },
  timeAbsolute: {
    position: "absolute",
    bottom: 6,
    right: 6,
    fontSize: 10,
    fontFamily: "AlbertSans_400Regular",
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
    fontFamily: "AlbertSans_400Regular",
  },
  timeTheirs: {
    color: "#64748B",
  },
  timeMine: {
    color: "rgba(255,255,255,0.9)",
  },
});
