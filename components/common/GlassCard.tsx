import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS, BORDER_RADIUS, SPACING } from '../../utils/constants';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  variant?: 'dark' | 'light';
  noBorder?: boolean;
}

export function GlassCard({
  children,
  style,
  intensity = 40,
  variant = 'dark',
  noBorder = false,
}: GlassCardProps) {
  return (
    <View style={[styles.container, style]}>
      <BlurView
        intensity={intensity}
        tint={variant}
        style={[
          styles.blur,
          !noBorder && styles.border,
          variant === 'dark' ? styles.darkOverlay : styles.lightOverlay,
        ]}
      >
        <View style={styles.content}>{children}</View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: BORDER_RADIUS.lg,
  },
  blur: {
    overflow: 'hidden',
    borderRadius: BORDER_RADIUS.lg,
  },
  border: {
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  darkOverlay: {
    backgroundColor: COLORS.glassDark,
  },
  lightOverlay: {
    backgroundColor: COLORS.glassWhite,
  },
  content: {
    padding: SPACING.md,
  },
});
