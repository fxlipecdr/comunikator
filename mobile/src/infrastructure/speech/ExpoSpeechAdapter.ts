import * as Speech from 'expo-speech';
import { Platform } from 'react-native';
import { SpeechConfig, DEFAULT_SPEECH_CONFIG } from '../../domain/entities/SpeechConfig';

let currentConfig: SpeechConfig = { ...DEFAULT_SPEECH_CONFIG };

export class ExpoSpeechAdapter {
  static setConfig(config: SpeechConfig): void {
    currentConfig = { ...config };
  }

  static getConfig(): SpeechConfig {
    return currentConfig;
  }

  /**
   * Executa a síntese de voz para o texto ou frase informada.
   * Suporta Expo Speech nativo (Android/iOS) e Web Speech API (Browser).
   */
  static async speak(text: string, options?: Partial<SpeechConfig>): Promise<void> {
    if (!text || text.trim().length === 0) return;

    const rate = options?.rate ?? currentConfig.rate;
    const pitch = options?.pitch ?? currentConfig.pitch;
    const language = options?.language ?? currentConfig.language;

    // Suporte para Navegador Web (Web Speech API)
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = rate;
        utterance.pitch = pitch;
        window.speechSynthesis.speak(utterance);
        return;
      } catch (e) {
        console.warn('[ExpoSpeechAdapter] Erro na síntese Web Speech:', e);
      }
    }

    // Suporte para Celular Nativo (Android / iOS)
    try {
      const isSpeaking = await Speech.isSpeakingAsync();
      if (isSpeaking) {
        await Speech.stop();
      }

      Speech.speak(text, {
        language,
        pitch,
        rate,
        onError: (error) => {
          console.warn('[ExpoSpeechAdapter] Erro na síntese de voz (TTS):', error);
        },
      });
    } catch (error) {
      console.error('[ExpoSpeechAdapter] Falha no motor TTS nativo:', error);
    }
  }

  static async stop(): Promise<void> {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      return;
    }

    try {
      await Speech.stop();
    } catch (error) {
      console.warn('[ExpoSpeechAdapter] Erro ao parar fala:', error);
    }
  }
}
