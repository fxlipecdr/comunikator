import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { AdMobService } from '../../../infrastructure/monetization/AdMobService';

interface AdMobBannerProps {
  isPremium: boolean;
}

export const AdMobBanner: React.FC<AdMobBannerProps> = ({ isPremium }) => {
  useEffect(() => {
    if (!isPremium && Platform.OS !== 'web') {
      AdMobService.initialize();
    }
  }, [isPremium]);

  // Se o usuário for Premium, NENHUM anúncio é exibido
  if (isPremium) {
    return null;
  }

  // No ambiente Web, exibimos um placeholder de anúncio
  if (Platform.OS === 'web') {
    return (
      <View style={styles.bannerContainer}>
        <Text style={styles.adTag}>Anúncio AdMob (Modo Web)</Text>
      </View>
    );
  }

  const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-3940256099942544/6300978111';

  return (
    <View style={styles.bannerContainer}>
      <Text style={styles.adTag}>Patrocinado</Text>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={(error) => {
          console.warn('[AdMobBanner] Erro ao carregar anúncio de banner:', error);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 8,
  },
  adTag: {
    fontSize: 10,
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
});
