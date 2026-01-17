import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SPACING, FONT_SIZES } from '../../utils/constants';
import { CapturedImage } from '../../types';

interface HUDOverlayProps {
  children: React.ReactNode;
  capturedImage?: CapturedImage | null;
  onClearImage?: () => void;
  onToggleCamera?: () => void;
  onPickImage?: () => void;
}

export function HUDOverlay({
  children,
  capturedImage,
  onClearImage,
  onToggleCamera,
  onPickImage,
}: HUDOverlayProps) {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.topButton}
            onPress={() => router.push('/history')}
          >
            <Ionicons name="time-outline" size={24} color={COLORS.secondary} />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <View style={styles.titleDot} />
            <Text style={styles.title}>GLASS AI</Text>
          </View>

          <TouchableOpacity
            style={styles.topButton}
            onPress={() => router.push('/settings')}
          >
            <Ionicons name="settings-outline" size={24} color={COLORS.secondary} />
          </TouchableOpacity>
        </View>

        {/* Captured Image Preview */}
        {capturedImage && (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{ uri: capturedImage.uri }}
              style={styles.imagePreview}
            />
            <TouchableOpacity
              style={styles.clearImageButton}
              onPress={onClearImage}
            >
              <Ionicons name="close" size={16} color={COLORS.secondary} />
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>

      {/* Main Content */}
      <View style={styles.content}>{children}</View>

      {/* Bottom Controls */}
      <SafeAreaView style={styles.bottomSafeArea} edges={['bottom']}>
        <View style={styles.bottomControls}>
          {/* Gallery button */}
          <TouchableOpacity style={styles.sideButton} onPress={onPickImage}>
            <Ionicons name="images-outline" size={24} color={COLORS.secondary} />
          </TouchableOpacity>

          {/* Center - Children slot for capture button */}
          <View style={styles.centerSlot} />

          {/* Camera flip button */}
          <TouchableOpacity style={styles.sideButton} onPress={onToggleCamera}>
            <Ionicons name="camera-reverse-outline" size={24} color={COLORS.secondary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Corner decorations */}
      <View style={[styles.corner, styles.cornerTopLeft]} />
      <View style={[styles.corner, styles.cornerTopRight]} />
      <View style={[styles.corner, styles.cornerBottomLeft]} />
      <View style={[styles.corner, styles.cornerBottomRight]} />
    </View>
  );
}

const CORNER_SIZE = 30;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    zIndex: 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  topButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.glassDark,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  titleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
  },
  title: {
    color: COLORS.secondary,
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    letterSpacing: 2,
  },
  imagePreviewContainer: {
    alignSelf: 'center',
    marginTop: SPACING.sm,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  imagePreview: {
    width: 80,
    height: 80,
  },
  clearImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 140,
  },
  bottomSafeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  sideButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.glassDark,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  centerSlot: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: COLORS.glassWhiteMedium,
  },
  cornerTopLeft: {
    top: 100,
    left: SPACING.md,
    borderTopWidth: 1,
    borderLeftWidth: 1,
  },
  cornerTopRight: {
    top: 100,
    right: SPACING.md,
    borderTopWidth: 1,
    borderRightWidth: 1,
  },
  cornerBottomLeft: {
    bottom: 200,
    left: SPACING.md,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
  },
  cornerBottomRight: {
    bottom: 200,
    right: SPACING.md,
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
});
