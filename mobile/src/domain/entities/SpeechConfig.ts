export interface SpeechConfig {
  rate: number;      // Velocidade da fala: 0.5 (lento) a 1.2 (rápido)
  pitch: number;     // Tom da voz: 0.7 (grave) a 1.4 (agudo/infantil)
  language: string;  // Idioma (ex: 'pt-BR')
}

export const DEFAULT_SPEECH_CONFIG: SpeechConfig = {
  rate: 0.85,
  pitch: 1.0,
  language: 'pt-BR',
};
