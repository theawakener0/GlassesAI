import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../common/GlassCard';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../utils/constants';
import { useSettingsStore } from '../../stores/settingsStore';

interface InputBarProps {
  onSend: (text: string) => void;
  onMicPress: () => void;
  isListening: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function InputBar({
  onSend,
  onMicPress,
  isListening,
  disabled,
  placeholder = 'Ask anything...',
}: InputBarProps) {
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);
  const { hapticEnabled } = useSettingsStore();
  
  const micScale = useSharedValue(1);

  useEffect(() => {
    if (isListening) {
      micScale.value = withSpring(1.1);
    } else {
      micScale.value = withSpring(1);
    }
  }, [isListening]);

  const handleSend = async () => {
    if (!text.trim() || disabled) return;

    if (hapticEnabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    onSend(text.trim());
    setText('');
    Keyboard.dismiss();
  };

  const handleMicPress = async () => {
    if (hapticEnabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onMicPress();
  };

  const micAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: micScale.value }],
  }));

  const hasText = text.trim().length > 0;

  return (
    <GlassCard style={styles.container} intensity={50}>
      <View style={styles.inputRow}>
        {/* Mic Button */}
        <TouchableOpacity
          onPress={handleMicPress}
          disabled={disabled}
          style={styles.iconButton}
        >
          <Animated.View style={micAnimatedStyle}>
            <Ionicons
              name={isListening ? 'mic' : 'mic-outline'}
              size={24}
              color={isListening ? COLORS.error : COLORS.secondary}
            />
          </Animated.View>
        </TouchableOpacity>

        {/* Text Input */}
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray500}
          multiline
          maxLength={1000}
          editable={!disabled}
          returnKeyType="send"
          onSubmitEditing={handleSend}
          blurOnSubmit
        />

        {/* Send Button */}
        <TouchableOpacity
          onPress={handleSend}
          disabled={!hasText || disabled}
          style={[styles.sendButton, hasText && styles.sendButtonActive]}
        >
          <Ionicons
            name="arrow-up"
            size={20}
            color={hasText ? COLORS.primary : COLORS.gray500}
          />
        </TouchableOpacity>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconButton: {
    padding: SPACING.xs,
  },
  input: {
    flex: 1,
    color: COLORS.secondary,
    fontSize: FONT_SIZES.md,
    maxHeight: 100,
    paddingVertical: Platform.OS === 'ios' ? SPACING.sm : 0,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.gray700,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: COLORS.secondary,
  },
});
