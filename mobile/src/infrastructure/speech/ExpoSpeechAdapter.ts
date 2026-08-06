import * as Speech from 'expo-speech';

export interface SpeechOptions {
  language?: string; // Default 'pt-BR'
  pitch?: number;    // Default 1.0 (voz natural)
  rate?: number;     // Default 0.85 (um pouco mais pausado para facilidade da criança)
}

export class ExpoSpeechAdapter {
  /**
   * Executa a síntese de voz para o texto ou frase informada.
   * Totalmente offline-first. Tratamento contra falhas no motor TTS.
   */
  static async speak(text: string, options?: SpeechOptions): Promise<void> {
    if (!text || text.trim().length === 0) return;

    try {
      const isSpeaking = await Speech.isSpeakingAsync();
      if (isSpeaking) {
        await Speech.stop();
      }

      Speech.speak(text, {
        language: options?.language || 'pt-BR',
        pitch: options?.pitch ?? 1.0,
        rate: options?.rate ?? 0.85,
        onError: (error) => {
          console.warn('[ExpoSpeechAdapter] Erro na síntese de voz (TTS):', error);
        },
      });
    } catch (error) {
      // Captura de exceção em caso de ausência do motor nativo de fala no dispositivo
      console.error('[ExpoSpeechAdapter] Falha ao tentar executar o motor TTS nativo:', error);
    }
  }

  static async stop(): Promise<void> {
    try {
      await Speech.stop();
    } catch (error) {
      console.warn('[ExpoSpeechAdapter] Erro ao parar fala:', error);
    }
  }
}
