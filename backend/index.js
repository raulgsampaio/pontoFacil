import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import usuarioRoutes from './usuario-service/routes.js';
import registroRoutes from './registro-service/routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware básico
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.send('API PontoFácil rodando');
});

// Microserviços
app.use('/admin', usuarioRoutes);  // rotas do admin (cadastro de usuários)
app.use(registroRoutes);           // rotas de registro de ponto

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
