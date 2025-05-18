import express from 'express';
import { registrarPonto, listarRegistros } from '../controllers/registroController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/registro', authMiddleware, registrarPonto);
router.get('/meus-registros', authMiddleware, listarRegistros);

export default router;
