import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface AdMobBannerProps {
  isPremium: boolean;
}

export const AdMobBanner: React.FC<AdMobBannerProps> = ({ isPremium }) => {
  if (isPremium) return null;

  return (
    <View style={styles.bannerContainer}>
      <Text style={styles.adTag}>📢 Banner AdMob (Ambiente Web / Demonstration)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    borderTopWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 10,
  },
  adTag: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
});
