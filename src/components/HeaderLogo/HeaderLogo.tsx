import React, { useEffect } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useColorScheme } from "@/components/useColorScheme";

const { width } = Dimensions.get("window");

const TEXT_REVEAL_DURATION = 2800;

export const HeaderLogo = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const textReveal = useSharedValue(0);

  useEffect(() => {
    textReveal.value = withTiming(1, {
      duration: TEXT_REVEAL_DURATION,
      easing: Easing.out(Easing.cubic),
    });
  }, []);

  const textAnimatedStyle = useAnimatedStyle(() => {
    const fullWidth = width * 0.85;
    const currentWidth = fullWidth * textReveal.value;
    return {
      width: currentWidth,
      opacity: textReveal.value,
    };
  });

  return (
    <View style={styles.logoContainer}>
      <Animated.View style={[styles.textRevealContainer, textAnimatedStyle]}>
      <Image
        source={
          isDark
            ? require("../../../assets/images/logo white.png")
            : require("../../../assets/images/logo.png")
        }
        style={styles.logoText}
        resizeMode="contain"
      />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    marginTop: 40,
  },
  textRevealContainer: {
    height: 80,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    width: width * 0.85,
    height: 80,
    resizeMode: "contain",
  },
});
