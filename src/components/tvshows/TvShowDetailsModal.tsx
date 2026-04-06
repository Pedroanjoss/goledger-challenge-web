import { Dialog, DialogContent, DialogTitle, Typography, Button, Box, Chip, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import type { TvShow } from '../../types';
import styles from './style/TvShowDetailsModal.module.css';

interface TvShowDetailsModalProps {
  open: boolean;
  onClose: () => void;
  show: TvShow | null;
}

export function TvShowDetailsModal({ open, onClose, show }: TvShowDetailsModalProps) {
  if (!show) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ className: styles.dialogPaper }}>
      <DialogTitle className={styles.dialogTitle}>
        <Box>
          <Typography variant="h5" color="primary" className={styles.showTitle}>
            {show.title}
          </Typography>
          <Chip 
            label={`${show.recommendedAge} anos`} 
            size="small" 
            color={show.recommendedAge >= 18 ? 'error' : 'primary'} 
            variant="outlined" 
            className={styles.ageChip}
          />
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Typography variant="subtitle2" color="text.secondary" className={styles.sectionTitle}>
          Sinopse / Descrição
        </Typography>
        <Typography variant="body1" className={styles.descriptionText}>
          {show.description || 'Nenhuma descrição cadastrada para esta série.'}
        </Typography>
      </DialogContent>
      
      <Box className={styles.footerBox}>
        <Button 
          onClick={onClose} 
          variant="contained" 
          disableElevation 
          className={styles.closeButton}
        >
          Fechar
        </Button>
      </Box>
    </Dialog>
  );
}