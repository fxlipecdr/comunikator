import { ICategoryRepository } from '../repositories/ICategoryRepository';
import { ICardRepository } from '../repositories/ICardRepository';
import { SyncApiClient, SyncResult } from '../../infrastructure/api/syncApiClient';

export class SyncCloudData {
  constructor(
    private categoryRepo: ICategoryRepository,
    private cardRepo: ICardRepository,
    private syncApiClient: SyncApiClient
  ) {}

  async execute(userId: string, isPremium: boolean): Promise<SyncResult> {
    if (!isPremium) {
      return {
        success: false,
        message: 'A sincronização em nuvem é um recurso exclusivo para assinantes Premium.',
        syncedCategoriesCount: 0,
        syncedCardsCount: 0,
      };
    }

    // Busca todas as categorias e cartões salvos offline no SQLite local
    const categories = await this.categoryRepo.getAll();
    const cards = await this.cardRepo.getAll();

    // Transmite para a API remota em Python/PostgreSQL
    return await this.syncApiClient.syncUserData(userId, categories, cards);
  }
}
