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
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState<Season>({ number: 1, year: currentYear, tvShow: '' });
  
  // CORREÇÃO AQUI: Tipagem flexível que aceita qualquer chave de Season
  const [errors, setErrors] = useState<Partial<Record<keyof Season, string>>>({}); 
  
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ number: 1, year: currentYear, tvShow: '' });
    }
    setErrors({}); // Limpa os erros ao abrir/fechar o modal
  }, [initialData, open, currentYear]);

  // Função elegante que atualiza o dado e já apaga o erro da tela sem reclamar
  const handleChange = (field: keyof Season, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof Season, string>> = {};
    if (!formData.number || formData.number < 1) {
      newErrors.number = "O número da temporada deve ser maior que 0.";
    }
    if (!formData.year || formData.year < 1900 || formData.year > 2100) {
      newErrors.year = "Insira um ano de lançamento válido.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return; // Se a validação falhar, para por aqui!

    setLoading(true);
    await onSave({ ...formData, number: Number(formData.number), year: Number(formData.year) }, isEditing);
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ className: styles.dialogPaper }}>
      <form onSubmit={handleSubmit} noValidate>
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
            disabled={isEditing} 
            value={formData.number}
            onChange={(e) => handleChange('number', Number(e.target.value))}
            error={!!errors.number} 
            helperText={errors.number} 
            className={styles.inputField}
          />
          
          <TextField
            label="Ano de Lançamento"
            type="number"
            fullWidth
            value={formData.year}
            onChange={(e) => handleChange('year', Number(e.target.value))}
            error={!!errors.year}
            helperText={errors.year}
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