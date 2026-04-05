import { useEffect, useState, useMemo } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";
import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";
import { tvShowService } from "../services/api";
import type { TvShow } from "../types";
import { useNavigate } from 'react-router-dom';
import { TvShowCard } from "../components/tvshows/TvShowCard";
import { TvShowFormModal } from "../components/tvshows/TvShowFormModal";
import { DeleteConfirmModal } from "../common/DeleteConfirmModal";
import styles from "./style/TvShows.module.css";

export function TvShows() {
  const [shows, setShows] = useState<TvShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate()
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedShow, setSelectedShow] = useState<TvShow | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [showToDelete, setShowToDelete] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleViewSeasons = (title: string) => {
    navigate(`/tvshows/${encodeURIComponent(title)}/seasons`);
  };

  const loadShows = async () => {
    try {
      setLoading(true);
      const data = await tvShowService.list();
      setShows(data);
    } catch (error) {
      showToast("Erro ao carregar séries da Blockchain.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShows();
  }, []);

  const filteredShows = useMemo(() => {
    return shows.filter(
      (show) =>
        show.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        show.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [shows, searchTerm]);

  const handleOpenForm = (show?: TvShow) => {
    setSelectedShow(show || null);
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
      loadShows();
    } catch (error) {
      showToast("Erro ao salvar série.", "error");
    }
  };

  const confirmDelete = (title: string) => {
    setShowToDelete(title);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await tvShowService.delete(showToDelete);
      showToast("Série excluída com sucesso!", "success");
      setDeleteModalOpen(false);
      loadShows();
    } catch (error) {
      showToast("Erro ao excluir série.", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const showToast = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Container className={styles.container}>
      <Box className={styles.headerContainer}>
        <Box>
          <Typography variant="h3" color="primary" className={styles.pageTitle}>
            Catálogo
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Gerencie suas séries baseadas no Hyperledger
          </Typography>
        </Box>

        <Box className={styles.actionsContainer}>
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
            className={styles.searchInput}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenForm()}
            disableElevation
            className={styles.addButton}
          >
            Adicionar
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
                variant="h6"
                color="text.secondary"
                className={styles.emptyState}
              >
                Nenhuma série encontrada.
              </Typography>
            </Grid>
          ) : (
            filteredShows.map((show) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={show.title}>
                <TvShowCard show={show} onEdit={handleOpenForm} onDelete={confirmDelete} onViewSeasons={handleViewSeasons} />
              </Grid>
            ))
          )}
        </Grid>
      )}

      <TvShowFormModal
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSave={handleSaveShow}
        initialData={selectedShow}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        titleToDelete={showToDelete}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          className={styles.snackbarAlert}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
