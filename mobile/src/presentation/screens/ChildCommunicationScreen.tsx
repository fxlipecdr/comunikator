import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Category } from '../../domain/entities/Category';
import { AACCard } from '../../domain/entities/Card';
import { QuickPhrase } from '../../domain/entities/QuickPhrase';
import { SQLiteCategoryRepository } from '../../infrastructure/database/SQLiteCategoryRepository';
import { SQLiteCardRepository } from '../../infrastructure/database/SQLiteCardRepository';
import { SQLiteQuickPhraseRepository } from '../../infrastructure/database/SQLiteQuickPhraseRepository';
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
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>('fav');
  const [cards, setCards] = useState<AACCard[]>([]);
  const [quickPhrases, setQuickPhrases] = useState<QuickPhrase[]>([]);
  const [selectedCards, setSelectedCards] = useState<AACCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMathGate, setShowMathGate] = useState(false);

  const categoryRepo = new SQLiteCategoryRepository();
  const cardRepo = new SQLiteCardRepository();
  const quickPhraseRepo = new SQLiteQuickPhraseRepository();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await runMigrations();
      const loadedCategories = await categoryRepo.getAll();
      const loadedQuickPhrases = await quickPhraseRepo.getAll();

      setCategories(loadedCategories);
      setQuickPhrases(loadedQuickPhrases);

      if (loadedCategories.length > 0) {
        const firstCatId = loadedCategories[0].id;
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
    if (categoryId !== 'fav') {
      const loadedCards = await cardRepo.getByCategory(categoryId);
      setCards(loadedCards);
    }
  };

  const handleSelectCard = (card: AACCard) => {
    setSelectedCards((prev) => [...prev, card]);
  };

  const handleSelectQuickPhrase = (phrase: QuickPhrase) => {
    setSelectedCards(phrase.cards);
  };

  const handleSaveFavorite = async () => {
    if (selectedCards.length === 0) return;

    const phraseLabel = selectedCards.map((c) => c.label).join(' ');
    const newPhrase: Omit<QuickPhrase, 'createdAt'> = {
      id: `qp-${Date.now()}`,
      label: phraseLabel,
      cards: selectedCards,
      colorCode: '#F59E0B',
    };

    const saved = await quickPhraseRepo.create(newPhrase);
    setQuickPhrases((prev) => [saved, ...prev]);
    Alert.alert('⭐ Frase Favoritada!', `O atalho "${phraseLabel}" foi adicionado às suas Frases Favoritas.`);
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
      
      {/* Topo com título e portão parental */}
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

      {/* Barra de Frases */}
      <SentenceBar
        cards={selectedCards}
        onRemoveCard={handleRemoveCard}
        onClearAll={handleClearAll}
        onSaveFavorite={handleSaveFavorite}
      />

      {/* Grid de Categorias / Favoritos */}
      <CategoryGrid
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        cards={cards}
        quickPhrases={quickPhrases}
        onSelectCategory={handleSelectCategory}
        onSelectCard={handleSelectCard}
        onSelectQuickPhrase={handleSelectQuickPhrase}
      />

      {/* Modal de Desafio Matemático */}
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
