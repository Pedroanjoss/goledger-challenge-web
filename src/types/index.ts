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
  episodeNumber: number; 
  title: string;
  description: string;
  releaseDate: string;  
  rating?: number;       
  season: any; 
  '@key'?: string;
  '@assetType'?: string;
}

export interface SearchResponse<T> {
  result: T[];
}

export interface Watchlist {
  title: string;
  description?: string;
  tvShows?: any[];
  '@key'?: string;
  '@assetType'?: string;
}