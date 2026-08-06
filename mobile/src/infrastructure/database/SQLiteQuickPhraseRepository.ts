import { QuickPhrase } from '../../domain/entities/QuickPhrase';
import { getDatabase } from './sqliteClient';
import { Platform } from 'react-native';

const INITIAL_QUICK_PHRASES: QuickPhrase[] = [
  {
    id: 'qp-1',
    label: 'Quero Água',
    colorCode: '#FF6B6B',
    cards: [
      { id: 'card-1', categoryId: 'cat-1', label: 'Quero', imageUri: 'https://img.icons8.com/color/96/hand.png', position: 0 },
      { id: 'card-2', categoryId: 'cat-1', label: 'Água', imageUri: 'https://img.icons8.com/color/96/glass-of-water.png', position: 1 },
    ],
  },
  {
    id: 'qp-2',
    label: 'Ir ao Banheiro',
    colorCode: '#4ECDC4',
    cards: [
      { id: 'card-1', categoryId: 'cat-1', label: 'Quero', imageUri: 'https://img.icons8.com/color/96/hand.png', position: 0 },
      { id: 'card-3', categoryId: 'cat-1', label: 'Banheiro', imageUri: 'https://img.icons8.com/color/96/toilet.png', position: 2 },
    ],
  },
];

export class SQLiteQuickPhraseRepository {
  private memoryPhrases: QuickPhrase[] = [...INITIAL_QUICK_PHRASES];

  async getAll(): Promise<QuickPhrase[]> {
    if (Platform.OS === 'web') {
      return this.memoryPhrases;
    }

    try {
      const db = await getDatabase();
      if (!db) return this.memoryPhrases;

      // Garante criação da tabela no SQLite
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS quick_phrases (
          id TEXT PRIMARY KEY NOT NULL,
          label TEXT NOT NULL,
          color_code TEXT NOT NULL DEFAULT '#A855F7',
          cards_json TEXT NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
      `);

      const rows = await db.getAllAsync<{
        id: string;
        label: string;
        color_code: string;
        cards_json: string;
        created_at: string;
      }>('SELECT * FROM quick_phrases ORDER BY created_at DESC;');

      return rows.map((r) => ({
        id: r.id,
        label: r.label,
        colorCode: r.color_code,
        cards: JSON.parse(r.cards_json),
        createdAt: r.created_at,
      }));
    } catch (error) {
      console.error('[SQLiteQuickPhraseRepository] Erro ao buscar frases favoritas:', error);
      return this.memoryPhrases;
    }
  }

  async create(phrase: Omit<QuickPhrase, 'createdAt'>): Promise<QuickPhrase> {
    const newPhrase: QuickPhrase = {
      ...phrase,
      createdAt: new Date().toISOString(),
    };

    if (Platform.OS === 'web') {
      this.memoryPhrases.unshift(newPhrase);
      return newPhrase;
    }

    try {
      const db = await getDatabase();
      if (db) {
        await db.runAsync(
          'INSERT INTO quick_phrases (id, label, color_code, cards_json) VALUES (?, ?, ?, ?);',
          [phrase.id, phrase.label, phrase.colorCode, JSON.stringify(phrase.cards)]
        );
      }
    } catch (e) {
      console.error('[SQLiteQuickPhraseRepository] Erro ao salvar frase favorita:', e);
    }

    return newPhrase;
  }

  async delete(id: string): Promise<void> {
    if (Platform.OS === 'web') {
      this.memoryPhrases = this.memoryPhrases.filter((p) => p.id !== id);
      return;
    }

    const db = await getDatabase();
    if (db) {
      await db.runAsync('DELETE FROM quick_phrases WHERE id = ?;', [id]);
    }
  }
}
