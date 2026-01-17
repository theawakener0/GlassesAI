import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Conversation, Message } from '../types';
import { generateId } from '../utils/imageUtils';

interface ConversationState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isProcessing: boolean;
  
  // Actions
  startNewConversation: () => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setProcessing: (processing: boolean) => void;
  deleteConversation: (id: string) => void;
  clearAllConversations: () => void;
  loadConversation: (id: string) => void;
}

export const useConversationStore = create<ConversationState>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversation: null,
      isProcessing: false,

      startNewConversation: () => {
        const newConversation: Conversation = {
          id: generateId(),
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({
          currentConversation: newConversation,
          conversations: [newConversation, ...state.conversations],
        }));
      },

      addMessage: (messageData) => {
        const message: Message = {
          ...messageData,
          id: generateId(),
          timestamp: Date.now(),
        };

        set((state) => {
          if (!state.currentConversation) {
            // Create new conversation if none exists
            const newConversation: Conversation = {
              id: generateId(),
              messages: [message],
              createdAt: Date.now(),
              updatedAt: Date.now(),
              preview: message.text?.substring(0, 50),
            };
            return {
              currentConversation: newConversation,
              conversations: [newConversation, ...state.conversations],
            };
          }

          const updatedConversation: Conversation = {
            ...state.currentConversation,
            messages: [...state.currentConversation.messages, message],
            updatedAt: Date.now(),
            preview: message.type === 'user' 
              ? message.text?.substring(0, 50) 
              : state.currentConversation.preview,
          };

          return {
            currentConversation: updatedConversation,
            conversations: state.conversations.map((c) =>
              c.id === updatedConversation.id ? updatedConversation : c
            ),
          };
        });
      },

      setProcessing: (processing) => set({ isProcessing: processing }),

      deleteConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
          currentConversation:
            state.currentConversation?.id === id
              ? null
              : state.currentConversation,
        })),

      clearAllConversations: () =>
        set({ conversations: [], currentConversation: null }),

      loadConversation: (id) =>
        set((state) => ({
          currentConversation:
            state.conversations.find((c) => c.id === id) || null,
        })),
    }),
    {
      name: 'glass-ai-conversations',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        conversations: state.conversations,
      }),
    }
  )
);
