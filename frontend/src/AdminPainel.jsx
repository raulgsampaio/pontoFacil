import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './AdminPainel.css';

export default function AdminPainel() {
  const [usuarios, setUsuarios] = useState([]);
  const [formVisivel, setFormVisivel] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({ nome: '', email: '', senha: '', tipo: 'funcionario' });
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => { carregarUsuarios(); }, []);

  async function getToken() {
    const session = await supabase.auth.getSession();
    return session.data.session?.access_token;
  }

  async function carregarUsuarios() {
    const token = await getToken();
    const res = await fetch('http://localhost:3000/admin/usuarios', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setUsuarios(data);
  }

  function resetForm() {
    setForm({ nome: '', email: '', senha: '', tipo: 'funcionario' });
    setEditandoId(null);
    setFormVisivel(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMensagem('');
    setErro('');
    const token = await getToken();

    if (editandoId) {
      const confirmar = confirm('Confirmar alteração deste usuário?');
      if (!confirmar) return;

      const res = await fetch(`http://localhost:3000/admin/usuarios/${editandoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nome: form.nome, email: form.email, tipo_usuario: form.tipo })
      });
      if (res.ok) {
        setMensagem('Usuário atualizado!');
        resetForm();
        carregarUsuarios();
      } else {
        setErro('Erro ao atualizar.');
      }
    } else {
      const res = await fetch('http://localhost:3000/admin/cadastrar-usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nome: form.nome, email: form.email, senha: form.senha, tipo_usuario: form.tipo })
      });
      if (res.ok) {
        setMensagem('Usuário cadastrado!');
        resetForm();
        carregarUsuarios();
      } else {
        const data = await res.json();
        setErro(data.error || 'Erro ao cadastrar.');
      }
    }
  }

  async function handleExcluir(id) {
    const confirmar = confirm('Deseja realmente excluir este usuário?');
    if (!confirmar) return;

    const token = await getToken();
    const res = await fetch(`http://localhost:3000/admin/usuarios/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      setMensagem('Usuário removido.');
      carregarUsuarios();
    } else {
      setErro('Erro ao excluir.');
    }
  }

  function editar(usuario) {
    setEditandoId(usuario.id);
    setForm({
      nome: usuario.nome,
      email: usuario.email,
      senha: '',
      tipo: usuario.tipo_usuario
    });
    setFormVisivel(true);
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h3>Usuários Cadastrados</h3>
        <button className="btn-novo" onClick={() => setFormVisivel(!formVisivel)}>
          {formVisivel ? 'Cancelar' : (<><span>➕</span><span>Novo Usuário</span></>)}
        </button>
      </div>

      {formVisivel && (
        <form className="form-admin" onSubmit={handleSubmit}>
          <h4>{editandoId ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}</h4>
          <input type="text" placeholder="Nome" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required />
          <input type="email" placeholder="E-mail" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          {!editandoId && (
            <input
              type="password"
              placeholder="Senha"
              value={form.senha}
              onChange={e => setForm({ ...form, senha: e.target.value })}
              required
            />
          )}
          <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
            <option value="funcionario">Funcionário</option>
            <option value="gestor">Gestor</option>
            <option value="admin">Administrador</option>
          </select>
          <button type="submit" className="btn-salvar">{editandoId ? 'Atualizar' : 'Cadastrar'}</button>
        </form>
      )}

      {mensagem && <p className="msg-sucesso">{mensagem}</p>}
      {erro && <p className="msg-erro">{erro}</p>}

      <table className="tabela-usuarios">
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Tipo</th>
            <th className="col-acoes">Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u.id}>
              <td>{u.nome}</td>
              <td>{u.email}</td>
              <td>{u.tipo_usuario}</td>
              <td className="acoes">
                <button className="btn-editar" onClick={() => editar(u)} title="Editar">🖉</button>
                <button className="btn-excluir" onClick={() => handleExcluir(u.id)} title="Excluir">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
