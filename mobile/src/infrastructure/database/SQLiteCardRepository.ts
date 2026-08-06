import { ICardRepository } from '../../domain/repositories/ICardRepository';
import { AACCard } from '../../domain/entities/Card';
import { getDatabase } from './sqliteClient';

export class SQLiteCardRepository implements ICardRepository {
  async getByCategory(categoryId: string): Promise<AACCard[]> {
    try {
      const db = await getDatabase();
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
      return [];
    }
  }

  async getAll(): Promise<AACCard[]> {
    try {
      const db = await getDatabase();
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
      return [];
    }
  }

  async create(card: Omit<AACCard, 'createdAt' | 'updatedAt'>): Promise<AACCard> {
    const db = await getDatabase();
    await db.runAsync(
      'INSERT INTO cards (id, category_id, label, image_uri, position) VALUES (?, ?, ?, ?, ?);',
      [card.id, card.categoryId, card.label, card.imageUri, card.position]
    );

    return {
      ...card,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async update(card: AACCard): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      'UPDATE cards SET label = ?, image_uri = ?, position = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?;',
      [card.label, card.imageUri, card.position, card.id]
    );
  }

  async delete(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM cards WHERE id = ?;', [id]);
  }
}
