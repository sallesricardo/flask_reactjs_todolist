// frontend/src/components/Registro.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, LoginContext } from '../context/AuthContext';

function Registro() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { registro } = useContext<LoginContext>(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (senha !== confirmaSenha) {
            setError('As senhas não correspondem');
            return;
        }

        setLoading(true);

        try {
            await registro(nome, email, senha);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Erro ao registrar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="registro-container">
            <h2>Criar Conta</h2>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nome">Nome</label>
                    <input
                        type="text"
                        id="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="senha">Senha</label>
                    <input
                        type="password"
                        id="senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirma-senha">Confirmar Senha</label>
                    <input
                        type="password"
                        id="confirma-senha"
                        value={confirmaSenha}
                        onChange={(e) => setConfirmaSenha(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="btn-registro"
                    disabled={loading}
                >
                    {loading ? 'Registrando...' : 'Registrar'}
                </button>
            </form>

            <p className="login-link">
                Já tem uma conta? <a href="/login">Faça login</a>
            </p>
        </div>
    );
}

export default Registro;
