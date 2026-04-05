import { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, CircularProgress, Typography } from '@mui/material';
import type { Episode } from '../../types';
import styles from './style/EpisodeFormModal.module.css';

interface EpisodeFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (episode: Episode, isEditing: boolean) => Promise<void>;
  initialData?: Episode | null;
}

export function EpisodeFormModal({ open, onClose, onSave, initialData }: EpisodeFormModalProps) {
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState<Episode>({ episodeNumber: 1, title: '', description: '', releaseDate: today, season: '' });
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      // Ajusta a data para o input HTML <input type="date">
      const dateForInput = initialData.releaseDate ? initialData.releaseDate.split('T')[0] : today;
      setFormData({ ...initialData, releaseDate: dateForInput });
    } else {
      setFormData({ episodeNumber: 1, title: '', description: '', releaseDate: today, season: '' });
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave({ ...formData, episodeNumber: Number(formData.episodeNumber) }, isEditing);
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ className: styles.dialogPaper }}>
      <form onSubmit={handleSubmit}>
        <DialogTitle className={styles.dialogTitle}>
          {isEditing ? `Editar Episódio ${formData.episodeNumber}` : 'Novo Episódio'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" className={styles.subtitle}>
            Preencha os detalhes do episódio abaixo.
          </Typography>

          <TextField
            label="Número do Episódio"
            type="number"
            fullWidth
            required
            disabled={isEditing}
            inputProps={{ min: 1 }}
            value={formData.episodeNumber}
            onChange={(e) => setFormData({ ...formData, episodeNumber: Number(e.target.value) })}
            className={styles.inputField}
          />
          <TextField
            label="Título"
            fullWidth
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={styles.inputField}
          />
          <TextField
            label="Data de Lançamento"
            type="date"
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            value={formData.releaseDate}
            onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
            className={styles.inputField}
          />
          <TextField
            label="Avaliação (Rating)"
            type="number"
            fullWidth
            inputProps={{ min: 0, max: 10, step: 0.1 }}
            placeholder="Opcional"
            value={formData.rating ?? ''}
            onChange={(e) => setFormData({ ...formData, rating: e.target.value ? Number(e.target.value) : undefined })}
            className={styles.inputField}
          />
          <TextField
            label="Sinopse / Descrição"
            fullWidth
            multiline
            rows={3}
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={styles.inputField}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions className={styles.actions}>
          <Button onClick={onClose} color="inherit" disabled={loading} className={styles.cancelButton}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={loading} disableElevation className={styles.saveButton}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Salvar Episódio'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}