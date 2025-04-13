// frontend/src/context/AuthContext.js
import { createContext, useState, useEffect, ReactNode } from 'react';
import { Api } from '../service/api';

const API_URL = 'http://localhost:5000/api';

interface User {
    id: number;
    nome: string;
}

export interface LoginContext {
    currentUser: User | null;
    token: string | null;
    loading: boolean | null;
    login: (email: string, senha:string) => void;
    registro: (nome: string, email: string, senha: string) => void;
    logout: () => void;
    authFetch: (url: string, options: Record<string, unknown>) => void;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<LoginContext>({
    currentUser: null,
    token: null,
    loading: false,
    login: () => {},
    registro: () => {},
    logout: () => {},
    authFetch: () => {},
    isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verifica se há um token no localStorage
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setCurrentUser(JSON.parse(storedUser));
        }

        setLoading(false);
    }, []);

    // Salva o token no localStorage quando for atualizado
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    // Função de login
    const login = async (email: string, senha: string) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha }),
            });

            if (!response.ok) {
                throw new Error('Credenciais inválidas');
            }

            const data = await response.json();
            setToken(data.access_token);
            setCurrentUser(data.usuario);
            localStorage.setItem('user', JSON.stringify(data.usuario));

            return data;
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        }
    };

    // Função de registro
    const registro = async (nome: string, email: string, senha: string) => {
        try {
            const response = await fetch(`${API_URL}/registro`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome, email, senha }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Erro no registro');
            }

            const data = await response.json();
            setToken(data.access_token);
            setCurrentUser(data.usuario);
            localStorage.setItem('user', JSON.stringify(data.usuario));

            return data;
        } catch (error) {
            console.error('Erro no registro:', error);
            throw error;
        }
    };

    // Função de logout
    const logout = () => {
        setToken(null);
        setCurrentUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    // Hook para fazer requisições autenticadas
    const authFetch = async (url: string, options: Record<string, unknown> = {}) => {
        if (!token) {
            throw new Error('Não autenticado');
        }

        const authOptions = {
            ...options,
            headers: {
                ...(options.headers) as Record<string, string>,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };

        const response = await fetch(`${API_URL}${url}`, authOptions);

        // Se receber 401 (não autorizado), faz logout automático
        if (response.status === 401) {
            logout();
            throw new Error('Sessão expirada');
        }

        return response;
    };

    return (
        <AuthContext.Provider value={{
            currentUser,
            token,
            loading,
            login,
            registro,
            logout,
            authFetch,
            isAuthenticated: !!token
        }}>
            {children}
        </AuthContext.Provider>
    );
};
