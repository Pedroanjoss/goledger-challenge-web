import { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, CircularProgress, Typography, MenuItem, Select, InputLabel, FormControl, OutlinedInput, Checkbox, ListItemText, Chip, Box, FormHelperText } from '@mui/material';
import type { Watchlist, TvShow } from '../../types';
import styles from './style/WatchlistFormModal.module.css';

interface WatchlistFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (watchlist: Watchlist, selectedShowsKeys: string[], isEditing: boolean) => Promise<void>;
  initialData?: Watchlist | null;
  availableShows: TvShow[];
}

export function WatchlistFormModal({ open, onClose, onSave, initialData, availableShows }: WatchlistFormModalProps) {
  const [formData, setFormData] = useState<Watchlist>({ title: '', description: '' });
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ title?: string }>({});
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setSelectedKeys(initialData.tvShows ? initialData.tvShows.map(show => show['@key']) : []);
    } else {
      setFormData({ title: '', description: '' });
      setSelectedKeys([]);
    }
    setErrors({});
  }, [initialData, open]);

  const handleChangeTitle = (value: string) => {
    setFormData(prev => ({ ...prev, title: value }));
    if (errors.title) setErrors({});
  };

  const validate = () => {
    if (!formData.title.trim()) {
      setErrors({ title: "O título da lista é obrigatório." });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    await onSave(formData, selectedKeys, isEditing);
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ className: styles.dialogPaper }}>
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle className={styles.dialogTitle}>
          {isEditing ? 'Editar Watchlist' : 'Nova Watchlist'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" className={styles.subtitle}>
            Crie listas personalizadas e adicione suas séries favoritas.
          </Typography>

          <TextField
            label="Título da Lista"
            fullWidth
            disabled={isEditing}
            value={formData.title}
            onChange={(e) => handleChangeTitle(e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            className={styles.inputField}
          />

          <FormControl fullWidth className={styles.inputField}>
            <InputLabel>Séries na Lista</InputLabel>
            <Select
              multiple
              value={selectedKeys}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedKeys(typeof value === 'string' ? value.split(',') : value);
              }}
              input={<OutlinedInput label="Séries na Lista" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((key) => {
                    const show = availableShows.find(s => s['@key'] === key);
                    return <Chip key={key} label={show ? show.title : 'Desconhecida'} size="small" />;
                  })}
                </Box>
              )}
            >
              {availableShows.map((show) => (
                <MenuItem key={show['@key']} value={show['@key']}>
                  <Checkbox checked={selectedKeys.indexOf(show['@key']!) > -1} />
                  <ListItemText primary={show.title} />
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Opcional: Você pode adicionar séries depois.</FormHelperText>
          </FormControl>

          <TextField
            label="Descrição (Opcional)"
            fullWidth
            multiline
            rows={3}
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={styles.inputField}
          />
        </DialogContent>
        <DialogActions className={styles.actions}>
          <Button onClick={onClose} color="inherit" disabled={loading} className={styles.cancelButton}>Cancelar</Button>
          <Button type="submit" variant="contained" color="secondary" disabled={loading} disableElevation className={styles.saveButton}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Salvar Lista'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}