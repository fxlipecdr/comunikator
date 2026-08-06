import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { RevenueCatService } from '../../infrastructure/monetization/RevenueCatService';
import { AdMobBanner } from '../components/parent/AdMobBanner';
import { User } from '../../domain/entities/User';

interface ParentSettingsScreenProps {
  onBackToChildMode: () => void;
}

export const ParentSettingsScreen: React.FC<ParentSettingsScreenProps> = ({ onBackToChildMode }) => {
  const [user, setUser] = useState<User>({
    id: 'usr-local-1',
    email: 'pais@exemplo.com',
    isPremium: false,
  });

  const [purchasing, setPurchasing] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    RevenueCatService.setup(user.id);
  }, []);

  const handleUpgradeOrSync = async () => {
    if (user.isPremium) {
      // Já é Premium -> Executar Backup na Nuvem
      handleCloudSync();
    } else {
      // Usuário Gratuito -> Acionar Paywall / Checkout do RevenueCat
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
          // Mockup para testes caso ofertas não venham da store nativa
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
      // Simulação de chamada para a API Python / PostgreSQL
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert('Sincronização Concluída', 'Seus cartões e categorias foram salvos com segurança na nuvem PostgreSQL.');
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
          
          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Em breve', 'Modal de adição de cartão')}>
            <Text style={styles.menuItemText}>➕ Adicionar Novo Cartão de CAA</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Em breve', 'Modal de edição de categoria')}>
            <Text style={styles.menuItemText}>📁 Gerenciar Categorias & Cores</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Voz Nativa', 'Configurações do Expo Speech (Velocidade e Tom)')}>
            <Text style={styles.menuItemText}>🗣️ Ajustes do Motor de Voz (TTS)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 12,
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
});
