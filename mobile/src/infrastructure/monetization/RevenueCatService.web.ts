export class RevenueCatService {
  static async setup(userId?: string): Promise<void> {
    console.log('[RevenueCatService.web] Inicializado em modo Web.');
  }

  static async getOfferings(): Promise<any[]> {
    return [];
  }

  static async purchasePackage(pack: any): Promise<boolean> {
    return false;
  }

  static async restorePurchases(): Promise<boolean> {
    return false;
  }
}
