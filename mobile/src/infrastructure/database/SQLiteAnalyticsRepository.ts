import { UsageLog, AnalyticsSummary } from '../../domain/entities/Analytics';
import { getDatabase } from './sqliteClient';
import { Platform } from 'react-native';

const memoryLogs: UsageLog[] = [
  { id: '1', cardId: 'card-1', cardLabel: 'Quero', categoryName: 'Necessidades', timestamp: new Date().toISOString() },
  { id: '2', cardId: 'card-2', cardLabel: 'Água', categoryName: 'Necessidades', timestamp: new Date().toISOString() },
  { id: '3', cardId: 'card-5', cardLabel: 'Feliz', categoryName: 'Sentimentos', timestamp: new Date().toISOString() },
  { id: '4', cardId: 'card-8', cardLabel: 'Comer', categoryName: 'Ações', timestamp: new Date().toISOString() },
];

export class SQLiteAnalyticsRepository {
  async logUsage(cardId: string, cardLabel: string, categoryName: string): Promise<void> {
    const newLog: UsageLog = {
      id: `log-${Date.now()}-${Math.random()}`,
      cardId,
      cardLabel,
      categoryName,
      timestamp: new Date().toISOString(),
    };

    if (Platform.OS === 'web') {
      memoryLogs.push(newLog);
      return;
    }

    try {
      const db = await getDatabase();
      if (!db) return;

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS usage_logs (
          id TEXT PRIMARY KEY NOT NULL,
          card_id TEXT NOT NULL,
          card_label TEXT NOT NULL,
          category_name TEXT NOT NULL,
          timestamp TEXT DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await db.runAsync(
        'INSERT INTO usage_logs (id, card_id, card_label, category_name) VALUES (?, ?, ?, ?);',
        [newLog.id, cardId, cardLabel, categoryName]
      );
    } catch (error) {
      console.error('[SQLiteAnalyticsRepository] Erro ao registrar evento de uso:', error);
      memoryLogs.push(newLog);
    }
  }

  async getSummary(): Promise<AnalyticsSummary> {
    if (Platform.OS === 'web') {
      return this.calculateSummary(memoryLogs);
    }

    try {
      const db = await getDatabase();
      if (!db) return this.calculateSummary(memoryLogs);

      const rows = await db.getAllAsync<{
        id: string;
        card_id: string;
        card_label: string;
        category_name: string;
        timestamp: string;
      }>('SELECT * FROM usage_logs;');

      const logs: UsageLog[] = rows.map((r) => ({
        id: r.id,
        cardId: r.card_id,
        cardLabel: r.card_label,
        categoryName: r.category_name,
        timestamp: r.timestamp,
      }));

      return this.calculateSummary(logs.length > 0 ? logs : memoryLogs);
    } catch (error) {
      console.error('[SQLiteAnalyticsRepository] Erro ao calcular resumo:', error);
      return this.calculateSummary(memoryLogs);
    }
  }

  private calculateSummary(logs: UsageLog[]): AnalyticsSummary {
    const totalUsages = logs.length;

    // Frequência por cartão
    const cardCounts: { [label: string]: number } = {};
    const catCounts: { [cat: string]: number } = {};

    logs.forEach((log) => {
      cardCounts[log.cardLabel] = (cardCounts[log.cardLabel] || 0) + 1;
      catCounts[log.categoryName] = (catCounts[log.categoryName] || 0) + 1;
    });

    const topCards = Object.entries(cardCounts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const categoryStats = Object.entries(catCounts).map(([categoryName, count]) => ({
      categoryName,
      count,
    }));

    return {
      totalUsages,
      topCards,
      categoryStats,
    };
  }
}
