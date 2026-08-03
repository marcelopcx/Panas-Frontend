import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

const COLOR_BLUE = "#2B60AD";

export interface CustomDividerProps {
  color?: string;
  dotSize?: number;
  dotGap?: number;
  numDots?: number;
  containerStyle?: ViewStyle;
  dotStyle?: ViewStyle;
  label?: string;
  labelStyle?: TextStyle;
  opacity?: number;
  animationDuration?: number;
  showGlow?: boolean;
  glowIntensity?: number;
}

const dotGlow = (color: string, intensity: number): ViewStyle => ({
  shadowColor: color,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3 * intensity,
  shadowRadius: 4 * intensity,
  elevation: 3,
});

export const CustomDivider: React.FC<CustomDividerProps> = ({
  color = COLOR_BLUE,
  dotSize = 8,
  dotGap = 10,
  numDots = 5,
  containerStyle,
  dotStyle,
  label,
  labelStyle,
  opacity = 1,
  animationDuration = 700,
  showGlow = true,
  glowIntensity = 1,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: opacity,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, opacity, animationDuration]);

  const animatedContainerStyle: ViewStyle = {
    opacity: fadeAnim,
    transform: [{ scale: scaleAnim }],
  };

  const glow = showGlow ? dotGlow(color, glowIntensity) : {};

  const dotColorStyle: ViewStyle = {
    backgroundColor: color,
    width: dotSize,
    height: dotSize,
    borderRadius: dotSize / 2,
  };

  const renderDots = () => {
    const dots: React.ReactNode[] = [];
    for (let i = 0; i < numDots; i++) {
      dots.push(
        <View
          key={`dot-${i}`}
          style={[styles.dot, dotColorStyle, glow, dotStyle]}
        />,
      );
    }
    return dots;
  };

  return (
    <Animated.View
      style={[styles.container, containerStyle, animatedContainerStyle]}
    >
      <View style={[styles.row, { gap: dotGap }]}>{renderDots()}</View>

      {label && (
        <Animated.Text
          style={[
            styles.label,
            { color: color },
            { opacity: fadeAnim },
            labelStyle,
          ]}
        >
          {label}
        </Animated.Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    zIndex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    paddingHorizontal: 8,
  },
});
