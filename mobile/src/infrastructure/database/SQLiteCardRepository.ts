import { ICardRepository } from '../../domain/repositories/ICardRepository';
import { AACCard } from '../../domain/entities/Card';
import { getDatabase } from './sqliteClient';
import { Platform } from 'react-native';

const INITIAL_CARDS: AACCard[] = [
  { id: 'card-1', categoryId: 'cat-1', label: 'Quero', imageUri: 'https://img.icons8.com/color/96/hand.png', position: 0 },
  { id: 'card-2', categoryId: 'cat-1', label: 'Água', imageUri: 'https://img.icons8.com/color/96/glass-of-water.png', position: 1 },
  { id: 'card-3', categoryId: 'cat-1', label: 'Banheiro', imageUri: 'https://img.icons8.com/color/96/toilet.png', position: 2 },
  { id: 'card-4', categoryId: 'cat-1', label: 'Ajuda', imageUri: 'https://img.icons8.com/color/96/helping-hand.png', position: 3 },
  { id: 'card-5', categoryId: 'cat-2', label: 'Feliz', imageUri: 'https://img.icons8.com/color/96/happy.png', position: 0 },
  { id: 'card-6', categoryId: 'cat-2', label: 'Cansado', imageUri: 'https://img.icons8.com/color/96/sleeping.png', position: 1 },
  { id: 'card-7', categoryId: 'cat-2', label: 'Dói', imageUri: 'https://img.icons8.com/color/96/bandage.png', position: 2 },
  { id: 'card-8', categoryId: 'cat-3', label: 'Comer', imageUri: 'https://img.icons8.com/color/96/eating.png', position: 0 },
  { id: 'card-9', categoryId: 'cat-3', label: 'Brincar', imageUri: 'https://img.icons8.com/color/96/toy.png', position: 1 },
  { id: 'card-10', categoryId: 'cat-3', label: 'Dormir', imageUri: 'https://img.icons8.com/color/96/bed.png', position: 2 },
];

export class SQLiteCardRepository implements ICardRepository {
  private memoryCards: AACCard[] = [...INITIAL_CARDS];

  async getByCategory(categoryId: string): Promise<AACCard[]> {
    if (Platform.OS === 'web') {
      return this.memoryCards.filter((c) => c.categoryId === categoryId);
    }

    try {
      const db = await getDatabase();
      if (!db) return this.memoryCards.filter((c) => c.categoryId === categoryId);

      const rows = await db.getAllAsync<{
        id: string;
        category_id: string;
        label: string;
        image_uri: string;
        position: number;
        created_at: string;
        updated_at: string;
      }>('SELECT * FROM cards WHERE category_id = ? ORDER BY position ASC;', [categoryId]);

      return rows.map((r) => ({
        id: r.id,
        categoryId: r.category_id,
        label: r.label,
        imageUri: r.image_uri,
        position: r.position,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }));
    } catch (error) {
      console.error(`[SQLiteCardRepository] Erro ao buscar cartões da categoria ${categoryId}:`, error);
      return this.memoryCards.filter((c) => c.categoryId === categoryId);
    }
  }

  async getAll(): Promise<AACCard[]> {
    if (Platform.OS === 'web') {
      return this.memoryCards;
    }

    try {
      const db = await getDatabase();
      if (!db) return this.memoryCards;

      const rows = await db.getAllAsync<{
        id: string;
        category_id: string;
        label: string;
        image_uri: string;
        position: number;
        created_at: string;
        updated_at: string;
      }>('SELECT * FROM cards ORDER BY position ASC;');

      return rows.map((r) => ({
        id: r.id,
        categoryId: r.category_id,
        label: r.label,
        imageUri: r.image_uri,
        position: r.position,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }));
    } catch (error) {
      console.error('[SQLiteCardRepository] Erro ao buscar todos os cartões:', error);
      return this.memoryCards;
    }
  }

  async create(card: Omit<AACCard, 'createdAt' | 'updatedAt'>): Promise<AACCard> {
    const newCard: AACCard = {
      ...card,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (Platform.OS === 'web') {
      this.memoryCards.push(newCard);
      return newCard;
    }

    try {
      const db = await getDatabase();
      if (db) {
        await db.runAsync(
          'INSERT INTO cards (id, category_id, label, image_uri, position) VALUES (?, ?, ?, ?, ?);',
          [card.id, card.categoryId, card.label, card.imageUri, card.position]
        );
      }
    } catch (e) {
      console.error('[SQLiteCardRepository] Erro no INSERT:', e);
    }

    return newCard;
  }

  async update(card: AACCard): Promise<void> {
    if (Platform.OS === 'web') {
      const index = this.memoryCards.findIndex((c) => c.id === card.id);
      if (index !== -1) this.memoryCards[index] = card;
      return;
    }

    const db = await getDatabase();
    if (db) {
      await db.runAsync(
        'UPDATE cards SET label = ?, image_uri = ?, position = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?;',
        [card.label, card.imageUri, card.position, card.id]
      );
    }
  }

  async delete(id: string): Promise<void> {
    if (Platform.OS === 'web') {
      this.memoryCards = this.memoryCards.filter((c) => c.id !== id);
      return;
    }

    const db = await getDatabase();
    if (db) {
      await db.runAsync('DELETE FROM cards WHERE id = ?;', [id]);
    }
  }
}
