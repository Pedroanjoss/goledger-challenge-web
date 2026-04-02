import axios from 'axios';
import type { TvShow } from '../types';

export const api = axios.create({
  baseURL: 'http://ec2-50-19-36-138.compute-1.amazonaws.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Basic Z29sZWRnZXI6NU54VkNBakM='
  }
});

export const tvShowService = {
  list: async () => {
    const { data } = await api.post('/query/search', {
      query: { selector: { "@assetType": "tvShows" } }
    });
    
   
    if (Array.isArray(data)) {
      return data as TvShow[];
    } 
    
   
    if (data && Array.isArray(data.result)) {
      return data.result as TvShow[];
    }

    
    console.warn("Formato inesperado recebido da API:", data);
    return [];
  },

  create: (show: TvShow) => api.post('/invoke/createAsset', {
    asset: [{ ...show, "@assetType": "tvShows" }]
  }),

  update: (show: TvShow) => api.post('/invoke/updateAsset', {
    update: { ...show, "@assetType": "tvShows" }
  }),

  delete: (title: string) => api.post('/invoke/deleteAsset', {
    key: { title, "@assetType": "tvShows" }
  })
};