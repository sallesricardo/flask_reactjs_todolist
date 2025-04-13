// frontend/src/components/TodoApp.js
import React, { useState, useEffect, useContext, FormEventHandler } from 'react';
import { AuthContext, LoginContext } from '../context/AuthContext';

interface Tarefa {
    id: number;
    titulo: string;
    completa: boolean;
}

function TodoApp() {
    const [tarefas, setTarefas] = useState<Array<Tarefa>>([]);
    const [novaTarefa, setNovaTarefa] = useState('');
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const { authFetch } = useContext<LoginContext>(AuthContext);

    const API_URL = '/tarefas';

    // Carregar tarefas ao iniciar
    useEffect(() => {
        const carregarTarefas = async () => {
            try {
                setCarregando(true);
                const resposta = await authFetch(API_URL);

                if (!resposta.ok) {
                    throw new Error('Falha ao carregar tarefas');
                }

                const dados = await resposta.json();
                setTarefas(dados);
                setErro(null);
            } catch (err) {
                setErro('Erro ao carregar tarefas: ' + (err as Error).message);
                console.error(err);
            } finally {
                setCarregando(false);
            }
        };

        carregarTarefas();
    }, [authFetch]);

    // Adicionar tarefa
    const adicionarTarefa: FormEventHandler<HTMLElement> = async (e) => {
        e.preventDefault();

        if (!novaTarefa.trim()) return;

        try {
            const resposta = await authFetch(API_URL, {
                method: 'POST',
                body: JSON.stringify({ titulo: novaTarefa })
            });

            if (!resposta.ok) {
                throw new Error('Falha ao adicionar tarefa');
            }

            const novaTarefaAdicionada = await resposta.json();
            setTarefas([...tarefas, novaTarefaAdicionada]);
            setNovaTarefa('');
        } catch (err) {
            setErro('Erro ao adicionar tarefa: ' + (err as Error).message);
            console.error(err);
        }
    };

    // Alternar status de conclusão
    const alternarConclusao = async (id: number) => {
        try {
            const tarefa = tarefas.find(t => t.id === id);
            const resposta = await authFetch(`${API_URL}/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ completa: !tarefa?.completa })
            });

            if (!resposta.ok) {
                throw new Error('Falha ao atualizar tarefa');
            }

            const tarefaAtualizada = await resposta.json();
            setTarefas(tarefas.map(t => t.id === id ? tarefaAtualizada : t));
        } catch (err) {
            setErro('Erro ao atualizar tarefa: ' + (err as Error).message);
            console.error(err);
        }
    };

    // Excluir tarefa
    const excluirTarefa = async (id: number) => {
        try {
            const resposta = await authFetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!resposta.ok) {
                throw new Error('Falha ao excluir tarefa');
            }

            setTarefas(tarefas.filter(t => t.id !== id));
        } catch (err) {
            setErro('Erro ao excluir tarefa: ' + (err as Error).message);
            console.error(err);
        }
    };

    return (
        <div className="todo-app">
            <h1>Lista de Tarefas</h1>

            {erro && <div className="erro">{erro}</div>}

            <form className="form-tarefa" onSubmit={adicionarTarefa}>
                <input
                    type="text"
                    value={novaTarefa}
                    onChange={(e) => setNovaTarefa(e.target.value)}
                    placeholder="Adicionar nova tarefa"
                />
                <button type="submit">Adicionar</button>
            </form>

            {carregando ? (
                <div className="carregando">Carregando tarefas...</div>
            ) : (
                <ul className="lista-tarefas">
                    {tarefas.length === 0 ? (
                        <li className="sem-tarefas">Nenhuma tarefa encontrada</li>
                    ) : (
                        tarefas.map(tarefa => (
                            <li key={tarefa.id} className={tarefa.completa ? 'concluida' : ''}>
                                <span onClick={() => alternarConclusao(tarefa.id)}>
                                    {tarefa.titulo}
                                </span>
                                <div className="acoes">
                                    <button
                                        className="btn-concluir"
                                        onClick={() => alternarConclusao(tarefa.id)}
                                    >
                                        {tarefa.completa ? 'Desfazer' : 'Concluir'}
                                    </button>
                                    <button
                                        className="btn-excluir"
                                        onClick={() => excluirTarefa(tarefa.id)}
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
}

export default TodoApp;
