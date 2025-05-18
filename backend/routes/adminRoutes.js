import express from 'express';
import { adminCreateUser } from '../services/adminService.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.post('/cadastrar-usuario', authMiddleware, adminCreateUser);

export default router;
