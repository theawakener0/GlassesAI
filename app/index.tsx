import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { Audio } from 'expo-av';
import { CameraView } from '../components/Camera/CameraView';
import { HUDOverlay } from '../components/HUD/HUDOverlay';
import { CaptureButton } from '../components/HUD/CaptureButton';
import { InputBar } from '../components/HUD/InputBar';
import { ResponsePanel } from '../components/HUD/ResponsePanel';
import { useCamera } from '../hooks/useCamera';
import { useAI } from '../hooks/useAI';
import { useSpeech } from '../hooks/useSpeech';
import { useConversationStore } from '../stores/conversationStore';
import { CapturedImage } from '../types';
import { COLORS } from '../utils/constants';

export default function MainScreen() {
  const [capturedImage, setCapturedImage] = useState<CapturedImage | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const {
    cameraRef,
    permission,
    requestPermission,
    facing,
    toggleFacing,
    captureImage,
    pickImage,
    isCapturing,
  } = useCamera();

  const { sendMessage, isLoading } = useAI();
  const { stop: stopSpeaking, isSpeaking } = useSpeech();
  const { currentConversation, startNewConversation } = useConversationStore();

  // Start a new conversation on mount if none exists
  useEffect(() => {
    if (!currentConversation) {
      startNewConversation();
    }
  }, []);

  const handleCapture = useCallback(async () => {
    const image = await captureImage();
    if (image) {
      setCapturedImage(image);
    }
  }, [captureImage]);

  const handlePickImage = useCallback(async () => {
    const image = await pickImage();
    if (image) {
      setCapturedImage(image);
    }
  }, [pickImage]);

  const handleClearImage = useCallback(() => {
    setCapturedImage(null);
  }, []);

  const handleSend = useCallback(
    async (text: string) => {
      await sendMessage(text, capturedImage || undefined);
      setCapturedImage(null);
    },
    [sendMessage, capturedImage]
  );

  const handleMicPress = useCallback(async () => {
    if (isListening) {
      // Stop recording
      setIsListening(false);
      if (recording) {
        try {
          await recording.stopAndUnloadAsync();
          const uri = recording.getURI();
          // In a real app, you would send this to a speech-to-text service
          // For now, we'll show an alert that STT would process this
          Alert.alert(
            'Speech Recorded',
            'In production, this audio would be sent to a speech-to-text service. For demo purposes, please type your message.',
            [{ text: 'OK' }]
          );
        } catch (error) {
          console.error('Error stopping recording:', error);
        }
        setRecording(null);
      }
    } else {
      // Start recording
      try {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Microphone permission is needed for voice input.');
          return;
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording: newRecording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        
        setRecording(newRecording);
        setIsListening(true);
      } catch (error) {
        console.error('Error starting recording:', error);
        Alert.alert('Error', 'Failed to start recording. Please try again.');
      }
    }
  }, [isListening, recording]);

  const messages = currentConversation?.messages || [];

  return (
    <View style={styles.container}>
      {/* Camera Background */}
      <CameraView
        cameraRef={cameraRef}
        facing={facing}
        hasPermission={permission?.granted}
        onRequestPermission={requestPermission}
      />

      {/* HUD Overlay */}
      <HUDOverlay
        capturedImage={capturedImage}
        onClearImage={handleClearImage}
        onToggleCamera={toggleFacing}
        onPickImage={handlePickImage}
      >
        {/* Response Panel */}
        <ResponsePanel
          messages={messages}
          isLoading={isLoading}
          onStopSpeaking={stopSpeaking}
          isSpeaking={isSpeaking}
        />

        {/* Input Bar */}
        <InputBar
          onSend={handleSend}
          onMicPress={handleMicPress}
          isListening={isListening}
          disabled={isLoading}
          placeholder={capturedImage ? 'Ask about this image...' : 'Ask anything...'}
        />
      </HUDOverlay>

      {/* Capture Button - Positioned absolutely */}
      <View style={styles.captureButtonContainer}>
        <CaptureButton
          onCapture={handleCapture}
          isCapturing={isCapturing}
          disabled={isLoading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  captureButtonContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 30,
    alignSelf: 'center',
    zIndex: 20,
  },
});
