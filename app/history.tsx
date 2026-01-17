import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { GlassCard } from '../components/common/GlassCard';
import { useConversationStore } from '../stores/conversationStore';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../utils/constants';
import { formatTimestamp, truncateText } from '../utils/imageUtils';
import { Conversation } from '../types';

export default function HistoryScreen() {
  const {
    conversations,
    loadConversation,
    deleteConversation,
    clearAllConversations,
    startNewConversation,
  } = useConversationStore();

  const handleSelectConversation = (conversation: Conversation) => {
    loadConversation(conversation.id);
    router.back();
  };

  const handleDeleteConversation = (id: string) => {
    Alert.alert(
      'Delete Conversation',
      'Are you sure you want to delete this conversation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteConversation(id),
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All History',
      'Are you sure you want to delete all conversations? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: clearAllConversations,
        },
      ]
    );
  };

  const handleNewConversation = () => {
    startNewConversation();
    router.back();
  };

  const renderConversation = ({ item }: { item: Conversation }) => {
    const messageCount = item.messages.length;
    const preview = item.preview || 'New conversation';

    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => handleSelectConversation(item)}
        onLongPress={() => handleDeleteConversation(item.id)}
      >
        <GlassCard style={styles.conversationCard}>
          <View style={styles.conversationContent}>
            <View style={styles.conversationHeader}>
              <Text style={styles.conversationPreview}>
                {truncateText(preview, 50)}
              </Text>
              <Text style={styles.conversationTime}>
                {formatTimestamp(item.updatedAt)}
              </Text>
            </View>
            <Text style={styles.messageCount}>
              {messageCount} message{messageCount !== 1 ? 's' : ''}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray500} />
        </GlassCard>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubbles-outline" size={64} color={COLORS.gray600} />
      <Text style={styles.emptyTitle}>No Conversations</Text>
      <Text style={styles.emptySubtitle}>
        Start a new conversation by capturing an image or typing a message
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={COLORS.secondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearAll}
          disabled={conversations.length === 0}
        >
          <Text
            style={[
              styles.clearButtonText,
              conversations.length === 0 && styles.clearButtonDisabled,
            ]}
          >
            Clear
          </Text>
        </TouchableOpacity>
      </View>

      {/* New Conversation Button */}
      <TouchableOpacity style={styles.newButton} onPress={handleNewConversation}>
        <GlassCard style={styles.newButtonCard} variant="light">
          <Ionicons name="add-circle-outline" size={24} color={COLORS.secondary} />
          <Text style={styles.newButtonText}>New Conversation</Text>
        </GlassCard>
      </TouchableOpacity>

      {/* Conversations List */}
      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
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
  clearButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  clearButtonText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
  },
  clearButtonDisabled: {
    color: COLORS.gray600,
  },
  newButton: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
  },
  newButtonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  newButtonText: {
    color: COLORS.secondary,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  listContent: {
    padding: SPACING.md,
    paddingTop: SPACING.sm,
  },
  conversationItem: {
    marginBottom: SPACING.sm,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  conversationPreview: {
    color: COLORS.secondary,
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    flex: 1,
    marginRight: SPACING.sm,
  },
  conversationTime: {
    color: COLORS.gray500,
    fontSize: FONT_SIZES.xs,
  },
  messageCount: {
    color: COLORS.gray400,
    fontSize: FONT_SIZES.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl * 2,
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    color: COLORS.secondary,
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    color: COLORS.gray500,
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    lineHeight: 22,
  },
});
