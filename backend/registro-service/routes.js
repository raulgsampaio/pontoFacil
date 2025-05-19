import express from 'express';
import { registrarPonto, listarRegistros } from './controller.js';
import { authMiddleware } from '../shared/authMiddleware.js';

const router = express.Router();

/**
 * POST /registro
 * Registra um novo ponto (entrada ou saída, definido automaticamente)
 * Acesso: funcionário autenticado
 */
router.post('/registro', authMiddleware, registrarPonto);

/**
 * GET /meus-registros
 * Lista todos os registros de ponto do usuário logado
 * Acesso: funcionário autenticado
 */
router.get('/meus-registros', authMiddleware, listarRegistros);

export default router;
