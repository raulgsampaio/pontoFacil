import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import AdminPainel from './AdminPainel';
import { useNavigate } from 'react-router-dom';

export default function Painel() {
  const [usuario, setUsuario] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function carregarUsuario() {
      const { data: sessionData } = await supabase.auth.getUser();

      if (!sessionData?.user) {
        window.location.href = '/';
        return;
      }

      const authId = sessionData.user.id;

      const res = await fetch(`http://localhost:8080/usuarios/auth/${authId}`);
      if (!res.ok) {
        console.error('Usuário não encontrado');
        window.location.href = '/';
        return;
      }
      const arr = await res.json();
      const usuarioData = Array.isArray(arr) ? arr[0] : arr;
      setUsuario({ ...usuarioData, auth_id: authId });
    }

    carregarUsuario();
  }, []);

  useEffect(() => {
    if (!usuario) return;

    if (usuario.tipo_usuario === 'funcionario') {
      async function carregarHistorico() {
        const res = await fetch(`http://localhost:8080/registros/usuario/${usuario.id}`);
        if (res.ok) {
          const data = await res.json();
          setHistorico(data);
        }
      }

      carregarHistorico();
    }

    if (usuario.tipo_usuario === 'gestor') {
      async function carregarFuncionarios() {
        const res = await fetch('http://localhost:8080/usuarios/funcionarios');
        if (res.ok) {
          const data = await res.json();
          setFuncionarios(data);
        }
      }

      carregarFuncionarios();
    }
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
        i++;
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
          <>
            <p>Você está logado como <strong>Gestor</strong>. Pode consultar, editar e excluir registros de ponto.</p>

            <h4>Funcionários</h4>
            <ul>
              {funcionarios.map((f) => (
                <li key={f.id}>
                  <button onClick={() => navigate(`/gestor/funcionario/${f.id}`)}>
                    {f.nome} ({f.email})
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {usuario?.tipo_usuario === 'funcionario' && (
          <>
            <p>Você está logado como <strong>Funcionário</strong>. Pode registrar ponto e ver seu histórico.</p>

            <button onClick={handleRegistrarPonto} disabled={carregando}>
              {carregando ? 'Registrando...' : 'Registrar Ponto'}
            </button>
            {mensagem && <p>{mensagem}</p>}

            {historico.length > 0 && (
              <>
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
              </>
            )}

            <h4 style={{ marginTop: 30 }}>Histórico de Pontos</h4>
            <table style={{ marginTop: 10, width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Data e Hora</th>
                  <th>Tipo</th>
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
