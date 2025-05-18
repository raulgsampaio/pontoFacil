import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { supabase as publicClient } from '../supabaseClient.js';

dotenv.config();

const adminClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export async function adminCreateUser(req, res) {
  const { nome, email, senha, tipo_usuario } = req.body;

  if (!['funcionario', 'gestor'].includes(tipo_usuario)) {
    return res.status(400).json({ error: 'tipo_usuario inválido' });
  }

  try {
    // 1. Criar usuário no Auth
    const { data: userData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
    });

    if (authError) throw authError;

    const auth_id = userData.user.id;

    // 2. Inserir na tabela usuarios
    const { error: insertError } = await publicClient
      .from('usuarios')
      .insert({ auth_id, nome, email, tipo_usuario });

    if (insertError) throw insertError;

    res.status(201).json({ message: 'Usuário criado com sucesso' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar usuário', detalhes: err.message });
  }
}
