import { createClient } from '@supabase/supabase-js';
import { supabase } from '../shared/supabaseClient.js';
import dotenv from 'dotenv';

dotenv.config();

const adminClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/**
 * GET /admin/usuarios
 */
export async function listarUsuarios(req, res) {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, nome, email, tipo_usuario');

  if (error) return res.status(500).json({ error: 'Erro ao listar usuários' });
  res.status(200).json(data);
}

/**
 * PUT /admin/usuarios/:id
 * Espera: { nome, email, tipo_usuario, senha? }
 */
export async function atualizarUsuario(req, res) {
  const { id } = req.params;
  const { nome, email, tipo_usuario, senha } = req.body;

  // Buscar auth_id
  const { data: usuario, error: buscaErro } = await supabase
    .from('usuarios')
    .select('auth_id')
    .eq('id', id)
    .single();

  if (buscaErro || !usuario) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }

  const auth_id = usuario.auth_id;

  // Atualiza na tabela usuarios
  const { error: erroUpdate } = await supabase
    .from('usuarios')
    .update({ nome, email, tipo_usuario })
    .eq('id', id);

  if (erroUpdate) {
    return res.status(500).json({ error: 'Erro ao atualizar na tabela usuarios.' });
  }

  // Atualiza também no Auth
  const updatePayload = { email };
  if (senha?.length > 0) updatePayload.password = senha;

  const { error: authErro } = await adminClient.auth.admin.updateUserById(auth_id, updatePayload);
  if (authErro) {
    return res.status(500).json({ error: 'Erro ao atualizar no Auth.', detalhes: authErro.message });
  }

  return res.status(200).json({ message: 'Usuário atualizado com sucesso.' });
}

/**
 * DELETE /admin/usuarios/:id
 */
export async function deletarUsuario(req, res) {
  const { id } = req.params;

  // Buscar auth_id para remover do Auth também
  const { data: usuario, error: buscaErro } = await supabase
    .from('usuarios')
    .select('auth_id')
    .eq('id', id)
    .single();

  if (buscaErro || !usuario) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }

  const auth_id = usuario.auth_id;

  // 1. Remove da tabela usuarios
  const { error: delTabela } = await supabase
    .from('usuarios')
    .delete()
    .eq('id', id);

  if (delTabela) {
    return res.status(500).json({ error: 'Erro ao deletar da tabela usuarios' });
  }

  // 2. Remove do Auth
  const { error: delAuth } = await adminClient.auth.admin.deleteUser(auth_id);
  if (delAuth) {
    return res.status(500).json({ error: 'Erro ao deletar no Auth', detalhes: delAuth.message });
  }

  res.status(200).json({ message: 'Usuário removido com sucesso.' });
}
