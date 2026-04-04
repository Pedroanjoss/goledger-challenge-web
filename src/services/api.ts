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
 
  update: (show: TvShow) => api.put('/invoke/updateAsset', {
    update: { ...show, "@assetType": "tvShows" }
  }),
  
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
 create: async (season: Season, tvShowTitle: string) => {
    const payload = {
      asset: [{ 
        "@assetType": "seasons",
        number: Number(season.number),
        year: Number(season.year),
        tvShow: { 
          "@assetType": "tvShows",
          "title": tvShowTitle 
        } 
      }]
    };
    return api.post('/invoke/createAsset', payload);
  },

  update: async (season: Season, tvShowTitle: string) => {
    const payload = {
      update: { 
        "@assetType": "seasons",
        "@key": season['@key'], 
        number: Number(season.number),
        year: Number(season.year),
        tvShow: { 
          "@assetType": "tvShows",
          "title": tvShowTitle
        } 
      }
    };
    return api.put('/invoke/updateAsset', payload);
  },

  delete: (key: string) => api.delete('/invoke/deleteAsset', {
    data: { key: { "@key": key, "@assetType": "seasons" } }
  }),

 listByTvShow: async (tvShowTitle: string) => {
    try {
     
      const showPayload = {
        query: { 
          selector: { 
            "@assetType": "tvShows", 
            "title": tvShowTitle 
          } 
        }
      };
      
      const showResponse = await api.post('/query/search', showPayload);
      const shows = showResponse.data.result || (Array.isArray(showResponse.data) ? showResponse.data : []);
      
      if (shows.length === 0) {
        console.warn(`⚠️ [DEBUG] A série '${tvShowTitle}' não foi encontrada no banco.`);
        return [];
      }

    
      const realTvShowKey = shows[0]['@key'];
      console.log(`✅ [DEBUG] O @key real da série é: ${realTvShowKey}`);

   
      const seasonPayload = {
        query: { 
          selector: { 
            "@assetType": "seasons",
            "tvShow.@key": realTvShowKey 
          } 
        }
      };

      const seasonResponse = await api.post('/query/search', seasonPayload);
      const data = seasonResponse.data;
      
      if (Array.isArray(data)) return data as Season[];
      if (data && Array.isArray(data.result)) return data.result as Season[];
      
      return [];
    } catch (error: any) {
      console.error("❌ [DEBUG] Erro na busca de temporadas:", error.response?.data || error.message);
      return [];
    }
  },
};
