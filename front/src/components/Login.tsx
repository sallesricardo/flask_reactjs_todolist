// frontend/src/components/Login.js
import { useState, useContext, FormEventHandler, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, LoginContext } from '../context/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext<LoginContext>(AuthContext);

    const handleSubmit: FormEventHandler<HTMLElement> = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, senha);
            navigate('/');
        } catch (error) {
            console.error(error);
            setError('Email ou senha inválidos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
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

                <button
                    type="submit"
                    className="btn-login"
                    disabled={loading}
                >
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>

            <p className="register-link">
                Não tem uma conta? <a href="/registro">Registre-se</a>
            </p>
        </div>
    );
}

export default Login;
