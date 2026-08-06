import { getDatabase } from './sqliteClient';

export const runMigrations = async (): Promise<void> => {
  try {
    const db = await getDatabase();

    // Habilita foreign keys no SQLite
    await db.execAsync('PRAGMA foreign_keys = ON;');

    // Criar tabela de Categorias
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        color_code TEXT NOT NULL DEFAULT '#4A90E2',
        position INTEGER NOT NULL DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Criar tabela de Cartões (Pranchas de CAA)
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS cards (
        id TEXT PRIMARY KEY NOT NULL,
        category_id TEXT NOT NULL,
        label TEXT NOT NULL,
        image_uri TEXT NOT NULL,
        position INTEGER NOT NULL DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_cards_category_id ON cards(category_id);
      CREATE INDEX IF NOT EXISTS idx_cards_position ON cards(position);
    `);

    // Inserir dados padrão de inicialização (Seed Data) caso esteja vazio
    const categoriesCount = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM categories');
    
    if (categoriesCount && categoriesCount.count === 0) {
      await db.execAsync(`
        INSERT INTO categories (id, name, color_code, position) VALUES
        ('cat-1', 'Necessidades', '#FF6B6B', 0),
        ('cat-2', 'Sentimentos', '#4ECDC4', 1),
        ('cat-3', 'Ações', '#FFE66D', 2),
        ('cat-4', 'Alimentos', '#FF9F43', 3);

        INSERT INTO cards (id, category_id, label, image_uri, position) VALUES
        ('card-1', 'cat-1', 'Quero', 'https://img.icons8.com/color/96/hand.png', 0),
        ('card-2', 'cat-1', 'Água', 'https://img.icons8.com/color/96/glass-of-water.png', 1),
        ('card-3', 'cat-1', 'Banheiro', 'https://img.icons8.com/color/96/toilet.png', 2),
        ('card-4', 'cat-1', 'Ajuda', 'https://img.icons8.com/color/96/helping-hand.png', 3),
        ('card-5', 'cat-2', 'Feliz', 'https://img.icons8.com/color/96/happy.png', 0),
        ('card-6', 'cat-2', 'Cansado', 'https://img.icons8.com/color/96/sleeping.png', 1),
        ('card-7', 'cat-2', 'Dói', 'https://img.icons8.com/color/96/bandage.png', 2),
        ('card-8', 'cat-3', 'Comer', 'https://img.icons8.com/color/96/eating.png', 0),
        ('card-9', 'cat-3', 'Brincar', 'https://img.icons8.com/color/96/toy.png', 1),
        ('card-10', 'cat-3', 'Dormir', 'https://img.icons8.com/color/96/bed.png', 2);
      `);
    }

    console.log('[SQLite Database] Migrações e Seeds aplicados com sucesso.');
  } catch (error) {
    console.error('[SQLite Database] Erro ao executar migrações:', error);
    throw error;
  }
};
