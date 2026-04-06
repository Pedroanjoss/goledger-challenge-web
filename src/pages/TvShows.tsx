import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Theaters,
} from "@mui/icons-material";

import { tvShowService, watchlistService } from "../services/api";
import type { TvShow, Watchlist } from "../types";

import { TvShowCard } from "../components/tvshows/TvShowCard";
import { TvShowFormModal } from "../components/tvshows/TvShowFormModal";
import { DeleteConfirmModal } from "../common/DeleteConfirmModal";
import { AddToWatchlistModal } from "../components/watchlists/AddToWatchlistModal";
import styles from "./style/TvShows.module.css";
import { getErrorMessage } from "../utils/errorHandle";

export function TvShows() {
  const navigate = useNavigate();

  const [shows, setShows] = useState<TvShow[]>([]);
  const [userWatchlists, setUserWatchlists] = useState<Watchlist[]>([]); // Agora armazena logo na largada
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedShowToEdit, setSelectedShowToEdit] = useState<TvShow | null>(
    null,
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [showToDelete, setShowToDelete] = useState<TvShow | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [watchlistModalOpen, setWatchlistModalOpen] = useState(false);
  const [selectedShowForList, setSelectedShowForList] = useState<TvShow | null>(
    null,
  );

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const loadData = async () => {
    try {
      setLoading(true);

      const [showsData, listsData] = await Promise.all([
        tvShowService.list(),
        watchlistService.list(),
      ]);
      setShows(showsData);
      setUserWatchlists(listsData);
    } catch (error) {
      showToast("Erro ao carregar dados do catálogo.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredShows = useMemo(() => {
    return shows.filter(
      (show) =>
        show.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        show.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [shows, searchTerm]);

  const handleOpenForm = (show?: TvShow) => {
    setSelectedShowToEdit(show || null);
    setFormModalOpen(true);
  };

  const handleSaveShow = async (showData: TvShow, isEditing: boolean) => {
    try {
      if (isEditing) {
        await tvShowService.update(showData);
        showToast("Série atualizada com sucesso!", "success");
      } else {
        await tvShowService.create(showData);
        showToast("Série cadastrada com sucesso!", "success");
      }
      setFormModalOpen(false);
      loadData();
    } catch (error) {
      const msg = getErrorMessage(
        error,
        "Erro ao salvar série. Tente novamente.",
      );
      showToast(msg, "error");
    }
  };

  const confirmDelete = (show: TvShow) => {
    setShowToDelete(show);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!showToDelete || !showToDelete.title) return;
    try {
      setDeleteLoading(true);
      await tvShowService.delete(showToDelete.title);
      showToast("Série excluída com sucesso!", "success");
      setDeleteModalOpen(false);
      loadData();
    } catch (error) {
      const msg = getErrorMessage(
        error,
        "Erro ao excluir série. Verifique se possui temporadas.",
      );
      showToast(msg, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleViewSeasons = (title: string) => {
    navigate(`/tvshows/${encodeURIComponent(title)}/seasons`);
  };

  const handleOpenWatchlistModal = (show: TvShow) => {
    setSelectedShowForList(show);
    setWatchlistModalOpen(true);
  };

  const handleConfirmAddToWatchlist = async (list: Watchlist) => {
    if (!selectedShowForList?.["@key"]) return;
    try {
      await watchlistService.addTvShow(list, selectedShowForList["@key"]);
      showToast(
        `${selectedShowForList.title} adicionada à lista ${list.title}!`,
        "success",
      );
      setWatchlistModalOpen(false);
      loadData();
    } catch (error) {
      const msg = getErrorMessage(error, "Erro ao adicionar à lista.");
    showToast(msg, "error");
    }
  };

  const handleCreateNewWatchlist = async (newTitle: string) => {
    if (!selectedShowForList?.["@key"]) return;
    try {
      await watchlistService.create({ title: newTitle, description: "" }, [
        selectedShowForList["@key"],
      ]);
      showToast(`Lista "${newTitle}" criada e série adicionada!`, "success");
      loadData();
    } catch (error) {
     const msg = getErrorMessage(error, "Erro ao criar nova lista.");
    showToast(msg, "error")
    }
  };

  const showToast = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

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
          <Typography variant="h3" color="primary" className={styles.pageTitle}>
            Catálogo
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Gerencie e explore as séries disponíveis na plataforma.
          </Typography>
        </Box>

        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <TextField
            size="small"
            placeholder="Buscar série..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: "200px",
              bgcolor: "background.paper",
              borderRadius: 1,
            }}
          />
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<Theaters />}
            onClick={() => navigate("/watchlists")}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              borderWidth: 2,
              "&:hover": { borderWidth: 2 },
            }}
          >
            Minhas Listas
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenForm()}
            disableElevation
            className={styles.addButton}
          >
            Nova Série
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box className={styles.loaderContainer}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredShows.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="body1"
                color="text.secondary"
                align="center"
                sx={{
                  mt: 2,
                  p: 4,
                  border: "1px dashed #334155",
                  borderRadius: 2,
                }}
              >
                Nenhuma série encontrada.
              </Typography>
            </Grid>
          ) : (
            filteredShows.map((show) => {
              const listsContainingShow = userWatchlists.filter((list) =>
                list.tvShows?.some((s) => s["@key"] === show["@key"]),
              );

              return (
                <Grid
                  size={{ xs: 12, sm: 6, md: 4 }}
                  key={show["@key"] || show.title}
                >
                  <TvShowCard
                    show={show}
                    inWatchlists={listsContainingShow}
                    onEdit={handleOpenForm}
                    onDelete={confirmDelete}
                    onViewSeasons={handleViewSeasons}
                    onAddToWatchlist={handleOpenWatchlistModal}
                  />
                </Grid>
              );
            })
          )}
        </Grid>
      )}

      <TvShowFormModal
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSave={handleSaveShow}
        initialData={selectedShowToEdit}
      />
      <DeleteConfirmModal
        open={deleteModalOpen}
        titleToDelete={showToDelete?.title || ""}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />

      <AddToWatchlistModal
        open={watchlistModalOpen}
        onClose={() => setWatchlistModalOpen(false)}
        watchlists={userWatchlists}
        onSelect={handleConfirmAddToWatchlist}
        onCreateNew={handleCreateNewWatchlist}
        loading={false}
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
