import { Card, CardContent, CardActions, Typography, IconButton, Chip, Box, Button, Tooltip } from '@mui/material';
import { DeleteOutline, EditOutlined, FormatListNumbered, PlaylistAdd, PlaylistAddCheck } from '@mui/icons-material';
import type { TvShow, Watchlist } from '../../types';
import styles from './style/TvShowCard.module.css';

interface TvShowCardProps {
  show: TvShow;
  inWatchlists: Watchlist[]; // NOVA PROP: Recebe as listas onde essa série está
  onEdit: (show: TvShow) => void;
  onDelete: (show: TvShow) => void; 
  onViewSeasons: (title: string) => void;
  onAddToWatchlist: (show: TvShow) => void;
}

export function TvShowCard({ show, inWatchlists, onEdit, onDelete, onViewSeasons, onAddToWatchlist }: TvShowCardProps) {
  // Lógica Visual da Watchlist
  const isSaved = inWatchlists.length > 0;
  const tooltipText = isSaved 
    ? `Salvo em: ${inWatchlists.map(w => w.title).join(', ')}` 
    : "Adicionar à Minha Lista";

  return (
    <Card className={styles.card} sx={{ bgcolor: 'background.paper' }}>
      <CardContent className={styles.header}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="h5" noWrap title={show.title} className={styles.title} sx={{ maxWidth: '75%' }}>
            {show.title}
          </Typography>
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
          
          {/* O BOTÃO COM TOOLTIP INTELIGENTE */}
          <Tooltip title={tooltipText} placement="top" arrow>
            <IconButton 
              size="small" 
              onClick={() => onAddToWatchlist(show)} 
              // Se já estiver salvo, deixa o fundo levemente mais forte para dar destaque
              sx={{ 
                bgcolor: isSaved ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)', 
                color: '#8b5cf6',
                '&:hover': { bgcolor: 'rgba(139, 92, 246, 0.3)' }
              }}
            >
              {isSaved ? <PlaylistAddCheck fontSize="small" /> : <PlaylistAdd fontSize="small" />}
            </IconButton>
          </Tooltip>

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