import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Category } from '../../../domain/entities/Category';
import { AACCard } from '../../../domain/entities/Card';
import { CardTile } from './CardTile';

interface CategoryGridProps {
  categories: Category[];
  selectedCategoryId: string | null;
  cards: AACCard[];
  onSelectCategory: (categoryId: string) => void;
  onSelectCard: (card: AACCard) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  selectedCategoryId,
  cards,
  onSelectCategory,
  onSelectCard,
}) => {
  const activeCategory = categories.find((c) => c.id === selectedCategoryId);

  return (
    <View style={styles.container}>
      {/* Abas de Categorias */}
      <View style={styles.categoriesBar}>
        <FlatList
          horizontal
          data={categories}
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

      {/* Grid de Cartões da Categoria Selecionada */}
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
    fontSize: 16,
    color: '#64748B',
  },
});
