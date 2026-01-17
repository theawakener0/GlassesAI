import { useState, useCallback } from 'react';
import * as Speech from 'expo-speech';
import { useSettingsStore } from '../stores/settingsStore';

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { voiceEnabled, voiceSpeed, voicePitch } = useSettingsStore();

  const speak = useCallback(
    async (text: string) => {
      if (!voiceEnabled || !text) return;

      // Stop any current speech
      await Speech.stop();

      setIsSpeaking(true);
      
      Speech.speak(text, {
        rate: voiceSpeed,
        pitch: voicePitch,
        language: 'en-US',
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    },
    [voiceEnabled, voiceSpeed, voicePitch]
  );

  const stop = useCallback(async () => {
    await Speech.stop();
    setIsSpeaking(false);
  }, []);

  const getVoices = useCallback(async () => {
    return await Speech.getAvailableVoicesAsync();
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    getVoices,
  };
}
