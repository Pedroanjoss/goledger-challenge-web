import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container,Grid, Typography, Button, Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import { Add as AddIcon, ArrowBack } from '@mui/icons-material';

import { seasonService, api } from '../services/api';
import type { Season } from '../types';

import { SeasonCard } from '../components/seasons/SeasonCard';
import { SeasonFormModal } from '../components/seasons/SeasonFormModal';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';
import { EpisodesListModal } from '../components/episodes/EpisodesListModal'; // <-- Importamos o Modal Mestre
import styles from './style/Seasons.module.css';

export function Seasons() {
  const { showTitle } = useParams<{ showTitle: string }>();
  const navigate = useNavigate();
  const decodedShowTitle = decodeURIComponent(showTitle || '');

  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modais da Temporada
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSeasonToEdit, setSelectedSeasonToEdit] = useState<Season | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [seasonToDelete, setSeasonToDelete] = useState<Season | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // NOVO: Controle do Modal Mestre de Episódios
  const [episodesModalOpen, setEpisodesModalOpen] = useState(false);
  const [seasonForEpisodes, setSeasonForEpisodes] = useState<Season | null>(null);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const loadSeasons = async () => {
    if (!decodedShowTitle) return;
    try {
      setLoading(true);
      const showResponse = await api.post('/query/search', {
        query: { selector: { "@assetType": "tvShows", "title": decodedShowTitle } }
      });
      const shows = showResponse.data.result || (Array.isArray(showResponse.data) ? showResponse.data : []);
      
      if (shows.length === 0) {
        setSeasons([]);
        return;
      }

      const realTvShowKey = shows[0]['@key'];
      const seasonResponse = await api.post('/query/search', {
        query: { selector: { "@assetType": "seasons", "tvShow.@key": realTvShowKey } }
      });
      
      let data = seasonResponse.data;
      if (data && Array.isArray(data.result)) data = data.result;
      if (!Array.isArray(data)) data = [];

      data.sort((a: Season, b: Season) => a.number - b.number);
      setSeasons(data);
    } catch (error) {
      showToast("Erro ao carregar Temporadas.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSeasons(); }, [decodedShowTitle]);

  const handleOpenForm = (season?: Season) => {
    setSelectedSeasonToEdit(season || null);
    setModalOpen(true);
  };

  const handleSave = async (seasonData: Season, isEditing: boolean) => {
    try {
      if (isEditing) {
        await seasonService.update(seasonData, decodedShowTitle);
        showToast("Temporada atualizada!", "success");
      } else {
        await seasonService.create(seasonData, decodedShowTitle);
        showToast("Temporada cadastrada!", "success");
      }
      setModalOpen(false);
      loadSeasons();
    } catch (error) {
      showToast("Erro ao salvar temporada.", "error");
    }
  };

  const confirmDelete = (season: Season) => {
    setSeasonToDelete(season);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!seasonToDelete || !seasonToDelete['@key']) return;
    try {
      setDeleteLoading(true);
      await seasonService.delete(seasonToDelete['@key']);
      showToast("Temporada excluída com sucesso!", "success");
      setSeasons(prev => prev.filter(s => s['@key'] !== seasonToDelete['@key']));
      setDeleteModalOpen(false);
    } catch (error) {
      showToast("Erro ao excluir.", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  // NOVO: Abre o modal de episódios ao invés de navegar!
  const handleViewEpisodes = (seasonKey: string) => {
    const seasonClicked = seasons.find(s => s['@key'] === seasonKey);
    if (seasonClicked) {
      setSeasonForEpisodes(seasonClicked);
      setEpisodesModalOpen(true);
    }
  };

  const showToast = (message: string, severity: 'success' | 'error') => setSnackbar({ open: true, message, severity });

  if (!decodedShowTitle) return <Container><Typography mt={5}>Série não encontrada.</Typography></Container>;

  return (
    <Container className={styles.container}>
      <Box mb={4}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/tvshows')} sx={{ mb: 2, color: 'text.secondary' }}>
          Voltar para Catálogo
        </Button>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h3" color="primary" className={styles.pageTitle}>
              {decodedShowTitle}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Gerencie as temporadas desta série
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenForm()} className={styles.addButton}>
            Nova Temporada
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box className={styles.loaderContainer}><CircularProgress /></Box>
      ) : (
        <Grid container spacing={3}>
          {seasons.length === 0 ? (
             <Grid size={{ xs: 12 }}>
               <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 2, p: 4, border: '1px dashed #334155', borderRadius: 2 }}>
                 Esta série ainda não possui temporadas cadastradas.
               </Typography>
             </Grid>
          ) : (
            seasons.map((season) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={season['@key']}>
                <SeasonCard 
                  season={season} 
                  onEdit={handleOpenForm} 
                  onDelete={confirmDelete} 
                  onViewEpisodes={handleViewEpisodes} // Passa para nossa nova função!
                />
              </Grid>
            ))
          )}
        </Grid>
      )}

      {/* Modais da Temporada */}
      <SeasonFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} initialData={selectedSeasonToEdit} activeTvShow={decodedShowTitle} />
      <DeleteConfirmModal open={deleteModalOpen} titleToDelete={seasonToDelete ? `Temporada ${seasonToDelete.number}` : ''} onClose={() => setDeleteModalOpen(false)} onConfirm={handleConfirmDelete} loading={deleteLoading} />

      {/* O NOSSO NOVO MODAL MESTRE DOS EPISÓDIOS */}
      <EpisodesListModal
        open={episodesModalOpen}
        onClose={() => setEpisodesModalOpen(false)}
        season={seasonForEpisodes}
        showTitle={decodedShowTitle}
      />

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}