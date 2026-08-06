import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';

export class AdMobService {
  private static initialized = false;

  /**
   * Inicializa os anúncios AdMob com configurações estritas para público infantil (COPPA Compliance)
   */
  static async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await mobileAds().setRequestConfiguration({
        maxAdContentRating: MaxAdContentRating.G,
        tagForChildDirectedTreatment: true,
        tagForUnderAgeOfConsent: true,
      });

      await mobileAds().initialize();
      this.initialized = true;
      console.log('[AdMobService] Inicializado com restrições COPPA/G-Rating.');
    } catch (error) {
      console.error('[AdMobService] Erro ao inicializar AdMob:', error);
    }
  }
}
