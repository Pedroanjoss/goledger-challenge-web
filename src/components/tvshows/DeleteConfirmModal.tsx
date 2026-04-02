import { Dialog, DialogActions, DialogContent, DialogTitle, Button, CircularProgress, Typography } from '@mui/material';

interface DeleteConfirmModalProps {
  open: boolean;
  titleToDelete: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

export function DeleteConfirmModal({ open, titleToDelete, onClose, onConfirm, loading }: DeleteConfirmModalProps) {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 3, maxWidth: 400 } }}>
      <DialogTitle sx={{ color: 'error.main', fontWeight: 700 }}>Confirmar Exclusão</DialogTitle>
      <DialogContent>
        <Typography>
          Tem certeza que deseja excluir permanentemente a série <strong>{titleToDelete}</strong>?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Esta ação não poderá ser desfeita na blockchain.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} color="inherit" disabled={loading} sx={{ textTransform: 'none', fontWeight: 600 }}>
          Cancelar
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" disableElevation disabled={loading} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Excluir'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}