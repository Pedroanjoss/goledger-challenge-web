import axios from 'axios';
import type { Season, TvShow } from '../types';

export const api = axios.create({
  baseURL: 'http://ec2-50-19-36-138.compute-1.amazonaws.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Basic Z29sZWRnZXI6NU54VkNBakM='
  }
});

export const tvShowService = {
  list: async () => {
    const { data } = await api.post('/query/search', { query: { selector: { "@assetType": "tvShows" } } });
    if (Array.isArray(data)) return data as TvShow[];
    if (data && Array.isArray(data.result)) return data.result as TvShow[];
    return [];
  },
  create: (show: TvShow) => api.post('/invoke/createAsset', {
    asset: [{ ...show, "@assetType": "tvShows" }]
  }),
  // AQUI: Mudou para PUT
  update: (show: TvShow) => api.put('/invoke/updateAsset', {
    update: { ...show, "@assetType": "tvShows" }
  }),
  // AQUI: Mudou para DELETE (no Axios, o payload vai dentro de 'data')
  delete: (title: string) => api.delete('/invoke/deleteAsset', {
    data: { key: { title, "@assetType": "tvShows" } }
  })
};

export const seasonService = {
  list: async () => {
    const { data } = await api.post('/query/search', { query: { selector: { "@assetType": "seasons" } } });
    if (Array.isArray(data)) return data as Season[];
    if (data && Array.isArray(data.result)) return data.result as Season[];
    return [];
  },
  create: (season: Season, tvShowTitle: string) => api.post('/invoke/createAsset', {
    asset: [{ ...season, "@assetType": "seasons", tvShow: { "@assetType": "tvShows", "@key": tvShowTitle } }]
  }),
  // AQUI: Mudou para PUT
  update: (season: Season, tvShowTitle: string) => api.put('/invoke/updateAsset', {
    update: { ...season, "@assetType": "seasons", tvShow: { "@assetType": "tvShows", "@key": tvShowTitle } }
  }),
  // AQUI: Mudou para DELETE
  delete: (key: string) => api.delete('/invoke/deleteAsset', {
    data: { key: { "@key": key, "@assetType": "seasons" } }
  })
};
