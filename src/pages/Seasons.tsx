import { useEffect, useState } from 'react';
import { Container, Grid,Typography, Button, Box, CircularProgress, Snackbar, Alert, Card, CardContent, CardActions, IconButton, Chip } from '@mui/material';

import { Add as AddIcon, DeleteOutline, EditOutlined } from '@mui/icons-material';
import { seasonService, tvShowService } from '../services/api';
import type { Season, TvShow } from '../types';

import { SeasonFormModal } from '../components/seasons/SeasonFormModal';
import styles from './style/Seasons.module.css';

export function Seasons() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [tvShows, setTvShows] = useState<TvShow[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const loadData = async () => {
    try {
      setLoading(true);
     
      const [seasonsData, showsData] = await Promise.all([
        seasonService.list(),
        tvShowService.list()
      ]);
      setSeasons(seasonsData);
      setTvShows(showsData);
    } catch (error) {
      showToast("Erro ao carregar dados da Blockchain.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleOpenForm = (season?: Season) => {
    setSelectedSeason(season || null);
    setModalOpen(true);
  };

  const handleSave = async (seasonData: Season, showTitle: string, isEditing: boolean) => {
    try {
      if (isEditing) {
        await seasonService.update(seasonData, showTitle);
        showToast("Temporada atualizada!", "success");
      } else {
        await seasonService.create(seasonData, showTitle);
        showToast("Temporada cadastrada!", "success");
      }
      setModalOpen(false);
      loadData();
    } catch (error) {
      showToast("Erro ao salvar temporada.", "error");
    }
  };

  const handleDelete = async (season: Season) => {
    if (!season['@key']) return;
    if (window.confirm(`Excluir a Temporada ${season.number}?`)) {
      try {
        await seasonService.delete(season['@key']);
        showToast("Temporada excluída!", "success");
        loadData();
      } catch (error) {
        showToast("Erro ao excluir.", "error");
      }
    }
  };

  const showToast = (message: string, severity: 'success' | 'error') => setSnackbar({ open: true, message, severity });

  return (
    <Container className={styles.container}>
      <Box className={styles.headerContainer}>
        <Box>
          <Typography variant="h3" color="primary" className={styles.pageTitle}>Temporadas</Typography>
          <Typography variant="subtitle1" color="text.secondary">Gerencie as temporadas das suas séries</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenForm()} className={styles.addButton}>
          Nova Temporada
        </Button>
      </Box>

      {loading ? (
        <Box className={styles.loaderContainer}><CircularProgress /></Box>
      ) : (
        <Grid container spacing={3}>
          {seasons.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" color="text.secondary" className={styles.emptyState}>Nenhuma temporada registrada.</Typography>
            </Grid>
          ) : (
            seasons.map((season) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={season['@key']}>
                <Card className={styles.card} variant="outlined">
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                      Temporada {season.number}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      Série: {season.tvShow['@key']}
                    </Typography>
                    <Chip label={`Ano: ${season.year}`} size="small" variant="outlined" />
                  </CardContent>
                  <CardActions className={styles.cardActions}>
                    <IconButton size="small" onClick={() => handleOpenForm(season)}><EditOutlined color="primary" /></IconButton>
                    <IconButton size="small" onClick={() => handleDelete(season)}><DeleteOutline color="error" /></IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      <SeasonFormModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSave={handleSave} 
        initialData={selectedSeason}
        availableShows={tvShows} 
      />

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}