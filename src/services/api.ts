import axios from 'axios';
import type { Episode, Season, TvShow, Watchlist } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const API_AUTHORIZATION = import.meta.env.VITE_API_AUTHORIZATION 

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': API_AUTHORIZATION
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

export const episodeService = {
  listBySeason: async (seasonKey: string) => {
    try {
      const payload = {
        query: { selector: { "@assetType": "episodes", "season.@key": seasonKey } }
      };
      const response = await api.post('/query/search', payload);
      let data = response.data;
      if (data && Array.isArray(data.result)) data = data.result;
      if (!Array.isArray(data)) data = [];
      
      // Ordenando pela chave correta agora: episodeNumber
      return data.sort((a: any, b: any) => a.episodeNumber - b.episodeNumber) as Episode[];
    } catch (error) {
      console.error("❌ [DEBUG] Erro ao buscar episódios:", error);
      return [];
    }
  },

  create: async (episode: Episode, seasonKey: string) => {
   
    const formattedDate = new Date(episode.releaseDate).toISOString();

    const payload: any = {
      asset: [{ 
        "@assetType": "episodes",
        episodeNumber: Number(episode.episodeNumber),
        title: episode.title,
        description: episode.description,
        releaseDate: formattedDate,
        season: { "@assetType": "seasons", "@key": seasonKey } 
      }]
    };
    
   
    if (episode.rating !== undefined && episode.rating !== null) {
      payload.asset[0].rating = Number(episode.rating);
    }

    return api.post('/invoke/createAsset', payload);
  },

  update: async (episode: Episode, seasonKey: string) => {
    const formattedDate = new Date(episode.releaseDate).toISOString();

    const payload: any = {
      update: { 
        "@assetType": "episodes",
        "@key": episode['@key'],
        episodeNumber: Number(episode.episodeNumber),
        title: episode.title,
        description: episode.description,
        releaseDate: formattedDate,
        season: { "@assetType": "seasons", "@key": seasonKey } 
      }
    };

    if (episode.rating !== undefined && episode.rating !== null) {
      payload.update.rating = Number(episode.rating);
    }

    return api.put('/invoke/updateAsset', payload);
  },

  delete: (key: string) => api.delete('/invoke/deleteAsset', {
    data: { key: { "@key": key, "@assetType": "episodes" } }
  })


};

export const watchlistService = {
  list: async () => {
    try {
      const { data } = await api.post('/query/search', { 
        query: { selector: { "@assetType": "watchlist" } } 
      });
      let result = data.result || (Array.isArray(data) ? data : []);
      return result as Watchlist[];
    } catch (error) {
      console.error("❌ [DEBUG] Erro ao buscar watchlists:", error);
      return [];
    }
  },

  
  create: async (watchlist: Watchlist, tvShowKeys: string[]) => {
    const payload = {
      asset: [{ 
        "@assetType": "watchlist",
        title: watchlist.title,
        description: watchlist.description || "",
        tvShows: tvShowKeys.map(key => ({ "@assetType": "tvShows", "@key": key }))
      }]
    };
    return api.post('/invoke/createAsset', payload);
  },

  update: async (watchlist: Watchlist, tvShowKeys: string[]) => {
    const payload = {
      update: { 
        "@assetType": "watchlist",
        "@key": watchlist['@key'],
        title: watchlist.title,
        description: watchlist.description || "",
        tvShows: tvShowKeys.map(key => ({ "@assetType": "tvShows", "@key": key }))
      }
    };
    return api.put('/invoke/updateAsset', payload);
  },

  delete: (key: string) => api.delete('/invoke/deleteAsset', {
    data: { key: { "@key": key, "@assetType": "watchlist" } }
  }),

  addTvShow: async (watchlist: Watchlist, tvShowKey: string) => {
   
    const currentKeys = watchlist.tvShows ? watchlist.tvShows.map(s => s['@key']) : [];
    
    if (currentKeys.includes(tvShowKey)) return;

    const newKeys = [...currentKeys, tvShowKey];

    const payload = {
      update: { 
        "@assetType": "watchlist",
        "@key": watchlist['@key'],
        tvShows: newKeys.map(key => ({ "@assetType": "tvShows", "@key": key }))
      }
    };
    return api.put('/invoke/updateAsset', payload);
  }
};