import { supabase } from '../supabaseClient.js';
import { determinarProximaMarcacao } from '../strategies/tipoMarcacaoStrategy.js';

/**
 * POST /registro
 * Exemplo de uso:
 * 
 * fetch('http://localhost:3000/registro', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'Authorization': 'Bearer <token_jwt>'
 *   }
 * });
 */
export async function registrarPonto(req, res) {
  const usuarioId = req.usuario.id;

  const { data: ultima, error } = await supabase
    .from('registros_ponto')
    .select('tipo')
    .eq('usuario_id', usuarioId)
    .order('data_hora', { ascending: false })
    .limit(1)
    .single();

  const resultado = determinarProximaMarcacao(ultima?.tipo);

  if (!resultado.valido) {
    return res.status(400).json({ error: resultado.mensagem });
  }

  const { error: insertError } = await supabase
    .from('registros_ponto')
    .insert({
      usuario_id: usuarioId,
      tipo: resultado.tipo,
    });

  if (insertError) {
    return res.status(500).json({ error: 'Erro ao registrar ponto.' });
  }

  res.status(201).json({ message: `Ponto registrado como ${resultado.tipo}.` });
}

/**
 * GET /meus-registros
 * Exemplo de uso:
 * 
 * fetch('http://localhost:3000/meus-registros', {
 *   method: 'GET',
 *   headers: {
 *     'Authorization': 'Bearer <token_jwt>'
 *   }
 * }).then(res => res.json()).then(console.log);
 */
export async function listarRegistros(req, res) {
  const usuarioId = req.usuario.id;

  const { data, error } = await supabase
    .from('registros_ponto')
    .select('tipo, data_hora')
    .eq('usuario_id', usuarioId)
    .order('data_hora', { ascending: false });

  if (error) {
    return res.status(500).json({ error: 'Erro ao buscar registros.' });
  }

  res.status(200).json(data);
}
