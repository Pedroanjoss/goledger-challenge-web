import { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, CircularProgress, Typography } from '@mui/material';
import type { Season } from '../../types';
import styles from './style/SeasonFormModal.module.css';

interface SeasonFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (season: Season, isEditing: boolean) => Promise<void>;
  initialData?: Season | null;
  activeTvShow: string; 
}

export function SeasonFormModal({ open, onClose, onSave, initialData, activeTvShow }: SeasonFormModalProps) {
  const [formData, setFormData] = useState<Season>({ number: 1, year: 2024, tvShow: '' });
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ number: 1, year: new Date().getFullYear(), tvShow: '' });
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave({ ...formData, number: Number(formData.number), year: Number(formData.year) }, isEditing);
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ className: styles.dialogPaper }}>
      <form onSubmit={handleSubmit}>
        <DialogTitle className={styles.dialogTitle}>
          {isEditing ? `Editar Temp. ${formData.number}` : 'Nova Temporada'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" className={styles.subtitle}>
            Vinculando à série: <strong>{activeTvShow}</strong>
          </Typography>

          <TextField
            label="Número da Temporada"
            type="number"
            fullWidth
            required
            disabled={isEditing} 
            inputProps={{ min: 1 }}
            value={formData.number}
            onChange={(e) => setFormData({ ...formData, number: Number(e.target.value) })}
            className={styles.inputField}
          />
          
          <TextField
            label="Ano de Lançamento"
            type="number"
            fullWidth
            required
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
            className={styles.inputField}
          />
        </DialogContent>
        <DialogActions className={styles.actions}>
          <Button onClick={onClose} color="inherit" disabled={loading} className={styles.cancelButton}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={loading} disableElevation className={styles.saveButton}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Salvar Temporada'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}