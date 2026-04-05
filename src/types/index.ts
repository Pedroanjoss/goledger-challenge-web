export interface TvShow {
  title: string;
  description: string;
  recommendedAge: number;
  '@key'?: string;
  '@assetType'?: string;
}

export interface Season {
  number: number;
  year: number;
  tvShow: any; 
  '@key'?: string;
  '@assetType'?: string;
}

export interface Episode {
  episodeNumber: number; // Mudou de 'number' para 'episodeNumber'
  title: string;
  description: string;
  releaseDate: string;   // Novo campo obrigatório
  rating?: number;       // Novo campo opcional
  season: any; 
  '@key'?: string;
  '@assetType'?: string;
}

export interface SearchResponse<T> {
  result: T[];
}