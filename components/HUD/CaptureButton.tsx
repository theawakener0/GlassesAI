import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../utils/constants';
import { useSettingsStore } from '../../stores/settingsStore';

interface CaptureButtonProps {
  onCapture: () => void;
  isCapturing: boolean;
  disabled?: boolean;
}

export function CaptureButton({ onCapture, isCapturing, disabled }: CaptureButtonProps) {
  const scale = useSharedValue(1);
  const innerScale = useSharedValue(1);
  const { hapticEnabled } = useSettingsStore();

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    innerScale.value = withSpring(0.9);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    innerScale.value = withSpring(1);
  };

  const handlePress = async () => {
    if (disabled || isCapturing) return;

    if (hapticEnabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Pulse animation
    innerScale.value = withSequence(
      withTiming(0.8, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );

    onCapture();
  };

  const outerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const innerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: innerScale.value }],
  }));

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled || isCapturing}
    >
      <Animated.View style={[styles.outerRing, outerAnimatedStyle]}>
        <View style={styles.middleRing}>
          <Animated.View
            style={[
              styles.innerCircle,
              innerAnimatedStyle,
              isCapturing && styles.capturing,
            ]}
          />
        </View>
        {/* Corner brackets */}
        <View style={[styles.bracket, styles.bracketTopLeft]} />
        <View style={[styles.bracket, styles.bracketTopRight]} />
        <View style={[styles.bracket, styles.bracketBottomLeft]} />
        <View style={[styles.bracket, styles.bracketBottomRight]} />
      </Animated.View>
    </TouchableOpacity>
  );
}

const BUTTON_SIZE = 80;
const INNER_SIZE = 60;

const styles = StyleSheet.create({
  outerRing: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    borderWidth: 2,
    borderColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  middleRing: {
    width: INNER_SIZE + 8,
    height: INNER_SIZE + 8,
    borderRadius: (INNER_SIZE + 8) / 2,
    borderWidth: 1,
    borderColor: COLORS.glassWhite,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: INNER_SIZE,
    height: INNER_SIZE,
    borderRadius: INNER_SIZE / 2,
    backgroundColor: COLORS.secondary,
  },
  capturing: {
    backgroundColor: COLORS.gray400,
  },
  bracket: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderColor: COLORS.secondary,
  },
  bracketTopLeft: {
    top: -6,
    left: -6,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  bracketTopRight: {
    top: -6,
    right: -6,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  bracketBottomLeft: {
    bottom: -6,
    left: -6,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  bracketBottomRight: {
    bottom: -6,
    right: -6,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
});
