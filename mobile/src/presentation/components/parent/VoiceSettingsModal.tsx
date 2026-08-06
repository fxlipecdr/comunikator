import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SpeechConfig } from '../../../domain/entities/SpeechConfig';
import { ExpoSpeechAdapter } from '../../../infrastructure/speech/ExpoSpeechAdapter';

interface VoiceSettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

const RATE_OPTIONS = [
  { label: '0.6x (Lento)', value: 0.6 },
  { label: '0.85x (Recomendado)', value: 0.85 },
  { label: '1.0x (Normal)', value: 1.0 },
  { label: '1.2x (Rápido)', value: 1.2 },
];

const PITCH_OPTIONS = [
  { label: '0.8 (Grave)', value: 0.8 },
  { label: '1.0 (Natural)', value: 1.0 },
  { label: '1.2 (Infantil/Agudo)', value: 1.2 },
];

const LANG_OPTIONS = [
  { label: '🇧🇷 Português (Brasil)', value: 'pt-BR' },
  { label: '🇵🇹 Português (Portugal)', value: 'pt-PT' },
  { label: '🇺🇸 Inglês (US)', value: 'en-US' },
];

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({ visible, onClose }) => {
  const current = ExpoSpeechAdapter.getConfig();

  const [rate, setRate] = useState<number>(current.rate);
  const [pitch, setPitch] = useState<number>(current.pitch);
  const [language, setLanguage] = useState<string>(current.language);

  const handleTestVoice = () => {
    ExpoSpeechAdapter.speak('Olá! Esta é a minha voz configurada para comunicação.', {
      rate,
      pitch,
      language,
    });
  };

  const handleSave = () => {
    const updatedConfig: SpeechConfig = { rate, pitch, language };
    ExpoSpeechAdapter.setConfig(updatedConfig);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>🗣️ Ajustes do Motor de Voz (TTS)</Text>
            <Text style={styles.subtitle}>
              Personalize a velocidade e o tom da voz de acordo com a preferência e facilidade auditiva da criança.
            </Text>

            {/* Velocidade da Fala */}
            <Text style={styles.sectionLabel}>Velocidade da Fala (Ritmo)</Text>
            <View style={styles.optionsRow}>
              {RATE_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.chip, rate === opt.value && styles.selectedChip]}
                  onPress={() => setRate(opt.value)}
                >
                  <Text style={[styles.chipText, rate === opt.value && styles.selectedChipText]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Tom da Voz */}
            <Text style={styles.sectionLabel}>Tom da Voz (Pitch)</Text>
            <View style={styles.optionsRow}>
              {PITCH_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.chip, pitch === opt.value && styles.selectedChip]}
                  onPress={() => setPitch(opt.value)}
                >
                  <Text style={[styles.chipText, pitch === opt.value && styles.selectedChipText]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Idioma */}
            <Text style={styles.sectionLabel}>Idioma da Fala</Text>
            <View style={styles.optionsRow}>
              {LANG_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.chip, language === opt.value && styles.selectedChip]}
                  onPress={() => setLanguage(opt.value)}
                >
                  <Text style={[styles.chipText, language === opt.value && styles.selectedChipText]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Botão Testar */}
            <TouchableOpacity style={styles.testBtn} onPress={handleTestVoice} activeOpacity={0.8}>
              <Text style={styles.testBtnText}>🔊 Testar Voz com Esta Configuração</Text>
            </TouchableOpacity>

            {/* Botões de Ação */}
            <View style={styles.buttonsRow}>
              <TouchableOpacity style={[styles.button, styles.cancelBtn]} onPress={onClose}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.saveBtn]} onPress={handleSave}>
                <Text style={styles.saveText}>Salvar Ajustes</Text>
              </TouchableOpacity>
            </View>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 8,
    marginTop: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  selectedChip: {
    backgroundColor: '#2563EB',
    borderColor: '#1D4ED8',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  selectedChipText: {
    color: '#FFFFFF',
  },
  testBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 16,
  },
  testBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#F1F5F9',
  },
  cancelText: {
    color: '#64748B',
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: '#2563EB',
  },
  saveText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
