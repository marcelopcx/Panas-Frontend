import React, { useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

const FONT_REGULAR = "AlbertSans_400Regular";
const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

export interface UserProfile {
  id: string;
  name: string;
  image: any;
}

export interface CardUserProps {
  user: UserProfile;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isFirst: boolean;
  index: number;
}

export const CardUser = ({
  user,
  onSwipeLeft,
  onSwipeRight,
  isFirst,
  index,
}: CardUserProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const position = useRef(new Animated.ValueXY()).current;
  const onSwipeLeftRef = useRef(onSwipeLeft);
  const onSwipeRightRef = useRef(onSwipeRight);
  const swipingRef = useRef(false);

  onSwipeLeftRef.current = onSwipeLeft;
  onSwipeRightRef.current = onSwipeRight;

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const forceSwipe = (direction: "left" | "right") => {
    if (swipingRef.current) return;
    swipingRef.current = true;
    const x = direction === "right" ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => {
      if (direction === "right") {
        onSwipeRightRef.current();
      } else {
        onSwipeLeftRef.current();
      }
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > 4 || Math.abs(gesture.dy) > 4,
      onPanResponderMove: (_event, gesture) => {
        if (swipingRef.current) return;
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_event, gesture) => {
        if (swipingRef.current) return;
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe("right");
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe("left");
        } else {
          resetPosition();
        }
      },
    }),
  ).current;

  const getCardStyle = () => {
    if (!isFirst) {
      return {
        position: "absolute" as const,
        top: index * 15,
        transform: [{ scale: 1 - index * 0.05 }],
        zIndex: -index,
        opacity: 1 - index * 0.2,
      };
    }

    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ["-10deg", "0deg", "10deg"],
      extrapolate: "clamp",
    });

    return {
      transform: [
        { translateX: position.x },
        { translateY: position.y },
        { rotate },
      ],
      zIndex: 100,
    };
  };

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[styles.container, getCardStyle()]}
      {...(isFirst ? panResponder.panHandlers : {})}
    >
      <View style={styles.cardWrapper}>
        <View style={[styles.layerGray, { backgroundColor: isDark ? "#334155" : "#D7DDE8", opacity: isDark ? 0.5 : 0.7 }]} />
        <View style={[styles.layerBlue, { backgroundColor: isDark ? "rgba(59, 130, 246, 0.08)" : "rgba(59, 130, 246, 0.12)", borderColor: isDark ? "rgba(59, 130, 246, 0.12)" : "rgba(59, 130, 246, 0.2)" }]} />
        <View style={[styles.accentGlow, { backgroundColor: isDark ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.16)" }]} />

        <Image source={user.image} style={styles.image} resizeMode="cover" />

        {isFirst && (
          <>
            <Animated.View
              style={[
                styles.feedbackOverlay,
                styles.feedbackRight,
                { opacity: likeOpacity },
              ]}
            >
              <Text style={styles.feedbackTextBlue}>ENVIAR</Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.feedbackOverlay,
                styles.feedbackLeft,
                { opacity: nopeOpacity },
              ]}
            >
              <Text style={styles.feedbackTextGray}>NOPE</Text>
            </Animated.View>
          </>
        )}
      </View>
      <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  cardWrapper: {
    width: 292,
    height: 320,
    marginBottom: 14,
    position: "relative",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
  },
  layerGray: {
    position: "absolute",
    top: 14,
    left: 10,
    width: "100%",
    height: "100%",
    borderRadius: 28,
  },
  layerBlue: {
    position: "absolute",
    top: 8,
    left: 4,
    width: "100%",
    height: "100%",
    borderRadius: 28,
    borderWidth: 1,
  },
  accentGlow: {
    position: "absolute",
    top: -10,
    right: -8,
    width: 92,
    height: 92,
    borderRadius: 46,
  },
  topBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 3,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.88)",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.2)",
  },
  topBadgeText: {
    color: "#3B82F6",
    fontSize: 12,
    fontFamily: FONT_REGULAR,
    letterSpacing: 0.5,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 28,
    backgroundColor: "#E2E8F0",
  },
  name: {
    fontSize: 20,
    fontFamily: FONT_REGULAR,
    textAlign: "center",
    marginTop: 4,
  },
  feedbackOverlay: {
    position: "absolute",
    top: 22,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 3,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  feedbackLeft: {
    right: 18,
    borderColor: "#A0AAB5",
    transform: [{ rotate: "15deg" }],
  },
  feedbackRight: {
    left: 18,
    transform: [{ rotate: "-15deg" }],
    borderColor: "#3B82F6",
  },
  feedbackTextGray: {
    color: "#A0AAB5",
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  feedbackTextBlue: {
    color: "#3B82F6",
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 2,
  },
});
