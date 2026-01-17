import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { COLORS } from '../../utils/constants';

interface LoadingRingProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function LoadingRing({
  size = 48,
  color = COLORS.secondary,
  strokeWidth = 2,
}: LoadingRingProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1500, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.ring,
          animatedStyle,
          {
            width: size,
            height: size,
            borderWidth: strokeWidth,
            borderColor: `${color}30`,
            borderTopColor: color,
            borderRadius: size / 2,
          },
        ]}
      />
    </View>
  );
}

export function LoadingDots({ color = COLORS.secondary }: { color?: string }) {
  return (
    <View style={styles.dotsContainer}>
      <ActivityIndicator size="small" color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    borderStyle: 'solid',
  },
  dotsContainer: {
    padding: 8,
  },
});
