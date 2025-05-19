export function determinarProximaMarcacao(ultimaTipo) {
  if (!ultimaTipo) {
    return { valido: true, tipo: 'entrada' };
  }

  if (ultimaTipo === 'entrada') {
    return { valido: true, tipo: 'saida' };
  }

  if (ultimaTipo === 'saida') {
    return { valido: true, tipo: 'entrada' };
  }

  return { valido: false, mensagem: 'Tipo de marcação inválido.' };
}
