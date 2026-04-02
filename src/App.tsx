import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { darkTheme } from './theme';
import { TvShows } from './pages/TvShows';
import { Seasons } from './pages/Seasons';

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> 
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/tvshows" replace />} />
          <Route path="/tvshows" element={<TvShows />} />
          <Route path="/seasons" element={<Seasons />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;