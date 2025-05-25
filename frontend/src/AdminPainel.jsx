import { useState, useEffect } from 'react';
import './AdminPainel.css';

export default function AdminPainel() {
  const [usuarios, setUsuarios] = useState([]);
  const [formVisivel, setFormVisivel] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({ nome: '', email: '', senha: '', tipo: 'funcionario' });
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function carregarUsuarios() {
    try {
      const res = await fetch('http://localhost:8081/admin/usuarios');
      if (!res.ok) throw new Error('Erro ao buscar usuários');
      const data = await res.json();
      console.log('Dados recebidos:', data); // <- LOG
      setUsuarios(data);
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
      setErro('Erro ao carregar usuários');
    }
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

    try {
      const url = editandoId
        ? `http://localhost:8081/admin/usuarios/${editandoId}`
        : 'http://localhost:8081/admin/cadastrar-usuario';

      const metodo = editandoId ? 'PUT' : 'POST';
      const payload = {
        nome: form.nome,
        email: form.email,
        tipo_usuario: form.tipo,
        ...(editandoId ? {} : { senha: form.senha })
      };

      const res = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setMensagem(editandoId ? 'Usuário atualizado!' : 'Usuário cadastrado!');
        resetForm();
        carregarUsuarios();
      } else {
        const data = await res.json();
        setErro(data.error || 'Erro ao salvar usuário');
      }
    } catch (err) {
      console.error(err);
      setErro('Erro ao comunicar com o servidor');
    }
  }

  async function handleExcluir(id) {
    const confirmar = confirm('Deseja realmente excluir este usuário?');
    if (!confirmar) return;

    try {
      const res = await fetch(`http://localhost:8081/admin/usuarios/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setMensagem('Usuário removido.');
        carregarUsuarios();
      } else {
        setErro('Erro ao excluir.');
      }
    } catch (err) {
      console.error(err);
      setErro('Erro ao comunicar com o servidor');
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
            <input type="password" placeholder="Senha" value={form.senha} onChange={e => setForm({ ...form, senha: e.target.value })} required />
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
          {usuarios.length === 0 && (
            <tr>
              <td colSpan="4">Nenhum usuário encontrado</td>
            </tr>
          )}
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
