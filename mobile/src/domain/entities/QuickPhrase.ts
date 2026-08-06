import { AACCard } from './Card';

export interface QuickPhrase {
  id: string;
  label: string;      // Ex: "Quero Água" ou "Preciso do Banheiro"
  cards: AACCard[];   // Conjunto de cartões que compõem a frase rápida
  colorCode: string;  // Cor visual do atalho
  createdAt?: string;
}
