import { Card, CardContent, CardActions, Typography, IconButton, Chip, Box, Button } from '@mui/material'; // Importei Button
import { DeleteOutline, EditOutlined, FormatListNumbered } from '@mui/icons-material'; // Novo ícone
import type { TvShow } from '../../types';
import styles from './style/TvShowCard.module.css';

interface TvShowCardProps {
  show: TvShow;
  onEdit: (show: TvShow) => void;
  onDelete: (title: string) => void;
  onViewSeasons: (title: string) => void; 
}

export function TvShowCard({ show, onEdit, onDelete, onViewSeasons }: TvShowCardProps) {
  return (
    <Card className={styles.card}>

      <Box className={styles.header}>
        <Chip label={`${show.recommendedAge}+ Anos`} size="small" className={styles.chip} color={show.recommendedAge >= 18 ? "error" : "success"} variant="outlined" />
        <Typography variant="h6" noWrap title={show.title} className={styles.title}>{show.title}</Typography>
      </Box>
      <CardContent className={styles.content}>
        <Typography variant="body2" color="text.secondary" className={styles.description}>{show.description}</Typography>
      </CardContent>

    
      <CardActions className={styles.actions} sx={{ justifyContent: 'space-between' }}>
        <Button 
          size="small" 
          startIcon={<FormatListNumbered />} 
          onClick={() => onViewSeasons(show.title)}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Temporadas
        </Button>
        <Box display="flex" gap={1}>
          <IconButton size="small" onClick={() => onEdit(show)} className={styles.editButton} title="Editar"><EditOutlined fontSize="small" color="primary" /></IconButton>
          <IconButton size="small" onClick={() => onDelete(show.title)} className={styles.deleteButton} title="Excluir"><DeleteOutline fontSize="small" color="error" /></IconButton>
        </Box>
      </CardActions>
    </Card>
  );
}