import { AACCard } from '../entities/Card';

export interface ICardRepository {
  getByCategory(categoryId: string): Promise<AACCard[]>;
  getAll(): Promise<AACCard[]>;
  create(card: Omit<AACCard, 'createdAt' | 'updatedAt'>): Promise<AACCard>;
  update(card: AACCard): Promise<void>;
  delete(id: string): Promise<void>;
}
