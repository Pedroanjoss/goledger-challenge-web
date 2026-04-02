import { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, CircularProgress, Typography, MenuItem } from '@mui/material';
import type { Season, TvShow } from '../../types';
import styles from './style/SeasonFormModal.module.css';

interface SeasonFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (season: Season, selectedShowTitle: string, isEditing: boolean) => Promise<void>;
  initialData?: Season | null;
  availableShows: TvShow[]; // Recebemos as séries para montar o Dropdown
}

export function SeasonFormModal({ open, onClose, onSave, initialData, availableShows }: SeasonFormModalProps) {
  const [formData, setFormData] = useState<Season>({ number: 1, year: 2024, tvShow: '' });
  const [selectedShow, setSelectedShow] = useState('');
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      // Extrai o título da série do objeto de relacionamento que vem da API
      setSelectedShow(initialData.tvShow['@key'] || '');
    } else {
      setFormData({ number: 1, year: new Date().getFullYear(), tvShow: '' });
      setSelectedShow('');
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShow) return; // Validação simples
    setLoading(true);
    
    await onSave({ 
      ...formData, 
      number: Number(formData.number), 
      year: Number(formData.year) 
    }, selectedShow, isEditing);
    
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ className: styles.dialogPaper }}>
      <form onSubmit={handleSubmit}>
        <DialogTitle className={styles.dialogTitle}>
          {isEditing ? 'Editar Temporada' : 'Nova Temporada'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" className={styles.subtitle}>
            Vincule uma nova temporada a uma série existente no catálogo.
          </Typography>
          
          <TextField
            select
            label="Série (TV Show)"
            fullWidth
            required
            disabled={isEditing} // Chave composta não pode mudar após criar
            value={selectedShow}
            onChange={(e) => setSelectedShow(e.target.value)}
            className={styles.inputField}
          >
            {availableShows.map((show) => (
              <MenuItem key={show.title} value={show.title}>
                {show.title}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Número da Temporada"
            type="number"
            fullWidth
            required
            disabled={isEditing} // Chave composta não pode mudar após criar
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