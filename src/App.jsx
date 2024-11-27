import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppProvider } from './provider/AppContext';
import Cadastro from './pages/Cadastro/Cadastro';
import Depoimentos from './pages/Depoimentos/Depoimentos';
import CadastroDepoimento from './pages/CadastroDepoimento/CadastroDepoimento';
import HistoricoMedico from './pages/HistoricoMedico/HistoricoMedico';
import MuralApoio from './pages/MuralApoio/MuralApoio';
import CadastroPerfil from './pages/CadastroPerfil/CadastroPerfil';
import Perfil from './pages/Perfil/Perfil';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Cadastro />} />
            <Route path="/depoimentos" element={<Depoimentos />} />
            <Route path="/cadastro-depoimento" element={<CadastroDepoimento />} />
            <Route path="/historico-medico" element={<HistoricoMedico />} />
            <Route path="/mural-apoio" element={<MuralApoio />} />
            <Route path="/cadastro-perfil" element={<CadastroPerfil />} />
            <Route path="/perfil" element={<Perfil />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
