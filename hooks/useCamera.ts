import { useState, useRef, useCallback } from 'react';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { CapturedImage } from '../types';
import { imageToBase64 } from '../utils/imageUtils';

export function useCamera() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);

  const toggleFacing = useCallback(() => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }, []);

  const captureImage = useCallback(async (): Promise<CapturedImage | null> => {
    if (!cameraRef.current || isCapturing) return null;

    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
        exif: false,
      });

      if (!photo) return null;

      return {
        uri: photo.uri,
        base64: photo.base64 || await imageToBase64(photo.uri),
        width: photo.width,
        height: photo.height,
      };
    } catch (error) {
      console.error('Error capturing image:', error);
      return null;
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing]);

  const pickImage = useCallback(async (): Promise<CapturedImage | null> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
        base64: true,
      });

      if (result.canceled || !result.assets[0]) return null;

      const asset = result.assets[0];
      return {
        uri: asset.uri,
        base64: asset.base64 || await imageToBase64(asset.uri),
        width: asset.width,
        height: asset.height,
      };
    } catch (error) {
      console.error('Error picking image:', error);
      return null;
    }
  }, []);

  return {
    cameraRef,
    permission,
    requestPermission,
    facing,
    toggleFacing,
    captureImage,
    pickImage,
    isCapturing,
  };
}
