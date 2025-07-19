// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginScreen from './LoginScreen';
import InstructivoScreen from './InstructivoScreen';
import HomeScreen from './HomeScreen';
import MunicipiosScreen from './MunicipiosScreen';
import RegisterScreen from './RegisterScreen';
import AddElementScreen from './AddElementScreen';
import EditMunicipioScreen from './EditMunicipioScreen'; 
import MunicipioDetailScreen from './MunicipioDetailScreen'; 

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/instructivo" element={<InstructivoScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/municipios" element={<MunicipiosScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/add-element" element={<AddElementScreen />} />
        <Route path="/edit-municipio/:id" element={<EditMunicipioScreen />} /> {/* Se mantiene la ruta por si se usa en el futuro */}
        <Route path="/municipio-detail/:id" element={<MunicipioDetailScreen />} /> {/* Ruta para detalle y edición in-place */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);