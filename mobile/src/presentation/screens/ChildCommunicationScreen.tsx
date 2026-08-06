import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Category } from '../../domain/entities/Category';
import { AACCard } from '../../domain/entities/Card';
import { SQLiteCategoryRepository } from '../../infrastructure/database/SQLiteCategoryRepository';
import { SQLiteCardRepository } from '../../infrastructure/database/SQLiteCardRepository';
import { runMigrations } from '../../infrastructure/database/migrations';
import { SentenceBar } from '../components/child/SentenceBar';
import { CategoryGrid } from '../components/child/CategoryGrid';
import { MathGateModal } from '../components/parent/MathGateModal';

interface ChildCommunicationScreenProps {
  onOpenParentSettings: () => void;
}

export const ChildCommunicationScreen: React.FC<ChildCommunicationScreenProps> = ({
  onOpenParentSettings,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [cards, setCards] = useState<AACCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<AACCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMathGate, setShowMathGate] = useState(false);

  const categoryRepo = new SQLiteCategoryRepository();
  const cardRepo = new SQLiteCardRepository();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await runMigrations();
      const loadedCategories = await categoryRepo.getAll();
      setCategories(loadedCategories);

      if (loadedCategories.length > 0) {
        const firstCatId = loadedCategories[0].id;
        setSelectedCategoryId(firstCatId);
        const loadedCards = await cardRepo.getByCategory(firstCatId);
        setCards(loadedCards);
      }
    } catch (error) {
      console.error('[ChildCommunicationScreen] Erro ao carregar dados offline do SQLite:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategory = async (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    const loadedCards = await cardRepo.getByCategory(categoryId);
    setCards(loadedCards);
  };

  const handleSelectCard = (card: AACCard) => {
    setSelectedCards((prev) => [...prev, card]);
  };

  const handleRemoveCard = (indexToRemove: number) => {
    setSelectedCards((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleClearAll = () => {
    setSelectedCards([]);
  };

  const handleParentGateSuccess = () => {
    setShowMathGate(false);
    onOpenParentSettings();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Carregando prancha de comunicação...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      
      {/* Botão sutil e discreto para acesso dos pais */}
      <View style={styles.headerBar}>
        <Text style={styles.appTitle}>Comunikator</Text>
        <TouchableOpacity
          style={styles.parentGateButton}
          onPress={() => setShowMathGate(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.parentGateText}>⚙️ Responsáveis</Text>
        </TouchableOpacity>
      </View>

      {/* Barra de Frases com Voz */}
      <SentenceBar
        cards={selectedCards}
        onRemoveCard={handleRemoveCard}
        onClearAll={handleClearAll}
      />

      {/* Prancha / Grid de Categorias e Cartões */}
      <CategoryGrid
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        cards={cards}
        onSelectCategory={handleSelectCategory}
        onSelectCard={handleSelectCard}
      />

      {/* Modal de Desafio Matemático (Controle Parental) */}
      <MathGateModal
        visible={showMathGate}
        onSuccess={handleParentGateSuccess}
        onCancel={() => setShowMathGate(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#475569',
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  parentGateButton: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  parentGateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
});
