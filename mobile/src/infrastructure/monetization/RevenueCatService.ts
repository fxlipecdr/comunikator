import Purchases, { CustomerInfo, PurchasesPackage } from 'react-native-purchases';
import { Platform } from 'react-native';

const API_KEYS = {
  apple: 'appl_mock_revenuecat_key_ios',
  google: 'goog_mock_revenuecat_key_android',
};

export class RevenueCatService {
  private static initialized = false;

  static async setup(userId?: string): Promise<void> {
    if (this.initialized) return;

    try {
      const apiKey = Platform.OS === 'ios' ? API_KEYS.apple : API_KEYS.google;
      Purchases.configure({ apiKey, appUserID: userId });
      this.initialized = true;
      console.log('[RevenueCatService] Configurado com sucesso.');
    } catch (error) {
      console.warn('[RevenueCatService] Falha na inicialização do RevenueCat (modo Fallback/Mock):', error);
    }
  }

  /**
   * Obtém os pacotes de assinatura ativos na loja (Mensal, Anual, etc)
   */
  static async getOfferings(): Promise<PurchasesPackage[]> {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
        return offerings.current.availablePackages;
      }
      return [];
    } catch (error) {
      console.warn('[RevenueCatService] Erro ao buscar ofertas:', error);
      return [];
    }
  }

  /**
   * Aciona a compra de um pacote e retorna se o status de premium foi ativado
   */
  static async purchasePackage(pack: PurchasesPackage): Promise<boolean> {
    try {
      const { customerInfo } = await Purchases.purchasePackage(pack);
      return customerInfo.entitlements.active['premium_access'] !== undefined;
    } catch (error: any) {
      if (!error.userCancelled) {
        console.error('[RevenueCatService] Erro na transação:', error);
      }
      return false;
    }
  }

  /**
   * Restaura compras anteriores feitas na App Store / Play Store
   */
  static async restorePurchases(): Promise<boolean> {
    try {
      const customerInfo: CustomerInfo = await Purchases.restorePurchases();
      return customerInfo.entitlements.active['premium_access'] !== undefined;
    } catch (error) {
      console.error('[RevenueCatService] Erro ao restaurar compras:', error);
      return false;
    }
  }
}
