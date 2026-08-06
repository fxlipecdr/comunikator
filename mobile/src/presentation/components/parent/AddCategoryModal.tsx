import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Category } from '../../../domain/entities/Category';
import { SQLiteCategoryRepository } from '../../../infrastructure/database/SQLiteCategoryRepository';

interface AddCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onCategoryAdded: (newCategory: Category) => void;
}

const PRESET_COLORS = [
  '#FF6B6B', // Vermelho suave
  '#4ECDC4', // Turquesa
  '#FFE66D', // Amarelo
  '#FF9F43', // Laranja
  '#A855F7', // Roxo
  '#EC4899', // Rosa
  '#3B82F6', // Azul
  '#10B981', // Verde
];

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  visible,
  onClose,
  onCategoryAdded,
}) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [saving, setSaving] = useState(false);

  const categoryRepo = new SQLiteCategoryRepository();

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Atenção', 'Digite um nome para a categoria.');
      return;
    }

    setSaving(true);
    try {
      const newCategory: Omit<Category, 'createdAt' | 'updatedAt'> = {
        id: `cat-${Date.now()}`,
        name: name.trim(),
        colorCode: selectedColor,
        position: Date.now(),
      };

      const created = await categoryRepo.create(newCategory);
      setName('');
      setSelectedColor(PRESET_COLORS[0]);
      onCategoryAdded(created);
      onClose();
    } catch (error) {
      console.error('[AddCategoryModal] Erro ao salvar categoria:', error);
      Alert.alert('Erro', 'Não foi possível salvar a categoria.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>📁 Criar Nova Categoria</Text>

          <Text style={styles.label}>Nome da Categoria</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Brinquedos, Roupas, Pessoas..."
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Cor da Aba</Text>
          <View style={styles.colorsGrid}>
            {PRESET_COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColorCircle,
                ]}
                onPress={() => setSelectedColor(color)}
                activeOpacity={0.8}
              />
            ))}
          </View>

          <View style={styles.buttonsRow}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.saveText}>{saving ? 'Salvando...' : 'Salvar Categoria'}</Text>
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
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
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
    elevation: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    marginBottom: 24,
  },
  colorCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  selectedColorCircle: {
    borderWidth: 4,
    borderColor: '#0F172A',
    transform: [{ scale: 1.15 }],
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
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
