import { createClient } from '@supabase/supabase-js';
import { supabase } from '../shared/supabaseClient.js';
import { inserirUsuario } from './dao.js';
import dotenv from 'dotenv';

dotenv.config();

const adminClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/**
 * POST /admin/cadastrar-usuario
 * Espera: { nome, email, senha, tipo_usuario }
 */
export async function adminCreateUser(req, res) {
  const { nome, email, senha, tipo_usuario } = req.body;

  if (!['admin', 'gestor', 'funcionario'].includes(tipo_usuario)) {
    return res.status(400).json({ error: 'Tipo de usuário inválido' });
  }

  try {
    // 1. Cria no Supabase Auth
    const { data: userData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true
    });

    if (authError) throw authError;

    const auth_id = userData.user.id;

    // 2. Insere na tabela usuarios (via DAO)
    const { error: insertError } = await inserirUsuario({ auth_id, nome, email, tipo_usuario });

    if (insertError) throw insertError;

    res.status(201).json({ message: 'Usuário cadastrado com sucesso.' });

  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    res.status(500).json({ error: 'Erro ao cadastrar usuário.', detalhes: err.message });
  }
}
