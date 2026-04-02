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

export interface SearchResponse<T> {
  result: T[];
}