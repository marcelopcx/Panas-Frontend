import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View, ViewStyle } from "react-native";

interface AnimatedBackgroundPatternProps {
  style?: ViewStyle;
  opacity?: number;
}

export function AnimatedBackgroundPattern({
  style,
  opacity = 0.18,
}: AnimatedBackgroundPatternProps) {
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(drift, {
        toValue: 1,
        duration: 22000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [drift]);

  const translateX = drift.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 18, 0],
  });

  const translateY = drift.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -14, 0],
  });

  return (
    <View pointerEvents="none" style={[styles.container, style, { opacity }]}>
      <Animated.Image
        source={require("../../assets/images/background-icons.png")}
        resizeMode="cover"
        style={[
          styles.image,
          {
            transform: [{ translateX }, { translateY }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    backgroundColor: "#2B60AD",
  },
  image: {
    width: "120%",
    height: "120%",
    position: "absolute",
    top: "-10%",
    left: "-10%",
  },
});
