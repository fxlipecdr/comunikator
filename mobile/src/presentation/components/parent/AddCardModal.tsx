import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Category } from '../../../domain/entities/Category';
import { AACCard } from '../../../domain/entities/Card';
import { SQLiteCardRepository } from '../../../infrastructure/database/SQLiteCardRepository';

interface AddCardModalProps {
  visible: boolean;
  categories: Category[];
  defaultCategoryId?: string;
  onClose: () => void;
  onCardAdded: (newCard: AACCard) => void;
}

export const AddCardModal: React.FC<AddCardModalProps> = ({
  visible,
  categories,
  defaultCategoryId,
  onClose,
  onCardAdded,
}) => {
  const [label, setLabel] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    defaultCategoryId || (categories.length > 0 ? categories[0].id : '')
  );
  const [imageUri, setImageUri] = useState('');
  const [saving, setSaving] = useState(false);

  const cardRepo = new SQLiteCardRepository();

  const handlePickFromGallery = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permissão necessária', 'É preciso permitir acesso à galeria para escolher uma imagem.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('[AddCardModal] Erro ao selecionar imagem:', error);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permissão necessária', 'É preciso permitir acesso à câmera para tirar fotos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('[AddCardModal] Erro ao capturar foto:', error);
    }
  };

  const handleSave = async () => {
    if (!label.trim()) {
      Alert.alert('Atenção', 'Digite a palavra ou rótulo do cartão (ex: Suco, Abraço).');
      return;
    }

    if (!selectedCategoryId) {
      Alert.alert('Atenção', 'Selecione uma categoria para o cartão.');
      return;
    }

    const finalImageUri = imageUri.trim() || 'https://img.icons8.com/color/96/picture.png';

    setSaving(true);
    try {
      const newCard: Omit<AACCard, 'createdAt' | 'updatedAt'> = {
        id: `card-${Date.now()}`,
        categoryId: selectedCategoryId,
        label: label.trim(),
        imageUri: finalImageUri,
        position: Date.now(),
      };

      const created = await cardRepo.create(newCard);
      setLabel('');
      setImageUri('');
      onCardAdded(created);
      onClose();
    } catch (error) {
      console.error('[AddCardModal] Erro ao salvar cartão:', error);
      Alert.alert('Erro', 'Não foi possível criar o cartão.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>🃏 Criar Novo Cartão CAA</Text>

            {/* Rótulo / Palavra */}
            <Text style={styles.label}>Rótulo do Cartão (Palavra falada)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Suco de Laranja, Quero Passear..."
              value={label}
              onChangeText={setLabel}
            />

            {/* Seleção de Categoria */}
            <Text style={styles.label}>Categoria</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesRow}>
              {categories.map((cat) => {
                const isSelected = cat.id === selectedCategoryId;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryChip,
                      { backgroundColor: cat.colorCode },
                      isSelected && styles.selectedCategoryChip,
                    ]}
                    onPress={() => setSelectedCategoryId(cat.id)}
                  >
                    <Text style={styles.categoryChipText}>{cat.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Preview da Imagem */}
            <Text style={styles.label}>Imagem do Cartão</Text>
            <View style={styles.previewBox}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="contain" />
              ) : (
                <Text style={styles.previewPlaceholder}>Nenhuma imagem selecionada</Text>
              )}
            </View>

            {/* Botões de Seleção de Foto */}
            <View style={styles.imageSourceRow}>
              <TouchableOpacity style={styles.sourceButton} onPress={handleTakePhoto}>
                <Text style={styles.sourceButtonText}>📷 Tirar Foto</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.sourceButton} onPress={handlePickFromGallery}>
                <Text style={styles.sourceButtonText}>🖼️ Galeria</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.orText}>Ou cole o Link / URL da Imagem:</Text>
            <TextInput
              style={styles.input}
              placeholder="https://exemplo.com/imagem.png"
              value={imageUri}
              onChangeText={setImageUri}
            />

            {/* Botões de Ação */}
            <View style={styles.buttonsRow}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
                disabled={saving}
              >
                <Text style={styles.saveText}>{saving ? 'Salvando...' : 'Criar Cartão'}</Text>
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
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 12,
  },
  categoriesRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    opacity: 0.7,
  },
  selectedCategoryChip: {
    opacity: 1,
    borderWidth: 2,
    borderColor: '#0F172A',
    transform: [{ scale: 1.05 }],
  },
  categoryChipText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  previewBox: {
    width: '100%',
    height: 120,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  previewImage: {
    width: 100,
    height: 100,
  },
  previewPlaceholder: {
    color: '#94A3B8',
    fontSize: 14,
  },
  imageSourceRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  sourceButton: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  sourceButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  orText: {
    fontSize: 12,
    color: '#64748B',
    marginVertical: 4,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
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
  cancelText: {
    color: '#64748B',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#2563EB',
  },
  saveText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
