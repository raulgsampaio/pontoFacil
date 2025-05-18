import express from 'express';
import dotenv from 'dotenv';
import adminRoutes from './routes/adminRoutes.js';
import registroRoutes from './routes/registroRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware básico
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.send('API PontoFácil rodando 🚀');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

app.use('/admin', adminRoutes);

app.use(registroRoutes);