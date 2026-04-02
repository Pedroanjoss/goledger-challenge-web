import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      {/* Aqui depois vamos colocar uma Navbar que aparece em todas as telas */}
      <Routes>
        <Route path="/" element={<Navigate to="/tvshows" replace />} />
        <Route path="/tvshows" element={<Home />} />
        {/* Futuras rotas: seasons, episodes, watchlists */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;