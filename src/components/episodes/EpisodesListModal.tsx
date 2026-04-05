import { useEffect, useState } from 'react';
import { Dialog,Grid , DialogTitle, DialogContent, Typography, Button, Box, CircularProgress, IconButton, Snackbar, Alert } from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';

import { episodeService } from '../../services/api';
import type { Season, Episode } from '../../types';

import { EpisodeCard } from './EpisodeCard';
import { EpisodeFormModal } from './EpisodeFormModal';
import { DeleteConfirmModal } from '../../common/DeleteConfirmModal';
import styles from './style/EpisodesListModal.module.css';

interface EpisodesListModalProps {
  open: boolean;
  onClose: () => void;
  season: Season | null;
  showTitle: string;
}

export function EpisodesListModal({ open, onClose, season, showTitle }: EpisodesListModalProps) {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados dos Sub-Modais
  const [formOpen, setFormOpen] = useState(false);
  const [episodeToEdit, setEpisodeToEdit] = useState<Episode | null>(null);
  
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [episodeToDelete, setEpisodeToDelete] = useState<Episode | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const loadEpisodes = async () => {
    if (!season || !season['@key']) return;
    setLoading(true);
    const data = await episodeService.listBySeason(season['@key']);
    setEpisodes(data);
    setLoading(false);
  };

  useEffect(() => {
    if (open && season) loadEpisodes();
  }, [open, season]);

  const handleOpenForm = (episode?: Episode) => {
    setEpisodeToEdit(episode || null);
    setFormOpen(true);
  };

  const handleSave = async (episodeData: Episode, isEditing: boolean) => {
    if (!season || !season['@key']) return;
    try {
      if (isEditing) {
        await episodeService.update(episodeData, season['@key']);
        showToast("Episódio atualizado!", "success");
      } else {
        await episodeService.create(episodeData, season['@key']);
        showToast("Episódio cadastrado!", "success");
      }
      setFormOpen(false);
      loadEpisodes();
    } catch (error) {
      showToast("Erro ao salvar episódio.", "error");
    }
  };

  const confirmDelete = (episode: Episode) => {
    setEpisodeToDelete(episode);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!episodeToDelete || !episodeToDelete['@key']) return;
    try {
      setDeleteLoading(true);
      await episodeService.delete(episodeToDelete['@key']);
      showToast("Episódio excluído!", "success");
      setEpisodes(prev => prev.filter(e => e['@key'] !== episodeToDelete['@key']));
      setDeleteOpen(false);
    } catch (error) {
      showToast("Erro ao excluir.", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const showToast = (message: string, severity: 'success' | 'error') => setSnackbar({ open: true, message, severity });

  if (!season) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" PaperProps={{ className: styles.dialogPaper }}>
      <DialogTitle className={styles.header}>
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <Box>
            <Typography variant="h5" fontWeight="bold" color="primary">
              Temporada {season.number}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {showTitle}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenForm()} className={styles.addButton}>
              Novo Episódio
            </Button>
            <IconButton onClick={onClose} edge="end">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers className={styles.content}>
        {loading ? (
          <Box className={styles.loaderContainer}><CircularProgress /></Box>
        ) : (
          <Grid container spacing={3}>
            {episodes.length === 0 ? (
              <Grid size={{ xs: 12 }}>
                <Typography variant="body1" color="text.secondary" className={styles.emptyState}>
                  Nenhum episódio cadastrado nesta temporada.
                </Typography>
              </Grid>
            ) : (
              episodes.map((episode) => (
                <Grid size={{ xs: 12, sm: 6 }} key={episode['@key']}>
                  <EpisodeCard episode={episode} onEdit={handleOpenForm} onDelete={confirmDelete} />
                </Grid>
              ))
            )}
          </Grid>
        )}
      </DialogContent>

      <EpisodeFormModal open={formOpen} onClose={() => setFormOpen(false)} onSave={handleSave} initialData={episodeToEdit} />
      
      <DeleteConfirmModal 
        open={deleteOpen} 
        titleToDelete={episodeToDelete ? `Episódio ${episodeToDelete.episodeNumber} - ${episodeToDelete.title}` : ''} 
        onClose={() => setDeleteOpen(false)} 
        onConfirm={handleConfirmDelete} 
        loading={deleteLoading} 
      />

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Dialog>
  );
}