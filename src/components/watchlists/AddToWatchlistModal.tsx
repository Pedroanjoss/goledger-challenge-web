import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Typography, CircularProgress, Box, Button, TextField, Chip } from '@mui/material';
import { PlaylistAdd, Add as AddIcon, CheckCircleOutline } from '@mui/icons-material';
import type { Watchlist } from '../../types';
import styles from './style/AddToWatchlistModal.module.css';

interface AddToWatchlistModalProps {
  open: boolean;
  onClose: () => void;
  watchlists: Watchlist[];
  showKey: string | undefined; 
  onSelect: (watchlist: Watchlist) => Promise<void>;
  onCreateNew: (title: string) => Promise<void>; 
  loading: boolean;
}

export function AddToWatchlistModal({ open, onClose, watchlists, showKey, onSelect, onCreateNew, loading }: AddToWatchlistModalProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  const handleClose = () => {
    setIsCreating(false);
    setNewTitle('');
    onClose();
  };

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    setCreateLoading(true);
    await onCreateNew(newTitle.trim());
    setCreateLoading(false);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs" PaperProps={{ className: styles.dialogPaper }}>
      <DialogTitle sx={{ fontWeight: 'bold' }}>Adicionar à Minha Lista</DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}><CircularProgress color="secondary" /></Box>
        ) : (
          <>
            {watchlists.length === 0 && !isCreating ? (
              <Typography className={styles.empty}>Você ainda não tem listas criadas.</Typography>
            ) : (
              !isCreating && (
                <List sx={{ p: 1, maxHeight: '300px', overflowY: 'auto' }}>
                  {watchlists.map((list) => {
                    // VERIFICAÇÃO DE DUPLICATA:
                    const isAlreadyInList = list.tvShows?.some(s => s['@key'] === showKey);

                    return (
                      <ListItem key={list['@key']} disablePadding className={styles.listOption}>
                        <ListItemButton 
                          onClick={() => onSelect(list)} 
                          disabled={isAlreadyInList} // Desabilita o clique se já estiver na lista
                          sx={{ borderRadius: '8px' }}
                        >
                          <ListItemIcon>
                            {isAlreadyInList ? <CheckCircleOutline color="disabled" /> : <PlaylistAdd color="secondary" />}
                          </ListItemIcon>
                          <ListItemText 
                            primary={list.title} 
                            secondary={isAlreadyInList ? "Esta série já está nesta lista" : `${list.tvShows?.length || 0} séries`} 
                            primaryTypographyProps={{ color: isAlreadyInList ? 'text.disabled' : 'text.primary' }}
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              )
            )}

            <Box className={styles.createSection}>
              {!isCreating ? (
                <Button
                  startIcon={<AddIcon />}
                  color="secondary"
                  className={styles.createButton}
                  onClick={() => setIsCreating(true)}
                >
                  Criar Nova Lista
                </Button>
              ) : (
                <Box display="flex" flexDirection="column" gap={2} p={2}>
                  <Typography variant="subtitle2" color="secondary" fontWeight="bold">Nova Lista</Typography>
                  <TextField
                    autoFocus
                    size="small"
                    label="Nome da lista"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    fullWidth
                  />
                  <Box display="flex" justifyContent="flex-end" gap={1}>
                    <Button size="small" onClick={() => setIsCreating(false)} disabled={createLoading} sx={{ textTransform: 'none' }}>
                      Cancelar
                    </Button>
                    <Button size="small" variant="contained" color="secondary" onClick={handleCreate} disabled={createLoading || !newTitle.trim()} disableElevation sx={{ textTransform: 'none' }}>
                      {createLoading ? <CircularProgress size={20} color="inherit" /> : 'Criar e Adicionar'}
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}