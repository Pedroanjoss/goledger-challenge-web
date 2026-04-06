import { Card, CardContent, CardActions, Typography, IconButton, Chip, Box, Button } from '@mui/material';
import { DeleteOutline, EditOutlined, FormatListNumbered } from '@mui/icons-material';
import type { Season } from '../../types';
import styles from './style/SeasonCard.module.css';

interface SeasonCardProps {
  season: Season;
  onEdit: (season: Season) => void;
  onDelete: (season: Season) => void;
  onViewEpisodes: (seasonKey: string) => void; 
}

export function SeasonCard({ season, onEdit, onDelete, onViewEpisodes }: SeasonCardProps) {
  return (
    <Card className={styles.card} sx={{ bgcolor: 'background.paper' }}>
      <CardContent className={styles.header}>
        <Typography variant="h5" className={styles.title}>
          Temporada {season.number}
        </Typography>
        <Chip label={`Lançamento: ${season.year}`} size="small" variant="outlined" color="primary" />
      </CardContent>
      
      <CardActions className={styles.actions}>
        <Button 
          size="small" 
          startIcon={<FormatListNumbered />} 
          onClick={() => onViewEpisodes(season['@key']!)}
          className={styles.episodesButton}
        >
          Episódios
        </Button>
        <Box display="flex" gap={1}>
          <IconButton size="small" onClick={() => onEdit(season)} className={styles.editButton}>
            <EditOutlined color="primary" fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(season)} className={styles.deleteButton}>
            <DeleteOutline color="error" fontSize="small" />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
}