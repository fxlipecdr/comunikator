import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SyncApiClient } from '../../../infrastructure/api/syncApiClient';
import { User } from '../../../domain/entities/User';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose, onAuthSuccess }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const api = new SyncApiClient();

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Preencha o e-mail e a senha.');
      return;
    }

    setLoading(true);
    try {
      const endpoint = isRegisterMode ? '/api/v1/auth/register' : '/api/v1/auth/login';
      const baseUrl = api['baseUrl'] || 'http://localhost:8000';

      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Falha na autenticação.');
      }

      const authenticatedUser: User = {
        id: data.user_id,
        email: data.email,
        isPremium: data.is_premium,
      };

      onAuthSuccess(authenticatedUser, data.token);
      Alert.alert('Sucesso!', isRegisterMode ? 'Conta criada com sucesso!' : 'Login realizado com sucesso!');
      onClose();
    } catch (error: any) {
      Alert.alert('Erro no Acesso', error.message || 'Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>
            {isRegisterMode ? '📝 Criar Conta de Responsável' : '🔑 Entrar na Conta'}
          </Text>
          <Text style={styles.subtitle}>
            Acesse com seu e-mail para ativar o backup automático na nuvem dos cartões e preferências.
          </Text>

          <Text style={styles.label}>E-mail dos Pais</Text>
          <TextInput
            style={styles.input}
            placeholder="pais@exemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Senha de Acesso</Text>
          <TextInput
            style={styles.input}
            placeholder="Sua senha secreta"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleAuth} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitBtnText}>
                {isRegisterMode ? 'Criar Conta Gratuita' : 'Entrar na Conta'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toggleModeBtn}
            onPress={() => setIsRegisterMode((prev) => !prev)}
          >
            <Text style={styles.toggleModeText}>
              {isRegisterMode
                ? 'Já tem uma conta? Clique aqui para Entrar'
                : 'Não tem conta? Clique aqui para Criar Grátis'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
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
  container: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    elevation: 8,
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
    lineHeight: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 16,
  },
  submitBtn: {
    backgroundColor: '#2563EB',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  toggleModeBtn: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  toggleModeText: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 13,
  },
  cancelBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: '#64748B',
    fontWeight: '600',
  },
});
