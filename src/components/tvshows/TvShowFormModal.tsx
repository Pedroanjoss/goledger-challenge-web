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
  const [errors, setErrors] = useState<Partial<Record<keyof TvShow, string>>>({});
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ title: '', description: '', recommendedAge: 0 });
    }
    setErrors({});
  }, [initialData, open]);

  const handleChange = (field: keyof TvShow, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof TvShow, string>> = {};
    if (!formData.title.trim()) newErrors.title = "O título é obrigatório.";
    if (!formData.description.trim()) newErrors.description = "A descrição é obrigatória.";
    if (formData.recommendedAge < 0 || formData.recommendedAge > 18) {
      newErrors.recommendedAge = "A idade recomendada deve estar entre 0 e 18.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    await onSave({ ...formData, recommendedAge: Number(formData.recommendedAge) }, isEditing);
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '12px' } }}>
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          {isEditing ? 'Editar Série' : 'Nova Série'}
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Preencha os detalhes oficiais da série abaixo.
          </Typography>

          <TextField
            label="Título da Série"
            fullWidth
            disabled={isEditing}
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Idade Recomendada"
            type="number"
            fullWidth
            inputProps={{ min: 0, max: 18 }}
            value={formData.recommendedAge}
            onChange={(e) => handleChange('recommendedAge', Number(e.target.value))}
            error={!!errors.recommendedAge}
            helperText={errors.recommendedAge}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Sinopse / Descrição"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            error={!!errors.description}
            helperText={errors.description}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit" disabled={loading} sx={{ textTransform: 'none', fontWeight: 600 }}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={loading} disableElevation sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Salvar Série'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}