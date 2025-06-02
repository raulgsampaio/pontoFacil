import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './FuncionarioDetalhes.css';

export default function FuncionarioDetalhes() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [funcionario, setFuncionario] = useState(null);
    const [registros, setRegistros] = useState([]);
    const [mensagem, setMensagem] = useState('');
    const [modoEdicao, setModoEdicao] = useState({});
    const [backupRegistros, setBackupRegistros] = useState({});
    const [novoTipo, setNovoTipo] = useState('entrada');
    const [novaDataHora, setNovaDataHora] = useState('');

    useEffect(() => {
        async function carregarFuncionario() {
            const { data } = await supabase
                .from('usuarios')
                .select('nome')
                .eq('id', id)
                .single();
            setFuncionario(data);
        }

        async function carregarRegistros() {
            const { data } = await supabase
                .from('registros_ponto')
                .select('*')
                .eq('usuario_id', id)
                .order('data_hora', { ascending: false });
            setRegistros(data);
        }

        carregarFuncionario();
        carregarRegistros();
    }, [id]);

    const handleEditar = async (registroId, tipo, data_hora) => {
        const { error } = await supabase
            .from('registros_ponto')
            .update({ tipo, data_hora })
            .eq('id', registroId);

        if (!error) {
            setMensagem('Registro atualizado.');
            setModoEdicao(prev => ({ ...prev, [registroId]: false }));
            const { data } = await supabase
                .from('registros_ponto')
                .select('*')
                .eq('usuario_id', id)
                .order('data_hora', { ascending: false });
            setRegistros(data);
        } else {
            setMensagem('Erro ao atualizar.');
        }
    };

    const handleDeletar = async (registroId) => {
        const confirmar = confirm('Deseja excluir este ponto?');
        if (!confirmar) return;

        const { error } = await supabase
            .from('registros_ponto')
            .delete()
            .eq('id', registroId);

        if (!error) {
            setMensagem('Registro excluído.');
            setRegistros(registros.filter(r => r.id !== registroId));
        } else {
            setMensagem('Erro ao excluir.');
        }
    };

    return (
        <div style={{ padding: 30 }}>
            <button onClick={() => navigate(-1)}>&larr; Voltar</button>
            <h2>Registros de {funcionario?.nome}</h2>
            {mensagem && <p>{mensagem}</p>}

            <h4>Adicionar Novo Registro</h4>
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    if (!novoTipo || !novaDataHora) return;

                    const { error } = await supabase
                        .from('registros_ponto')
                        .insert([{ usuario_id: id, tipo: novoTipo, data_hora: novaDataHora }]);

                    if (!error) {
                        setMensagem('Registro adicionado.');
                        setNovoTipo('entrada');
                        setNovaDataHora('');
                        const { data } = await supabase
                            .from('registros_ponto')
                            .select('*')
                            .eq('usuario_id', id)
                            .order('data_hora', { ascending: false });
                        setRegistros(data);
                    } else {
                        setMensagem('Erro ao adicionar registro.');
                    }
                }}
                style={{ marginBottom: 20 }}
            >
                <select value={novoTipo} onChange={(e) => setNovoTipo(e.target.value)} required>
                    <option value="entrada">entrada</option>
                    <option value="saida">saida</option>
                </select>
                <input
                    type="datetime-local"
                    value={novaDataHora}
                    onChange={(e) => setNovaDataHora(e.target.value)}
                    required
                />
                <button type="submit">Adicionar</button>
            </form>

            <table style={{ marginTop: 10, width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>Data e Hora</th>
                        <th>Tipo</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {registros.map((r) => (
                        <tr key={r.id}>
                            <td>
                                {modoEdicao[r.id] ? (
                                    <input
                                        type="datetime-local"
                                        value={new Date(new Date(r.data_hora).getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16)}
                                        onChange={(e) => {
                                            const novos = registros.map(reg =>
                                                reg.id === r.id ? { ...reg, data_hora: e.target.value } : reg
                                            );
                                            setRegistros(novos);
                                        }}
                                    />
                                ) : (
                                    new Date(r.data_hora).toLocaleString('pt-BR', { timeZone: 'America/Fortaleza' })
                                )}
                            </td>
                            <td>
                                {modoEdicao[r.id] ? (
                                    <select
                                        value={r.tipo}
                                        onChange={(e) => {
                                            const novos = registros.map(reg =>
                                                reg.id === r.id ? { ...reg, tipo: e.target.value } : reg
                                            );
                                            setRegistros(novos);
                                        }}
                                    >
                                        <option value="entrada">entrada</option>
                                        <option value="saida">saida</option>
                                    </select>
                                ) : (
                                    r.tipo
                                )}
                            </td>
                            <td>
                                <div className="acoes-btns">
                                    {modoEdicao[r.id] ? (
                                        <>
                                            <button onClick={() => handleEditar(r.id, r.tipo, r.data_hora)}>💾</button>
                                            <button onClick={() => {
                                                setRegistros(prev =>
                                                    prev.map(reg => reg.id === r.id ? backupRegistros[r.id] : reg)
                                                );
                                                setModoEdicao(prev => ({ ...prev, [r.id]: false }));
                                            }}>✖️</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => {
                                                setBackupRegistros(prev => ({ ...prev, [r.id]: { ...r } }));
                                                setModoEdicao(prev => ({ ...prev, [r.id]: true }));
                                            }}>✏️</button>
                                            <button onClick={() => handleDeletar(r.id)}>🗑️</button>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
