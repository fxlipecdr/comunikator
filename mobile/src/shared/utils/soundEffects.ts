import { Platform } from 'react-native';

export class SoundEffects {
  /**
   * Toca um som suave de confirmação (Chime / Bell) para reforço positivo da criança
   */
  static playClickSound(): void {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'AudioContext' in window) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 (Ré suave)
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5 (Lá agradável)

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } catch (e) {
        console.warn('[SoundEffects] Erro ao tocar áudio Web:', e);
      }
    }
  }

  /**
   * Toca um som alegre de celebração ao finalizar a frase
   */
  static playSuccessSound(): void {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'AudioContext' in window) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 (Acorde Maior Festivo)
        
        notes.forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.value = freq;

          const startTime = ctx.currentTime + index * 0.1;
          gain.gain.setValueAtTime(0.2, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + 0.3);
        });
      } catch (e) {
        console.warn('[SoundEffects] Erro ao tocar som de sucesso:', e);
      }
    }
  }
}
