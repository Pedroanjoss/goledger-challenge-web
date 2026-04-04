import { Dialog, DialogActions, DialogContent, DialogTitle, Button, CircularProgress, Typography } from '@mui/material';
import { WarningAmber } from '@mui/icons-material';
import styles from './style/DeleteConfirmModal.module.css';

interface DeleteConfirmModalProps {
  open: boolean;
  titleToDelete: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

export function DeleteConfirmModal({ open, titleToDelete, onClose, onConfirm, loading }: DeleteConfirmModalProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ className: styles.dialogPaper }}>
      <DialogTitle className={styles.dialogTitle}>
        <WarningAmber color="error" /> Excluir Registro
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" className={styles.subtitle}>
          Tem certeza que deseja excluir permanentemente <strong>{titleToDelete}</strong>?
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Esta ação não poderá ser desfeita.
        </Typography>
      </DialogContent>
      <DialogActions className={styles.actions}>
        <Button onClick={onClose} color="inherit" disabled={loading} className={styles.cancelButton}>
          Cancelar
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error" disabled={loading} disableElevation className={styles.deleteButton}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Excluir'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}