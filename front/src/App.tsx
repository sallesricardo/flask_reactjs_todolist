// App.js
import { useState, useEffect, FormEventHandler, FormEvent } from 'react';
import './App.css';

interface Tarefa {
    id: number;
    titulo: string;
    completa: boolean;
}

function App() {
    const [tarefas, setTarefas] = useState<Array<Tarefa>>([]);
    const [novaTarefa, setNovaTarefa] = useState<string>('');
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    const API_URL = 'http://localhost:5000/api/tarefas';

    // Carregar tarefas ao iniciar
    useEffect(() => {
        const carregarTarefas = async () => {
            try {
                setCarregando(true);
                const resposta = await fetch(API_URL);

                if (!resposta.ok) {
                    throw new Error('Falha ao carregar tarefas');
                }

                const dados = await resposta.json();
                setTarefas(dados);
                setErro(null);
            } catch (err) {
                setErro('Erro ao carregar tarefas. Verifique se a API está rodando.');
                console.error(err);
            } finally {
                setCarregando(false);
            }
        };

        carregarTarefas();
    }, []);

    // Adicionar tarefa
    const adicionarTarefa: FormEventHandler<HTMLElement> = async (e: FormEvent) => {
        e.preventDefault();

        if (!novaTarefa.trim()) return;

        try {
            const resposta = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ titulo: novaTarefa })
            });

            if (!resposta.ok) {
                throw new Error('Falha ao adicionar tarefa');
            }

            const novaTarefaAdicionada = await resposta.json();
            setTarefas([...tarefas, novaTarefaAdicionada]);
            setNovaTarefa('');
        } catch (err) {
            setErro('Erro ao adicionar tarefa');
            console.error(err);
        }
    };

    // Alternar status de conclusão
    const alternarConclusao = async (id: number) => {
        try {
            const tarefa = tarefas.find(t => t.id === id);
            const resposta = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completa: !tarefa?.completa })
            });

            if (!resposta.ok) {
                throw new Error('Falha ao atualizar tarefa');
            }

            const tarefaAtualizada = await resposta.json();
            setTarefas(tarefas.map(t => t.id === id ? tarefaAtualizada : t));
        } catch (err) {
            setErro('Erro ao atualizar tarefa');
            console.error(err);
        }
    };

    // Excluir tarefa
    const excluirTarefa = async (id: number) => {
        try {
            const resposta = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!resposta.ok) {
                throw new Error('Falha ao excluir tarefa');
            }

            setTarefas(tarefas.filter(t => t.id !== id));
        } catch (err) {
            setErro('Erro ao excluir tarefa');
            console.error(err);
        }
    };

    return (
        <div className="app">
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

export default App;
