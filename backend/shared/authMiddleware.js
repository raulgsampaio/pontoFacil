import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token ausente' });

  // Valida o token
  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !authData?.user) return res.status(401).json({ error: 'Token inválido' });

  const auth_id = authData.user.id;

  // Busca o usuário vinculado na tabela 'usuarios'
  const { data: usuario, error: usuarioError } = await supabase
    .from('usuarios')
    .select('*')
    .eq('auth_id', auth_id)
    .single();

  if (usuarioError || !usuario) return res.status(403).json({ error: 'Usuário não registrado no sistema' });

  req.usuario = usuario; // agora disponível em qualquer rota
  next();
}
