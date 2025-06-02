import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './Login';
import Painel from './Painel';
import AdminPainel from './AdminPainel';
import FuncionarioDetalhes from './FuncionarioDetalhes';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/painel" element={<Painel />} />
        <Route path="/admin" element={<AdminPainel />} />
        <Route path="/gestor/funcionario/:id" element={<FuncionarioDetalhes />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
