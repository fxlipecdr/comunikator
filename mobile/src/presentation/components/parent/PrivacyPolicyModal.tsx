import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface PrivacyPolicyModalProps {
  visible: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Compliance LGPD & COPPA Infantil</Text>
            </View>

            <Text style={styles.title}>🔒 Política de Privacidade</Text>
            <Text style={styles.date}>Última atualização: Agosto de 2026</Text>

            <Text style={styles.paragraph}>
              O <Text style={styles.bold}>Comunikator</Text> foi desenvolvido sob os princípios mais estritos de proteção à infância e segurança dos dados pessoais.
            </Text>

            <Text style={styles.sectionTitle}>1. Modo 100% Offline da Área da Criança</Text>
            <Text style={styles.paragraph}>
              Toda a navegação, cartões selecionados, frases e reprodução de vozes na Área da Criança são processadas inteiramente de forma local (offline) no dispositivo. Nenhum dado comportamental ou de voz da criança é enviado para a internet.
            </Text>

            <Text style={styles.sectionTitle}>2. Não Coleta de Dados Pessoais de Menores</Text>
            <Text style={styles.paragraph}>
              Em estrito cumprimento às normas internacionais do COPPA e à Lei Geral de Proteção de Dados (LGPD), não coletamos, rastreamos ou solicitamos qualquer informação identificável de menores.
            </Text>

            <Text style={styles.sectionTitle}>3. Dados dos Responsáveis (Backup Opcional)</Text>
            <Text style={styles.paragraph}>
              Para os pais que optam pela assinatura Premium, armazenamos com criptografia de ponta a ponta apenas o e-mail do responsável e as personalizações das pranchas para fins de backup e restauração em novos aparelhos.
            </Text>

            <Text style={styles.sectionTitle}>4. Exibição de Anúncios Responsáveis</Text>
            <Text style={styles.paragraph}>
              Exibimos banners patrocinados pelo Google AdMob exclusivamente na Área dos Pais para usuários da versão gratuita, seguindo a classificação indicativa Livre (G-Rating).
            </Text>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>Entendi e Aceito</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    elevation: 6,
  },
  badge: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'center',
    marginBottom: 8,
  },
  badgeText: {
    color: '#3730A3',
    fontWeight: 'bold',
    fontSize: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 12,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  closeBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
