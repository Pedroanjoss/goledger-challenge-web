import { Card, CardContent, CardActions, Typography, IconButton, Chip, Box, Button } from '@mui/material';
import { DeleteOutline, EditOutlined, FormatListNumbered, PlaylistAdd } from '@mui/icons-material';
import type { TvShow } from '../../types';
import styles from './style/TvShowCard.module.css';

interface TvShowCardProps {
  show: TvShow;
  onEdit: (show: TvShow) => void;
  onDelete: (show: TvShow) => void; 
  onViewSeasons: (title: string) => void;
  onAddToWatchlist: (show: TvShow) => void;
}

export function TvShowCard({ show, onEdit, onDelete, onViewSeasons, onAddToWatchlist }: TvShowCardProps) {
  return (
    <Card className={styles.card} sx={{ bgcolor: 'background.paper' }}>
      <CardContent className={styles.header}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="h5" noWrap title={show.title} className={styles.title} sx={{ maxWidth: '75%' }}>
            {show.title}
          </Typography>
          {/* Mostra a idade recomendada: vermelho se for +18, azul caso contrário */}
          <Chip 
            label={`${show.recommendedAge}+`} 
            size="small" 
            color={show.recommendedAge >= 18 ? 'error' : 'primary'} 
            variant="outlined" 
            sx={{ fontWeight: 'bold' }}
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {show.description || 'Sem descrição cadastrada.'}
        </Typography>
      </CardContent>
      
      <CardActions className={styles.actions}>
        <Button 
          size="small" 
          startIcon={<FormatListNumbered />} 
          onClick={() => onViewSeasons(show.title)}
          className={styles.seasonsButton}
        >
          Temporadas
        </Button>
        <Box display="flex" gap={1}>
          <IconButton size="small" onClick={() => onAddToWatchlist(show)} className={styles.watchlistButton} title="Adicionar à Minha Lista">
            <PlaylistAdd fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onEdit(show)} className={styles.editButton} title="Editar Série">
            <EditOutlined color="primary" fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(show)} className={styles.deleteButton} title="Excluir Série">
            <DeleteOutline color="error" fontSize="small" />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
}