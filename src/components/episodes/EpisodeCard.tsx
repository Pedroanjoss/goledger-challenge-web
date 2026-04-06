import { Card, CardContent, CardActions, Typography, IconButton, Chip, Box } from '@mui/material';
import { DeleteOutline, EditOutlined, CalendarToday } from '@mui/icons-material';
import type { Episode } from '../../types';
import styles from './style/EpisodeCard.module.css';

interface EpisodeCardProps {
  episode: Episode;
  onEdit: (episode: Episode) => void;
  onDelete: (episode: Episode) => void;
}

export function EpisodeCard({ episode, onEdit, onDelete }: EpisodeCardProps) {
  // Formata a data ISO do banco para exibir bonito (ex: 03/04/2026)
  const displayDate = new Date(episode.releaseDate).toLocaleDateString('pt-BR');

  return (
    <Card className={styles.card} sx={{ bgcolor: 'background.paper' }}>
      <Box className={styles.header}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Chip label={`Ep. ${episode.episodeNumber}`} size="small" color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
          {episode.rating && <Chip label={`⭐ ${episode.rating}`} size="small" color="warning" variant="filled" sx={{ fontWeight: 600 }} />}
        </Box>
        <Typography variant="h6" noWrap title={episode.title} className={styles.title}>
          {episode.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" gap={0.5}>
          <CalendarToday fontSize="inherit" /> Lançado em: {displayDate}
        </Typography>
      </Box>
      <CardContent className={styles.content}>
        <Typography variant="body2" color="text.secondary" className={styles.description}>
          {episode.description}
        </Typography>
      </CardContent>
      <CardActions className={styles.actions}>
        <IconButton size="small" onClick={() => onEdit(episode)} className={styles.editButton}>
          <EditOutlined color="primary" fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => onDelete(episode)} className={styles.deleteButton}>
          <DeleteOutline color="error" fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
  );
}