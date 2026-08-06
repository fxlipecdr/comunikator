export interface AACCard {
  id: string;
  categoryId: string;
  label: string;
  imageUri: string;
  audioUri?: string; // Caminho do áudio personalizado gravado pelos pais
  position: number;
  createdAt?: string;
  updatedAt?: string;
}
