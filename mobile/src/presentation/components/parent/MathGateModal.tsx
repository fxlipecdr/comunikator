import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface MathGateModalProps {
  visible: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export const MathGateModal: React.FC<MathGateModalProps> = ({ visible, onSuccess, onCancel }) => {
  const [mode, setMode] = useState<'math' | 'pin'>('math');
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [pinAnswer, setPinAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const CUSTOM_PIN = '1234';

  useEffect(() => {
    if (visible) {
      generateChallenge();
    }
  }, [visible]);

  const generateChallenge = () => {
    const n1 = Math.floor(Math.random() * 8) + 3;
    const n2 = Math.floor(Math.random() * 8) + 2;
    setNum1(n1);
    setNum2(n2);
    setUserAnswer('');
    setPinAnswer('');
    setErrorMsg('');
  };

  const handleVerify = () => {
    if (mode === 'math') {
      const expected = num1 + num2;
      const inputNum = parseInt(userAnswer.trim(), 10);

      if (isNaN(inputNum)) {
        setErrorMsg('Por favor, insira um número válido.');
        return;
      }

      if (inputNum === expected) {
        setErrorMsg('');
        onSuccess();
      } else {
        setErrorMsg('Resposta incorreta. Tente novamente.');
        generateChallenge();
      }
    } else {
      if (pinAnswer.trim() === CUSTOM_PIN) {
        setErrorMsg('');
        onSuccess();
      } else {
        setErrorMsg('PIN de segurança incorreto.');
        setPinAnswer('');
      }
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>🔒 Acesso dos Responsáveis</Text>
          
          {/* Seletor de Modo */}
          <View style={styles.modeTabs}>
            <TouchableOpacity
              style={[styles.modeTab, mode === 'math' && styles.selectedModeTab]}
              onPress={() => {
                setMode('math');
                setErrorMsg('');
              }}
            >
              <Text style={[styles.modeTabText, mode === 'math' && styles.selectedModeTabText]}>
                ➕ Desafio
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeTab, mode === 'pin' && styles.selectedModeTab]}
              onPress={() => {
                setMode('pin');
                setErrorMsg('');
              }}
            >
              <Text style={[styles.modeTabText, mode === 'pin' && styles.selectedModeTabText]}>
                🔑 PIN Fixo (1234)
              </Text>
            </TouchableOpacity>
          </View>

          {mode === 'math' ? (
            <>
              <Text style={styles.subtitle}>
                Resolva o cálculo abaixo para acessar a área administrativa:
              </Text>
              <View style={styles.challengeBox}>
                <Text style={styles.challengeText}>
                  Quanto é {num1} + {num2} ?
                </Text>
              </View>
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                placeholder="Digite o resultado"
                value={userAnswer}
                onChangeText={setUserAnswer}
                autoFocus
              />
            </>
          ) : (
            <>
              <Text style={styles.subtitle}>Digite o seu PIN de Segurança de 4 dígitos:</Text>
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                secureTextEntry
                maxLength={4}
                placeholder="****"
                value={pinAnswer}
                onChangeText={setPinAnswer}
                autoFocus
              />
            </>
          )}

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleVerify}>
              <Text style={styles.confirmButtonText}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    width: '100%',
  },
  modeTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  selectedModeTab: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  modeTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  selectedModeTabText: {
    color: '#2563EB',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
  },
  challengeBox: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
  },
  challengeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#CBD5E1',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 12,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    marginBottom: 12,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 8,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F1F5F9',
  },
  cancelButtonText: {
    color: '#64748B',
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#2563EB',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
