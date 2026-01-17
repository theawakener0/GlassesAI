import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import Slider from '@react-native-community/slider';
import { GlassCard } from '../components/common/GlassCard';
import { useSettingsStore } from '../stores/settingsStore';
import { useConversationStore } from '../stores/conversationStore';
import { COLORS, SPACING, FONT_SIZES } from '../utils/constants';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const {
    voiceEnabled,
    voiceSpeed,
    voicePitch,
    apiEndpoint,
    hapticEnabled,
    updateSettings,
    resetSettings,
  } = useSettingsStore();

  const { clearAllConversations } = useConversationStore();

  const goBack = () => {
    if (navigation.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all conversations and reset settings. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            clearAllConversations();
            resetSettings();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={goBack}>
          <Ionicons name="close" size={24} color={COLORS.secondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Voice Settings */}
        <Text style={styles.sectionTitle}>VOICE</Text>
        <GlassCard style={styles.settingsCard}>
          {/* Voice Response Toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Voice Response</Text>
              <Text style={styles.settingDescription}>
                Read AI responses aloud
              </Text>
            </View>
            <Switch
              value={voiceEnabled}
              onValueChange={(value) => updateSettings({ voiceEnabled: value })}
              trackColor={{ false: COLORS.gray700, true: COLORS.gray400 }}
              thumbColor={voiceEnabled ? COLORS.secondary : COLORS.gray500}
            />
          </View>

          <View style={styles.divider} />

          {/* Voice Speed */}
          <View style={styles.settingRowVertical}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingLabel}>Speech Speed</Text>
              <Text style={styles.settingValue}>{voiceSpeed.toFixed(1)}x</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={2.0}
              step={0.1}
              value={voiceSpeed}
              onValueChange={(value) => updateSettings({ voiceSpeed: value })}
              minimumTrackTintColor={COLORS.secondary}
              maximumTrackTintColor={COLORS.gray700}
              thumbTintColor={COLORS.secondary}
              disabled={!voiceEnabled}
            />
          </View>

          <View style={styles.divider} />

          {/* Voice Pitch */}
          <View style={styles.settingRowVertical}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingLabel}>Speech Pitch</Text>
              <Text style={styles.settingValue}>{voicePitch.toFixed(1)}</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={2.0}
              step={0.1}
              value={voicePitch}
              onValueChange={(value) => updateSettings({ voicePitch: value })}
              minimumTrackTintColor={COLORS.secondary}
              maximumTrackTintColor={COLORS.gray700}
              thumbTintColor={COLORS.secondary}
              disabled={!voiceEnabled}
            />
          </View>
        </GlassCard>

        {/* Feedback Settings */}
        <Text style={styles.sectionTitle}>FEEDBACK</Text>
        <GlassCard style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Haptic Feedback</Text>
              <Text style={styles.settingDescription}>
                Vibration on button press
              </Text>
            </View>
            <Switch
              value={hapticEnabled}
              onValueChange={(value) => updateSettings({ hapticEnabled: value })}
              trackColor={{ false: COLORS.gray700, true: COLORS.gray400 }}
              thumbColor={hapticEnabled ? COLORS.secondary : COLORS.gray500}
            />
          </View>
        </GlassCard>

        {/* API Settings */}
        <Text style={styles.sectionTitle}>API CONFIGURATION</Text>
        <GlassCard style={styles.settingsCard}>
          <View style={styles.settingRowVertical}>
            <Text style={styles.settingLabel}>API Endpoint</Text>
            <Text style={styles.settingDescription}>
              Leave empty to use mock responses
            </Text>
            <TextInput
              style={styles.textInput}
              value={apiEndpoint}
              onChangeText={(value) => updateSettings({ apiEndpoint: value })}
              placeholder="https://api.example.com/v1/analyze"
              placeholderTextColor={COLORS.gray600}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
          </View>
        </GlassCard>

        {/* Data Management */}
        <Text style={styles.sectionTitle}>DATA</Text>
        <GlassCard style={styles.settingsCard}>
          <TouchableOpacity style={styles.dangerButton} onPress={handleClearData}>
            <Ionicons name="trash-outline" size={20} color={COLORS.error} />
            <Text style={styles.dangerButtonText}>Clear All Data</Text>
          </TouchableOpacity>
        </GlassCard>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>Glass AI</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.secondary,
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
  },
  headerPlaceholder: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  sectionTitle: {
    color: COLORS.gray400,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  settingsCard: {
    padding: 0,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
  },
  settingRowVertical: {
    padding: SPACING.md,
  },
  settingInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  settingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  settingLabel: {
    color: COLORS.secondary,
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
  },
  settingDescription: {
    color: COLORS.gray500,
    fontSize: FONT_SIZES.sm,
    marginTop: 2,
  },
  settingValue: {
    color: COLORS.gray300,
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginHorizontal: SPACING.md,
  },
  textInput: {
    backgroundColor: COLORS.gray800,
    borderRadius: 8,
    padding: SPACING.md,
    color: COLORS.secondary,
    fontSize: FONT_SIZES.md,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  dangerButtonText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
  },
  appInfo: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  appName: {
    color: COLORS.gray500,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  appVersion: {
    color: COLORS.gray600,
    fontSize: FONT_SIZES.sm,
    marginTop: 4,
  },
});
