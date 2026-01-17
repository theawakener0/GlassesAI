import { useState, useCallback } from 'react';
import { apiService } from '../services/api';
import { useConversationStore } from '../stores/conversationStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useSpeech } from './useSpeech';
import { CapturedImage } from '../types';

export function useAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addMessage, setProcessing } = useConversationStore();
  const { apiEndpoint } = useSettingsStore();
  const { speak } = useSpeech();

  const sendMessage = useCallback(
    async (text?: string, image?: CapturedImage) => {
      if (!text && !image) {
        setError('Please provide text or capture an image');
        return;
      }

      setIsLoading(true);
      setProcessing(true);
      setError(null);

      // Add user message
      addMessage({
        type: 'user',
        text: text,
        image: image?.base64?.substring(0, 100), // Store thumbnail reference
      });

      try {
        // Update endpoint if configured
        if (apiEndpoint) {
          apiService.setEndpoint(apiEndpoint);
        }

        const response = await apiService.analyze({
          text,
          image: image?.base64,
        });

        // Add assistant response
        addMessage({
          type: 'assistant',
          text: response.text,
        });

        // Speak the response
        speak(response.text);

        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        
        // Add error as assistant message
        addMessage({
          type: 'assistant',
          text: `Error: ${errorMessage}. Please try again.`,
        });
      } finally {
        setIsLoading(false);
        setProcessing(false);
      }
    },
    [addMessage, setProcessing, apiEndpoint, speak]
  );

  return {
    sendMessage,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
