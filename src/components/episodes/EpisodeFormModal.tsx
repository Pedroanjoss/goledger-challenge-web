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
  const [errors, setErrors] = useState<Partial<Record<keyof Episode, string>>>({});
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      const dateForInput = initialData.releaseDate ? initialData.releaseDate.split('T')[0] : today;
      setFormData({ ...initialData, releaseDate: dateForInput });
    } else {
      setFormData({ episodeNumber: 1, title: '', description: '', releaseDate: today, season: '' });
    }
    setErrors({});
  }, [initialData, open, today]);

  const handleChange = (field: keyof Episode, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof Episode, string>> = {};
    if (!formData.episodeNumber || formData.episodeNumber < 1) newErrors.episodeNumber = "Número deve ser maior que 0.";
    if (!formData.title.trim()) newErrors.title = "O título é obrigatório.";
    if (!formData.releaseDate) newErrors.releaseDate = "A data de lançamento é obrigatória.";
    if (!formData.description.trim()) newErrors.description = "A descrição é obrigatória.";
    if (formData.rating !== undefined && (formData.rating < 0 || formData.rating > 10)) {
      newErrors.rating = "A avaliação deve ser entre 0 e 10.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    await onSave({ ...formData, episodeNumber: Number(formData.episodeNumber) }, isEditing);
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ className: styles.dialogPaper }}>
      <form onSubmit={handleSubmit} noValidate>
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
            disabled={isEditing}
            value={formData.episodeNumber}
            onChange={(e) => handleChange('episodeNumber', Number(e.target.value))}
            error={!!errors.episodeNumber}
            helperText={errors.episodeNumber}
            className={styles.inputField}
          />
          <TextField
            label="Título"
            fullWidth
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            className={styles.inputField}
          />
          <TextField
            label="Data de Lançamento"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.releaseDate}
            onChange={(e) => handleChange('releaseDate', e.target.value)}
            error={!!errors.releaseDate}
            helperText={errors.releaseDate}
            className={styles.inputField}
          />
          <TextField
            label="Avaliação (Rating)"
            type="number"
            fullWidth
            inputProps={{ min: 0, max: 10, step: 0.1 }}
            placeholder="Opcional"
            value={formData.rating ?? ''}
            onChange={(e) => handleChange('rating', e.target.value ? Number(e.target.value) : undefined)}
            error={!!errors.rating}
            helperText={errors.rating || "Deixe em branco se não houver"}
            className={styles.inputField}
          />
          <TextField
            label="Sinopse / Descrição"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            error={!!errors.description}
            helperText={errors.description}
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