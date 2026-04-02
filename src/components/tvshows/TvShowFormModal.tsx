import { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, CircularProgress, Typography } from '@mui/material';
import type { TvShow } from '../../types';

interface TvShowFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (show: TvShow, isEditing: boolean) => Promise<void>;
  initialData?: TvShow | null;
}

export function TvShowFormModal({ open, onClose, onSave, initialData }: TvShowFormModalProps) {
  const [formData, setFormData] = useState<TvShow>({ title: '', description: '', recommendedAge: 0 });
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData;

 
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ title: '', description: '', recommendedAge: 0 });
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave({ ...formData, recommendedAge: Number(formData.recommendedAge) }, isEditing);
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ pb: 1, fontWeight: 700 }}>
          {isEditing ? 'Editar Série' : 'Nova Série'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {isEditing ? 'Atualize as informações desta série na blockchain.' : 'Preencha os dados para registrar uma nova série no catálogo.'}
          </Typography>
          <TextField
            autoFocus
            label="Título da Série (Chave Única)"
            fullWidth
            required
            disabled={isEditing}
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            sx={{ mb: 2.5 }}
          />
          <TextField
            label="Sinopse"
            fullWidth
            required
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ mb: 2.5 }}
          />
          <TextField
            label="Idade Recomendada"
            type="number"
            fullWidth
            required
            inputProps={{ min: 0, max: 18 }}
            value={formData.recommendedAge}
            onChange={(e) => setFormData({ ...formData, recommendedAge: Number(e.target.value) })}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={onClose} color="inherit" disabled={loading} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={loading} disableElevation sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : (isEditing ? 'Salvar Alterações' : 'Cadastrar Série')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}