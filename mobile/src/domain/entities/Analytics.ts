export interface UsageLog {
  id: string;
  cardId: string;
  cardLabel: string;
  categoryName: string;
  timestamp: string;
}

export interface AnalyticsSummary {
  totalUsages: number;
  topCards: { label: string; count: number }[];
  categoryStats: { categoryName: string; count: number }[];
}
