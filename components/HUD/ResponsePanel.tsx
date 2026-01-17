import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../common/GlassCard';
import { LoadingDots } from '../common/LoadingRing';
import { COLORS, SPACING, FONT_SIZES } from '../../utils/constants';
import { Message } from '../../types';

interface ResponsePanelProps {
  messages: Message[];
  isLoading: boolean;
  onStopSpeaking?: () => void;
  isSpeaking?: boolean;
}

export function ResponsePanel({
  messages,
  isLoading,
  onStopSpeaking,
  isSpeaking,
}: ResponsePanelProps) {
  const lastMessage = messages[messages.length - 1];
  const lastAssistantMessage = [...messages].reverse().find((m) => m.type === 'assistant');

  if (!lastAssistantMessage && !isLoading) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      style={styles.container}
    >
      <GlassCard style={styles.card} intensity={60}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.statusDot} />
            <Text style={styles.headerText}>AI Response</Text>
          </View>
          {isSpeaking && (
            <TouchableOpacity onPress={onStopSpeaking} style={styles.stopButton}>
              <Ionicons name="volume-mute" size={16} color={COLORS.secondary} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <LoadingDots />
              <Text style={styles.loadingText}>Analyzing...</Text>
            </View>
          ) : lastAssistantMessage ? (
            <Text style={styles.responseText}>{lastAssistantMessage.text}</Text>
          ) : null}
        </ScrollView>

        {/* Timestamp */}
        {lastAssistantMessage && !isLoading && (
          <Text style={styles.timestamp}>
            {new Date(lastAssistantMessage.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        )}
      </GlassCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.lg,
    maxHeight: 250,
  },
  card: {
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  headerText: {
    color: COLORS.gray300,
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  stopButton: {
    padding: SPACING.xs,
  },
  scrollView: {
    maxHeight: 150,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  loadingText: {
    color: COLORS.gray400,
    fontSize: FONT_SIZES.md,
  },
  responseText: {
    color: COLORS.secondary,
    fontSize: FONT_SIZES.md,
    lineHeight: 22,
  },
  timestamp: {
    color: COLORS.gray500,
    fontSize: FONT_SIZES.xs,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
});
