import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';
import { Category } from '../../domain/entities/Category';
import { getDatabase } from './sqliteClient';
import { Platform } from 'react-native';

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Necessidades', colorCode: '#FF6B6B', position: 0 },
  { id: 'cat-2', name: 'Sentimentos', colorCode: '#4ECDC4', position: 1 },
  { id: 'cat-3', name: 'Ações', colorCode: '#FFE66D', position: 2 },
  { id: 'cat-4', name: 'Alimentos', colorCode: '#FF9F43', position: 3 },
];

export class SQLiteCategoryRepository implements ICategoryRepository {
  private memoryCategories: Category[] = [...INITIAL_CATEGORIES];

  async getAll(): Promise<Category[]> {
    if (Platform.OS === 'web') {
      return this.memoryCategories;
    }

    try {
      const db = await getDatabase();
      if (!db) return this.memoryCategories;

      const rows = await db.getAllAsync<{
        id: string;
        name: string;
        color_code: string;
        position: number;
        created_at: string;
        updated_at: string;
      }>('SELECT * FROM categories ORDER BY position ASC;');

      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        colorCode: r.color_code,
        position: r.position,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }));
    } catch (error) {
      console.error('[SQLiteCategoryRepository] Erro ao buscar categorias:', error);
      return this.memoryCategories;
    }
  }

  async getById(id: string): Promise<Category | null> {
    if (Platform.OS === 'web') {
      return this.memoryCategories.find((c) => c.id === id) || null;
    }

    try {
      const db = await getDatabase();
      if (!db) return null;

      const row = await db.getFirstAsync<{
        id: string;
        name: string;
        color_code: string;
        position: number;
        created_at: string;
        updated_at: string;
      }>('SELECT * FROM categories WHERE id = ?;', [id]);

      if (!row) return null;

      return {
        id: row.id,
        name: row.name,
        colorCode: row.color_code,
        position: row.position,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    } catch (error) {
      console.error(`[SQLiteCategoryRepository] Erro ao buscar categoria id=${id}:`, error);
      return null;
    }
  }

  async create(category: Omit<Category, 'createdAt' | 'updatedAt'>): Promise<Category> {
    const newCat: Category = {
      ...category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (Platform.OS === 'web') {
      this.memoryCategories.push(newCat);
      return newCat;
    }

    try {
      const db = await getDatabase();
      if (db) {
        await db.runAsync(
          'INSERT INTO categories (id, name, color_code, position) VALUES (?, ?, ?, ?);',
          [category.id, category.name, category.colorCode, category.position]
        );
      }
    } catch (e) {
      console.error('[SQLiteCategoryRepository] Erro no INSERT:', e);
    }

    return newCat;
  }

  async update(category: Category): Promise<void> {
    if (Platform.OS === 'web') {
      const index = this.memoryCategories.findIndex((c) => c.id === category.id);
      if (index !== -1) this.memoryCategories[index] = category;
      return;
    }

    const db = await getDatabase();
    if (db) {
      await db.runAsync(
        'UPDATE categories SET name = ?, color_code = ?, position = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?;',
        [category.name, category.colorCode, category.position, category.id]
      );
    }
  }

  async delete(id: string): Promise<void> {
    if (Platform.OS === 'web') {
      this.memoryCategories = this.memoryCategories.filter((c) => c.id !== id);
      return;
    }

    const db = await getDatabase();
    if (db) {
      await db.runAsync('DELETE FROM categories WHERE id = ?;', [id]);
    }
  }
}
