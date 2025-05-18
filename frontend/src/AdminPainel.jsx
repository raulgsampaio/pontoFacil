import { useState } from 'react';
import { supabase } from './supabaseClient';

export default function AdminPainel() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState('funcionario');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  async function handleCadastro(e) {
    e.preventDefault();
    setMensagem('');
    setErro('');

    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    const res = await fetch('http://localhost:3000/admin/cadastrar-usuario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nome, email, senha, tipo_usuario: tipo }),
    });

    if (res.ok) {
      setMensagem('Usuário cadastrado com sucesso.');
      setNome('');
      setEmail('');
      setSenha('');
      setTipo('funcionario');
    } else {
      const data = await res.json();
      setErro(data.error || 'Erro ao cadastrar.');
    }
  }

  return (
    <div style={{ padding: 30 }}>
      <h3>Cadastro de Usuário</h3>
      <form onSubmit={handleCadastro}>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        /><br /><br />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br /><br />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        /><br /><br />
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="funcionario">Funcionário</option>
          <option value="gestor">Gestor</option>
        </select><br /><br />
        <button type="submit">Cadastrar</button>
      </form>
      {mensagem && <p style={{ color: 'green' }}>{mensagem}</p>}
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
    </div>
  );
}
