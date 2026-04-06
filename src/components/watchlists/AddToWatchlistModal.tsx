import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Typography, CircularProgress, Box, Button, TextField } from '@mui/material';
import { PlaylistAdd, Add as AddIcon } from '@mui/icons-material';
import type { Watchlist } from '../../types';
import styles from './style/AddToWatchlistModal.module.css';

interface AddToWatchlistModalProps {
  open: boolean;
  onClose: () => void;
  watchlists: Watchlist[];
  onSelect: (watchlist: Watchlist) => Promise<void>;
  onCreateNew: (title: string) => Promise<void>; // Nova função que passaremos!
  loading: boolean;
}

export function AddToWatchlistModal({ open, onClose, watchlists, onSelect, onCreateNew, loading }: AddToWatchlistModalProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  // Zera o estado ao fechar
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
      
      {/* Retiramos os dividers para o visual ficar mais limpo com a nova seção */}
      <DialogContent sx={{ p: 0 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}><CircularProgress color="secondary" /></Box>
        ) : (
          <>
            {/* 1. ÁREA DE LISTAS EXISTENTES */}
            {watchlists.length === 0 && !isCreating ? (
              <Typography className={styles.empty}>Você ainda não tem listas criadas.</Typography>
            ) : (
              !isCreating && (
                <List sx={{ p: 1, maxHeight: '300px', overflowY: 'auto' }}>
                  {watchlists.map((list) => (
                    <ListItem key={list['@key']} disablePadding className={styles.listOption}>
                      <ListItemButton onClick={() => onSelect(list)} sx={{ borderRadius: '8px' }}>
                        <ListItemIcon><PlaylistAdd color="secondary" /></ListItemIcon>
                        <ListItemText primary={list.title} secondary={`${list.tvShows?.length || 0} séries`} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              )
            )}

            {/* 2. ÁREA DE CRIAÇÃO (On the fly) */}
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
                <Box display="flex" flexDirection="column" gap={2}>
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