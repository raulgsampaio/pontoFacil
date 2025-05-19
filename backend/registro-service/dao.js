import { supabase } from '../shared/supabaseClient.js';

export async function buscarUltimaMarcacao(usuarioId) {
  return await supabase
    .from('registros_ponto')
    .select('tipo')
    .eq('usuario_id', usuarioId)
    .order('data_hora', { ascending: false })
    .limit(1)
    .single();
}

export async function inserirMarcacao(usuarioId, tipo) {
  return await supabase
    .from('registros_ponto')
    .insert({
      usuario_id: usuarioId,
      tipo
    });
}

export async function listarMarcacoes(usuarioId) {
  return await supabase
    .from('registros_ponto')
    .select('tipo, data_hora')
    .eq('usuario_id', usuarioId)
    .order('data_hora', { ascending: false });
}
