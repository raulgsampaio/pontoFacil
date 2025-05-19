import { determinarProximaMarcacao } from './strategy.js';
import {
  buscarUltimaMarcacao,
  inserirMarcacao,
  listarMarcacoes
} from './dao.js';

/**
 * POST /registro
 * Registra uma nova marcação (entrada/saída) automaticamente
 */
export async function registrarPonto(req, res) {
  const usuarioId = req.usuario.id;

  const { data: ultima, error: erroUltima } = await buscarUltimaMarcacao(usuarioId);
  if (erroUltima) {
    return res.status(500).json({ error: 'Erro ao consultar última marcação.' });
  }

  const resultado = determinarProximaMarcacao(ultima?.tipo);
  if (!resultado.valido) {
    return res.status(400).json({ error: resultado.mensagem });
  }

  const { error: erroInsert } = await inserirMarcacao(usuarioId, resultado.tipo);
  if (erroInsert) {
    return res.status(500).json({ error: 'Erro ao registrar ponto.' });
  }

  res.status(201).json({ message: `Ponto registrado como ${resultado.tipo}.` });
}

/**
 * GET /meus-registros
 * Lista todos os registros do funcionário logado
 */
export async function listarRegistros(req, res) {
  const usuarioId = req.usuario.id;

  const { data, error } = await listarMarcacoes(usuarioId);
  if (error) {
    return res.status(500).json({ error: 'Erro ao buscar registros.' });
  }

  res.status(200).json(data);
}
