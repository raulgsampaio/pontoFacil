import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import AdminPainel from './AdminPainel';

export default function Painel() {
  const [usuario, setUsuario] = useState(null);

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
        .select('nome, tipo_usuario')
        .eq('auth_id', authId)
        .single();

      if (error || !usuarioData) {
        console.error('Usuário não encontrado');
        window.location.href = '/';
      } else {
        setUsuario(usuarioData);
      }
    }

    carregarUsuario();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/';
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
          <p>Você está logado como <strong>Administrador</strong>. Pode cadastrar, editar e excluir usuários.</p>
        )}
        {usuario?.tipo_usuario === 'admin' && <AdminPainel />}

        {usuario?.tipo_usuario === 'gestor' && (
          <p>Você está logado como <strong>Gestor</strong>. Pode consultar, editar e excluir registros de ponto.</p>
        )}

        {usuario?.tipo_usuario === 'funcionario' && (
          <p>Você está logado como <strong>Funcionário</strong>. Pode registrar ponto e ver seu histórico.</p>
        )}
      </main>
    </div>
  );
}
