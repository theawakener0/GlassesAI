import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { CameraView as ExpoCameraView, CameraType } from 'expo-camera';
import { COLORS, FONT_SIZES } from '../../utils/constants';

interface CameraViewProps {
  cameraRef: React.RefObject<ExpoCameraView | null>;
  facing: CameraType;
  hasPermission: boolean | undefined;
  onRequestPermission: () => void;
}

export function CameraView({
  cameraRef,
  facing,
  hasPermission,
  onRequestPermission,
}: CameraViewProps) {
  if (hasPermission === undefined) {
    return (
      <View style={styles.container}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Initializing camera...</Text>
        </View>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Camera access required</Text>
          <Text style={styles.placeholderSubtext}>
            Grant camera permission to capture images for AI analysis
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={onRequestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ExpoCameraView
        ref={cameraRef as any}
        style={styles.camera}
        facing={facing}
      />
      {/* Scan line effect overlay */}
      <View style={styles.scanOverlay} pointerEvents="none">
        <View style={styles.scanLine} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.primary,
  },
  camera: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  placeholderText: {
    color: COLORS.secondary,
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  placeholderSubtext: {
    color: COLORS.gray400,
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: COLORS.glassWhite,
    top: '50%',
  },
});
