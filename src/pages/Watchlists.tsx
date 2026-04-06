import { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

import { watchlistService, tvShowService } from "../services/api";
import type { Watchlist, TvShow } from "../types";

import { WatchlistCard } from "../components/watchlists/WatchlistCard";
import { WatchlistFormModal } from "../components/watchlists/WatchlistFormModal";
import { DeleteConfirmModal } from "../common/DeleteConfirmModal";
import styles from "./style/Watchlists.module.css";
import { getErrorMessage } from "../utils/errorHandle";

export function Watchlists() {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [availableShows, setAvailableShows] = useState<TvShow[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWatchlist, setSelectedWatchlist] = useState<Watchlist | null>(
    null,
  );

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [watchlistToDelete, setWatchlistToDelete] = useState<Watchlist | null>(
    null,
  );
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const loadData = async () => {
    try {
      setLoading(true);

      const [watchlistsData, showsData] = await Promise.all([
        watchlistService.list(),
        tvShowService.list(),
      ]);
      setWatchlists(watchlistsData);
      setAvailableShows(showsData);
    } catch (error) {
      showToast("Erro ao carregar dados.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenForm = (watchlist?: Watchlist) => {
    setSelectedWatchlist(watchlist || null);
    setModalOpen(true);
  };

  const handleSave = async (
    watchlistData: Watchlist,
    selectedShowsKeys: string[],
    isEditing: boolean,
  ) => {
    try {
      if (isEditing) {
        await watchlistService.update(watchlistData, selectedShowsKeys);
        showToast("Watchlist atualizada!", "success");
      } else {
        await watchlistService.create(watchlistData, selectedShowsKeys);
        showToast("Watchlist cadastrada!", "success");
      }
      setModalOpen(false);
      loadData();
    } catch (error) {
      const msg = getErrorMessage(error, "Erro ao salvar Watchlist.");
      showToast(msg, "error");
    }
  };

  const confirmDelete = (watchlist: Watchlist) => {
    setWatchlistToDelete(watchlist);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!watchlistToDelete || !watchlistToDelete["@key"]) return;
    try {
      setDeleteLoading(true);
      await watchlistService.delete(watchlistToDelete["@key"]);
      showToast("Watchlist excluída com sucesso!", "success");
      setWatchlists((prev) =>
        prev.filter((w) => w["@key"] !== watchlistToDelete["@key"]),
      );
      setDeleteModalOpen(false);
    } catch (error) {
      const msg = getErrorMessage(error, "Erro ao excluir Watchlist.");
      showToast(msg, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const showToast = (message: string, severity: "success" | "error") =>
    setSnackbar({ open: true, message, severity });

  return (
    <Container className={styles.container}>
      <Box
        mb={4}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
      >
        <Box>
          <Typography
            variant="h3"
            color="secondary"
            className={styles.pageTitle}
          >
            Minhas Listas
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Agrupe suas séries favoritas para assistir depois.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
          className={styles.addButton}
        >
          Criar Lista
        </Button>
      </Box>

      {loading ? (
        <Box className={styles.loaderContainer}>
          <CircularProgress color="secondary" />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {watchlists.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="body1"
                color="text.secondary"
                align="center"
                sx={{
                  mt: 2,
                  p: 4,
                  border: "1px dashed #475569",
                  borderRadius: 2,
                }}
              >
                Você ainda não criou nenhuma lista.
              </Typography>
            </Grid>
          ) : (
            watchlists.map((watchlist) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={watchlist["@key"]}>
                <WatchlistCard
                  watchlist={watchlist}
                  onEdit={handleOpenForm}
                  onDelete={confirmDelete}
                />
              </Grid>
            ))
          )}
        </Grid>
      )}

      <WatchlistFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={selectedWatchlist}
        availableShows={availableShows}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        titleToDelete={watchlistToDelete ? watchlistToDelete.title : ""}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
