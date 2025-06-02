import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import AdminPainel from './AdminPainel';

export default function Painel() {
  const [usuario, setUsuario] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    async function carregarUsuario() {
      const { data: sessionData } = await supabase.auth.getUser();

      if (!sessionData?.user) {
        window.location.href = '/';
        return;
      }

      const authId = sessionData.user.id;

      const { data: usuarioData, error } = await supabase
        .from('usuarios')
        .select('id, nome, tipo_usuario')
        .eq('auth_id', authId)
        .single();

      if (error || !usuarioData) {
        console.error('Usuário não encontrado');
        window.location.href = '/';
      } else {
        setUsuario({ ...usuarioData, auth_id: authId });
      }
    }

    carregarUsuario();
  }, []);

  useEffect(() => {
    if (!usuario || usuario.tipo_usuario !== 'funcionario') return;

    async function carregarHistorico() {
      const { data, error } = await supabase
        .from('registros_ponto')
        .select('*')
        .eq('usuario_id', usuario.id)
        .order('data_hora', { ascending: false });

      if (!error && data) {
        setHistorico(data);
      }
    }

    carregarHistorico();
  }, [usuario]);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  async function handleRegistrarPonto() {
    setMensagem('');
    setCarregando(true);

    try {
      const res = await fetch(`http://localhost:8080/registros/${usuario.auth_id}`, {
        method: 'POST',
      });

      const texto = await res.text();

      if (res.ok) {
        setMensagem('Ponto registrado com sucesso!');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setMensagem(`Erro: ${texto}`);
      }
    } catch (e) {
      setMensagem('Erro ao registrar ponto.');
    } finally {
      setCarregando(false);
    }
  }

  function calcularTotalHoras(historico) {
    // Ordena do mais antigo para o mais novo
    const registros = [...historico].sort((a, b) =>
      new Date(a.data_hora) - new Date(b.data_hora)
    );

    let totalMs = 0;
    for (let i = 0; i < registros.length - 1; i++) {
      const atual = registros[i];
      const proximo = registros[i + 1];

      if (atual.tipo === 'entrada' && proximo.tipo === 'saida') {
        const inicio = new Date(atual.data_hora);
        const fim = new Date(proximo.data_hora);
        totalMs += fim - inicio;
        i++; // pula o par
      }
    }

    const horas = Math.floor(totalMs / (1000 * 60 * 60));
    const minutos = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${horas}h ${minutos}min`;
  }

  return (
    <div>
      <header style={{
        background: 'white',
        padding: '15px 30px',
        borderBottom: '1px solid #ccc',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ margin: 0 }}>PontoFácil</h2>
        <button style={{ maxWidth: 120 }} onClick={handleLogout}>Sair</button>
      </header>

      <main style={{ padding: 30 }}>
        <h3>Bem-vindo(a){usuario ? `, ${usuario.nome}` : ''}</h3>

        {usuario?.tipo_usuario === 'admin' && (
          <>
            <p>Você está logado como <strong>Administrador</strong>. Pode cadastrar, editar e excluir usuários.</p>
            <AdminPainel />
          </>
        )}

        {usuario?.tipo_usuario === 'gestor' && (
          <p>Você está logado como <strong>Gestor</strong>. Pode consultar, editar e excluir registros de ponto.</p>
        )}

        {usuario?.tipo_usuario === 'funcionario' && (
          <>
            <p>Você está logado como <strong>Funcionário</strong>. Pode registrar ponto e ver seu histórico.</p>

            <button onClick={handleRegistrarPonto} disabled={carregando}>
              {carregando ? 'Registrando...' : 'Registrar Ponto'}
            </button>
            {mensagem && <p>{mensagem}</p>}

            {historico.length > 0 && (
              <div style={{
                marginTop: 20,
                padding: '10px 20px',
                background: '#f0f8ff',
                border: '1px solid #b0c4de',
                borderRadius: 8,
                display: 'inline-block'
              }}>
                <strong>Total de horas trabalhadas:</strong> {calcularTotalHoras(historico)}
              </div>
            )}
            {historico.length > 0 && (
              <div style={{
                marginTop: 10,
                padding: '10px 20px',
                background: '#f0f8ff',
                border: '1px solid #b0c4de',
                borderRadius: 8,
                display: 'inline-block'
              }}>
                <strong>Último ponto registrado:</strong> {historico[0].tipo} às {new Date(historico[0].data_hora).toLocaleTimeString('pt-BR')}
              </div>
            )}


            <h4 style={{ marginTop: 30 }}>Histórico de Pontos</h4>
            <table style={{ marginTop: 10, width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Data e Hora</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Tipo</th>
                </tr>
              </thead>
              <tbody>
                {historico.map((registro) => (
                  <tr key={registro.id} className={registro.tipo}>
                    <td>{new Date(registro.data_hora).toLocaleString('pt-BR')}</td>
                    <td>{registro.tipo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </main>
    </div>
  );
}
