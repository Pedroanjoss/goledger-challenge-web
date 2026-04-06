import { Card, CardContent, CardActions, Typography, IconButton, Chip, Box } from '@mui/material';
import { DeleteOutline, EditOutlined, Theaters } from '@mui/icons-material';
import type { Watchlist } from '../../types';
import styles from './style/WatchlistCard.module.css';

interface WatchlistCardProps {
  watchlist: Watchlist;
  onEdit: (watchlist: Watchlist) => void;
  onDelete: (watchlist: Watchlist) => void;
}

export function WatchlistCard({ watchlist, onEdit, onDelete }: WatchlistCardProps) {
  // Conta quantas séries existem na lista
  const showsCount = watchlist.tvShows ? watchlist.tvShows.length : 0;

  return (
    <Card className={styles.card} sx={{ bgcolor: 'background.paper' }}>
      <Box className={styles.header}>
        <Typography variant="h5" noWrap title={watchlist.title} className={styles.title}>
          {watchlist.title}
        </Typography>
        <Chip 
          icon={<Theaters fontSize="small" />} 
          label={`${showsCount} Série${showsCount !== 1 ? 's' : ''}`} 
          size="small" 
          color="secondary" 
          variant="outlined" 
        />
      </Box>
      <CardContent className={styles.content}>
        <Typography variant="body2" color="text.secondary" className={styles.description}>
          {watchlist.description || 'Sem descrição.'}
        </Typography>
      </CardContent>
      <CardActions className={styles.actions}>
        <IconButton size="small" onClick={() => onEdit(watchlist)} className={styles.editButton}>
          <EditOutlined color="secondary" fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => onDelete(watchlist)} className={styles.deleteButton}>
          <DeleteOutline color="error" fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
  );
}