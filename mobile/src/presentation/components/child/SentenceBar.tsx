import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { AACCard } from '../../../domain/entities/Card';
import { ExpoSpeechAdapter } from '../../../infrastructure/speech/ExpoSpeechAdapter';

interface SentenceBarProps {
  cards: AACCard[];
  onRemoveCard: (index: number) => void;
  onClearAll: () => void;
  onSaveFavorite?: () => void;
}

export const SentenceBar: React.FC<SentenceBarProps> = ({
  cards,
  onRemoveCard,
  onClearAll,
  onSaveFavorite,
}) => {
  const handleSpeakSentence = () => {
    if (cards.length === 0) return;
    const sentence = cards.map((c) => c.label).join(' ');
    ExpoSpeechAdapter.speak(sentence);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {cards.length === 0 ? (
          <Text style={styles.placeholderText}>Toque nos cartões abaixo para montar a frase...</Text>
        ) : (
          cards.map((card, index) => (
            <TouchableOpacity
              key={`${card.id}-${index}`}
              style={styles.cardItem}
              onPress={() => onRemoveCard(index)}
              activeOpacity={0.7}
            >
              <Image source={{ uri: card.imageUri }} style={styles.cardImage} resizeMode="contain" />
              <Text style={styles.cardLabel}>{card.label}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <View style={styles.actionsContainer}>
        {cards.length > 0 && onSaveFavorite && (
          <TouchableOpacity
            style={[styles.actionButton, styles.favoriteButton]}
            onPress={onSaveFavorite}
            activeOpacity={0.8}
          >
            <Text style={styles.favoriteButtonText}>⭐</Text>
          </TouchableOpacity>
        )}

        {cards.length > 0 && (
          <TouchableOpacity
            style={[styles.actionButton, styles.clearButton]}
            onPress={onClearAll}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>🗑️</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.actionButton, styles.speakButton, cards.length === 0 && styles.disabledButton]}
          onPress={handleSpeakSentence}
          disabled={cards.length === 0}
          activeOpacity={0.8}
        >
          <Text style={styles.speakButtonText}>🔊 Falar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingRight: 10,
  },
  placeholderText: {
    fontSize: 16,
    color: '#94A3B8',
    fontStyle: 'italic',
    textAlign: 'center',
    alignSelf: 'center',
  },
  cardItem: {
    width: 80,
    height: 90,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    padding: 4,
  },
  cardImage: {
    width: 48,
    height: 48,
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  favoriteButtonText: {
    fontSize: 18,
  },
  clearButton: {
    backgroundColor: '#FEE2E2',
  },
  speakButton: {
    backgroundColor: '#22C55E',
  },
  disabledButton: {
    backgroundColor: '#CBD5E1',
    opacity: 0.6,
  },
  actionButtonText: {
    color: '#EF4444',
    fontWeight: 'bold',
    fontSize: 14,
  },
  speakButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
