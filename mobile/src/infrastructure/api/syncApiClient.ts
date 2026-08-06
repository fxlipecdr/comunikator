import { Category } from '../../domain/entities/Category';
import { AACCard } from '../../domain/entities/Card';
import { Platform } from 'react-native';

// URL padrão da API Backend Python (localhost no iOS / 10.0.2.2 no Emulador Android)
const DEFAULT_API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';

export interface SyncResult {
  success: boolean;
  message: string;
  syncedCategoriesCount: number;
  syncedCardsCount: number;
}

export class SyncApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = DEFAULT_API_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Envia dados locais do SQLite para o backup em nuvem no PostgreSQL (Usuários Premium)
   */
  async syncUserData(userId: string, categories: Category[], cards: AACCard[]): Promise<SyncResult> {
    const endpoint = `${this.baseUrl}/api/v1/sync`;

    const payload = {
      user_id: userId,
      categories: categories.map((cat) => ({
        local_id: cat.id,
        name: cat.name,
        color_code: cat.colorCode,
        position: cat.position,
      })),
      cards: cards.map((card) => ({
        local_id: card.id,
        category_local_id: card.categoryId,
        label: card.label,
        image_url: card.imageUri,
        position: card.position,
      })),
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos de timeout

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Servidor respondeu com código ${response.status}`);
      }

      const data = await response.json();

      return {
        success: true,
        message: data.message || 'Sincronização concluída com sucesso.',
        syncedCategoriesCount: data.synced_categories_count || categories.length,
        syncedCardsCount: data.synced_cards_count || cards.length,
      };
    } catch (error: any) {
      console.warn('[SyncApiClient] Falha na sincronização remota:', error.message || error);
      
      // Retorno gracioso para manter o app 100% funcional offline
      return {
        success: false,
        message: error.name === 'AbortError' 
          ? 'Tempo limite de conexão excedido. O app continuará usando os dados locais.'
          : 'Sem conexão com o servidor de backup. Seus dados estão salvos localmente.',
        syncedCategoriesCount: 0,
        syncedCardsCount: 0,
      };
    }
  }
}
