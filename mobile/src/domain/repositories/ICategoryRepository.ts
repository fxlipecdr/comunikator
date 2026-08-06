import { Category } from '../entities/Category';

export interface ICategoryRepository {
  getAll(): Promise<Category[]>;
  getById(id: string): Promise<Category | null>;
  create(category: Omit<Category, 'createdAt' | 'updatedAt'>): Promise<Category>;
  update(category: Category): Promise<void>;
  delete(id: string): Promise<void>;
}
