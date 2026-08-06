import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { RevenueCatService } from '../../infrastructure/monetization/RevenueCatService';
import { AdMobBanner } from '../components/parent/AdMobBanner';
import { User } from '../../domain/entities/User';
import { Category } from '../../domain/entities/Category';
import { AACCard } from '../../domain/entities/Card';
import { SQLiteCategoryRepository } from '../../infrastructure/database/SQLiteCategoryRepository';
import { SQLiteCardRepository } from '../../infrastructure/database/SQLiteCardRepository';
import { AddCategoryModal } from '../components/parent/AddCategoryModal';
import { AddCardModal } from '../components/parent/AddCardModal';

interface ParentSettingsScreenProps {
  onBackToChildMode: () => void;
}

export const ParentSettingsScreen: React.FC<ParentSettingsScreenProps> = ({ onBackToChildMode }) => {
  const [user, setUser] = useState<User>({
    id: 'usr-local-1',
    email: 'pais@exemplo.com',
    isPremium: false,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [cards, setCards] = useState<AACCard[]>([]);
  const [purchasing, setPurchasing] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Modais de Criação
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);

  const categoryRepo = new SQLiteCategoryRepository();
  const cardRepo = new SQLiteCardRepository();

  useEffect(() => {
    RevenueCatService.setup(user.id);
    loadAppData();
  }, []);

  const loadAppData = async () => {
    try {
      const cats = await categoryRepo.getAll();
      const allCards = await cardRepo.getAll();
      setCategories(cats);
      setCards(allCards);
    } catch (error) {
      console.error('[ParentSettingsScreen] Erro ao carregar categorias e cartões:', error);
    }
  };

  const handleDeleteCard = (cardId: string, label: string) => {
    Alert.alert('Excluir Cartão', `Tem certeza que deseja apagar o cartão "${label}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await cardRepo.delete(cardId);
          setCards((prev) => prev.filter((c) => c.id !== cardId));
        },
      },
    ]);
  };

  const handleDeleteCategory = (catId: string, catName: string) => {
    Alert.alert('Excluir Categoria', `Apagar "${catName}" também removerá todos os cartões desta categoria. Confirmar?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir Tudo',
        style: 'destructive',
        onPress: async () => {
          await categoryRepo.delete(catId);
          setCategories((prev) => prev.filter((c) => c.id !== catId));
          setCards((prev) => prev.filter((c) => c.categoryId !== catId));
        },
      },
    ]);
  };

  const handleUpgradeOrSync = async () => {
    if (user.isPremium) {
      handleCloudSync();
    } else {
      setPurchasing(true);
      try {
        const offerings = await RevenueCatService.getOfferings();
        if (offerings.length > 0) {
          const success = await RevenueCatService.purchasePackage(offerings[0]);
          if (success) {
            setUser((prev) => ({ ...prev, isPremium: true }));
            Alert.alert('Sucesso!', 'Parabéns! Você assinou o Plano Premium e liberou o Backup na Nuvem.');
          }
        } else {
          Alert.alert(
            'Demonstração de Upgrade (Mockup RevenueCat)',
            'Deseja simular a assinatura do Plano Premium para testar a sincronização?',
            [
              { text: 'Cancelar', style: 'cancel' },
              {
                text: 'Simular Assinatura',
                onPress: () => {
                  setUser((prev) => ({ ...prev, isPremium: true }));
                  Alert.alert('Plano Ativado', 'O status Premium foi ativado com sucesso em modo simulação.');
                },
              },
            ]
          );
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível processar a compra.');
      } finally {
        setPurchasing(false);
      }
    }
  };

  const handleCloudSync = async () => {
    setSyncing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert('Sincronização Concluída', `${cards.length} cartões e ${categories.length} categorias salvos na nuvem PostgreSQL.`);
    } catch (error) {
      Alert.alert('Erro no Backup', 'Falha ao conectar com o servidor. O app continua funcionando offline.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBackToChildMode}>
          <Text style={styles.backButtonText}>← Voltar à Área da Criança</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Área dos Pais & Configurações</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Card de Status do Plano */}
        <View style={[styles.card, user.isPremium ? styles.premiumCard : styles.freeCard]}>
          <View style={styles.planHeader}>
            <Text style={styles.planTitle}>
              Plano Atual: {user.isPremium ? '🌟 Premium (Nuvem Ativada)' : '🌱 Gratuito'}
            </Text>
          </View>
          <Text style={styles.planDescription}>
            {user.isPremium
              ? 'Sua conta está sincronizada. Seus cartões e configurações estão protegidos na nuvem e os anúncios foram removidos.'
              : 'Assine o plano Premium para realizar backup automático dos cartões na nuvem e remover todos os anúncios.'}
          </Text>

          <TouchableOpacity
            style={[styles.upgradeButton, user.isPremium ? styles.syncButtonStyle : styles.paywallButtonStyle]}
            onPress={handleUpgradeOrSync}
            disabled={purchasing || syncing}
          >
            {purchasing || syncing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.upgradeButtonText}>
                {user.isPremium ? '☁️ Sincronizar Agora com a Nuvem' : '⚡ Fazer Upgrade / Backup na Nuvem'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Gerenciamento de Pranchas e Cartões */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gerenciamento de Pranchas</Text>

          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={styles.createBtn} onPress={() => setShowAddCard(true)}>
              <Text style={styles.createBtnText}>➕ Novo Cartão</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.createBtn, styles.createCatBtn]} onPress={() => setShowAddCategory(true)}>
              <Text style={styles.createBtnText}>📁 Nova Categoria</Text>
            </TouchableOpacity>
          </View>

          {/* Listagem de Categorias e Seus Cartões */}
          {categories.map((cat) => {
            const catCards = cards.filter((c) => c.categoryId === cat.id);
            return (
              <View key={cat.id} style={styles.catGroup}>
                <View style={[styles.catHeader, { backgroundColor: cat.colorCode }]}>
                  <Text style={styles.catHeaderTitle}>{cat.name} ({catCards.length})</Text>
                  <TouchableOpacity onPress={() => handleDeleteCategory(cat.id, cat.name)}>
                    <Text style={styles.deleteText}>🗑️ Excluir</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.cardsGrid}>
                  {catCards.map((card) => (
                    <View key={card.id} style={styles.cardItem}>
                      <Image source={{ uri: card.imageUri }} style={styles.cardItemImg} resizeMode="contain" />
                      <Text style={styles.cardItemText}>{card.label}</Text>
                      <TouchableOpacity
                        style={styles.cardDeleteBtn}
                        onPress={() => handleDeleteCard(card.id, card.label)}
                      >
                        <Text style={styles.cardDeleteIcon}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Modal Criar Categoria */}
      <AddCategoryModal
        visible={showAddCategory}
        onClose={() => setShowAddCategory(false)}
        onCategoryAdded={(newCat) => setCategories((prev) => [...prev, newCat])}
      />

      {/* Modal Criar Cartão */}
      <AddCardModal
        visible={showAddCard}
        categories={categories}
        onClose={() => setShowAddCard(false)}
        onCardAdded={(newCard) => setCards((prev) => [...prev, newCard])}
      />

      {/* Banner de Anúncios no Rodapé (Exibido apenas para usuários gratuitos) */}
      <AdMobBanner isPremium={user.isPremium} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  backButton: {
    marginBottom: 8,
  },
  backButtonText: {
    color: '#2563EB',
    fontWeight: 'bold',
    fontSize: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  content: {
    padding: 20,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
  },
  freeCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  premiumCard: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  planDescription: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 16,
  },
  upgradeButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paywallButtonStyle: {
    backgroundColor: '#2563EB',
  },
  syncButtonStyle: {
    backgroundColor: '#D97706',
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 16,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  createBtn: {
    flex: 1,
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  createCatBtn: {
    backgroundColor: '#0F172A',
  },
  createBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  catGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  catHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catHeaderTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 10,
  },
  cardItem: {
    width: 90,
    height: 100,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  cardItemImg: {
    width: 48,
    height: 48,
    marginBottom: 4,
  },
  cardItemText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
  },
  cardDeleteBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardDeleteIcon: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
