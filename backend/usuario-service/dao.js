import { supabase } from '../shared/supabaseClient.js';

export async function inserirUsuario({ auth_id, nome, email, tipo_usuario }) {
  return await supabase
    .from('usuarios')
    .insert({ auth_id, nome, email, tipo_usuario });
}

export async function buscarUsuarioPorAuthId(auth_id) {
  return await supabase
    .from('usuarios')
    .select('*')
    .eq('auth_id', auth_id)
    .single();
}
