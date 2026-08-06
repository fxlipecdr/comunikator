import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Category } from '../../../domain/entities/Category';
import { AACCard } from '../../../domain/entities/Card';
import { QuickPhrase } from '../../../domain/entities/QuickPhrase';
import { CardTile } from './CardTile';
import { ExpoSpeechAdapter } from '../../../infrastructure/speech/ExpoSpeechAdapter';

interface CategoryGridProps {
  categories: Category[];
  selectedCategoryId: string | null;
  cards: AACCard[];
  quickPhrases?: QuickPhrase[];
  onSelectCategory: (categoryId: string) => void;
  onSelectCard: (card: AACCard) => void;
  onSelectQuickPhrase?: (phrase: QuickPhrase) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  selectedCategoryId,
  cards,
  quickPhrases = [],
  onSelectCategory,
  onSelectCard,
  onSelectQuickPhrase,
}) => {
  const isFavoritesTab = selectedCategoryId === 'fav';
  const activeCategory = categories.find((c) => c.id === selectedCategoryId);

  // Lista de abas incluindo a aba fixa "⭐ Favoritos" no início
  const allTabs = [
    { id: 'fav', name: '⭐ Favoritos', colorCode: '#F59E0B', position: -1 },
    ...categories,
  ];

  const handlePressQuickPhrase = (phrase: QuickPhrase) => {
    ExpoSpeechAdapter.speak(phrase.label);
    if (onSelectQuickPhrase) {
      onSelectQuickPhrase(phrase);
    }
  };

  return (
    <View style={styles.container}>
      {/* Abas de Categorias */}
      <View style={styles.categoriesBar}>
        <FlatList
          horizontal
          data={allTabs}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            const isSelected = item.id === selectedCategoryId;
            return (
              <TouchableOpacity
                style={[
                  styles.categoryTab,
                  { backgroundColor: item.colorCode },
                  isSelected && styles.selectedCategoryTab,
                ]}
                onPress={() => onSelectCategory(item.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.categoryText}>{item.name}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Grid de Cartões ou Frases Favoritas */}
      {isFavoritesTab ? (
        <FlatList
          data={quickPhrases}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.quickPhraseTile, { borderColor: item.colorCode }]}
              onPress={() => handlePressQuickPhrase(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.quickPhraseStar}>⭐</Text>
              <Text style={styles.quickPhraseLabel}>{item.label}</Text>
              <Text style={styles.quickPhraseSubtext}>{item.cards.length} cartões</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Nenhum atalho favorito salvo ainda.{'\n'}Monte uma frase e toque na estrela ⭐ para salvar!
              </Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={cards}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.gridContent}
          renderItem={({ item }) => (
            <CardTile
              card={item}
              colorCode={activeCategory?.colorCode}
              onPress={onSelectCard}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum cartão cadastrado nesta categoria.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoriesBar: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    marginRight: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  selectedCategoryTab: {
    borderWidth: 3,
    borderColor: '#1E293B',
    transform: [{ scale: 1.05 }],
  },
  categoryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  gridContent: {
    padding: 8,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
  quickPhraseTile: {
    width: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: '2.5%',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    elevation: 3,
  },
  quickPhraseStar: {
    fontSize: 24,
    marginBottom: 6,
  },
  quickPhraseLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
  },
  quickPhraseSubtext: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
});
