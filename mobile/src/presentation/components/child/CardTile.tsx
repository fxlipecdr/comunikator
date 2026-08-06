import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { AACCard } from '../../../domain/entities/Card';
import { ExpoSpeechAdapter } from '../../../infrastructure/speech/ExpoSpeechAdapter';

interface CardTileProps {
  card: AACCard;
  colorCode?: string;
  onPress: (card: AACCard) => void;
}

export const CardTile: React.FC<CardTileProps> = ({ card, colorCode = '#4A90E2', onPress }) => {
  const handlePress = () => {
    // Fala individual do cartão ao tocar
    ExpoSpeechAdapter.speak(card.label);
    onPress(card);
  };

  return (
    <TouchableOpacity
      style={[styles.tileContainer, { borderColor: colorCode }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Image source={{ uri: card.imageUri }} style={styles.image} resizeMode="contain" />
      <Text style={styles.label}>{card.label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tileContainer: {
    width: '28%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: '2.5%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '65%',
    height: '65%',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
});
