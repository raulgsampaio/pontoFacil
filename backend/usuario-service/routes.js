import express from 'express';
import { adminCreateUser } from './adminService.js';
import {
  listarUsuarios,
  atualizarUsuario,
  deletarUsuario
} from './controller.js';
import { authMiddleware } from '../shared/authMiddleware.js';

const router = express.Router();

// Middleware: só permite admins
const somenteAdmin = (req, res, next) => {
  if (req.usuario?.tipo_usuario !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito ao administrador' });
  }
  next();
};

// Criar
router.post('/cadastrar-usuario', authMiddleware, somenteAdmin, adminCreateUser);

// Listar
router.get('/usuarios', authMiddleware, somenteAdmin, listarUsuarios);

// Atualizar
router.put('/usuarios/:id', authMiddleware, somenteAdmin, atualizarUsuario);

// Deletar
router.delete('/usuarios/:id', authMiddleware, somenteAdmin, deletarUsuario);

export default router;
