import { Card, CardContent, CardActions, Typography, IconButton, Chip, Box, Button, Tooltip } from '@mui/material';
import { DeleteOutline, EditOutlined, FormatListNumbered, PlaylistAdd, PlaylistAddCheck } from '@mui/icons-material';
import type { TvShow, Watchlist } from '../../types';
import styles from './style/TvShowCard.module.css';

interface TvShowCardProps {
  show: TvShow;
  inWatchlists: Watchlist[]; 
  onEdit: (show: TvShow) => void;
  onDelete: (show: TvShow) => void; 
  onViewSeasons: (title: string) => void;
  onAddToWatchlist: (show: TvShow) => void;
  onViewDetails: (show: TvShow) => void;
}

export function TvShowCard({ show, inWatchlists, onEdit, onDelete, onViewSeasons, onAddToWatchlist, onViewDetails }: TvShowCardProps) {
  
  const isSaved = inWatchlists.length > 0;
  const tooltipText = isSaved 
    ? `Salvo em: ${inWatchlists.map(w => w.title).join(', ')}` 
    : "Adicionar à Minha Lista";

  return (
    <Card className={styles.card} sx={{ bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* A MÁGICA ESTÁ AQUI: Trocamos o CardActionArea por um Box.
        Ele dá um brilho branco super sutil de 3% de opacidade no hover,
        sem criar bordas duras.
      */}
      <Box 
        onClick={() => onViewDetails(show)} 
        sx={{ 
          flexGrow: 1, 
          cursor: 'pointer',
          transition: 'background-color 0.2s ease',
          '&:hover': { 
            bgcolor: 'rgba(255,255,255,0.03)' 
          }
        }}
      >
        <CardContent sx={{ pb: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
            <Typography variant="h5" noWrap title={show.title} sx={{ fontWeight: 700, maxWidth: '75%' }}>
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
      </Box>
      

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2, pt: 1 }}>
        <Button 
          size="small" 
          startIcon={<FormatListNumbered />} 
          onClick={() => onViewSeasons(show.title)}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Temporadas
        </Button>
        <Box display="flex" gap={1}>
          <Tooltip title={tooltipText} placement="top" arrow>
            <IconButton 
              size="small" 
              onClick={() => onAddToWatchlist(show)} 
              sx={{ 
                bgcolor: isSaved ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)', 
                color: '#8b5cf6',
                '&:hover': { bgcolor: 'rgba(139, 92, 246, 0.3)' }
              }}
            >
              {isSaved ? <PlaylistAddCheck fontSize="small" /> : <PlaylistAdd fontSize="small" />}
            </IconButton>
          </Tooltip>

          <IconButton size="small" onClick={() => onEdit(show)} sx={{ bgcolor: 'rgba(59, 130, 246, 0.1)' }} title="Editar Série">
            <EditOutlined color="primary" fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(show)} sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)' }} title="Excluir Série">
            <DeleteOutline color="error" fontSize="small" />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
}