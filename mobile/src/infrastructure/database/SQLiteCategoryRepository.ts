import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';
import { Category } from '../../domain/entities/Category';
import { getDatabase } from './sqliteClient';

export class SQLiteCategoryRepository implements ICategoryRepository {
  async getAll(): Promise<Category[]> {
    try {
      const db = await getDatabase();
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
      return [];
    }
  }

  async getById(id: string): Promise<Category | null> {
    try {
      const db = await getDatabase();
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
    const db = await getDatabase();
    await db.runAsync(
      'INSERT INTO categories (id, name, color_code, position) VALUES (?, ?, ?, ?);',
      [category.id, category.name, category.colorCode, category.position]
    );

    return {
      ...category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async update(category: Category): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      'UPDATE categories SET name = ?, color_code = ?, position = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?;',
      [category.name, category.colorCode, category.position, category.id]
    );
  }

  async delete(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM categories WHERE id = ?;', [id]);
  }
}
