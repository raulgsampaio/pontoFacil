import { useState } from 'react';
import { supabase } from './supabaseClient';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setErro('');
    setSucesso('');

    const { error, data: session } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: senha
    });

    if (error) {
      console.error('Erro Supabase:', error.message, error);
      setErro('Login inválido. Verifique o e-mail e senha.');
      return;
    }

    setSucesso('Login realizado com sucesso!');

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setErro('Erro ao identificar usuário logado.');
      return;
    }

    const { data, error: fetchError } = await supabase
      .from('usuarios')
      .select('tipo_usuario')
      .eq('auth_id', user.id)
      .single();

    if (fetchError || !data) {
      setErro('Erro ao consultar tipo de usuário.');
      return;
    }

    const destino = '/painel';

    setTimeout(() => {
      window.location.href = destino;
    }, 1000);
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      {sucesso && <p style={{ color: 'green' }}>{sucesso}</p>}
    </div>
  );
}
