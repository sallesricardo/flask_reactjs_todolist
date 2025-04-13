// frontend/src/App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext, LoginContext } from './context/AuthContext';
import Login from './components/Login';
import Registro from './components/Registro';
import TodoApp from './components/TodoApp';
import Navbar from './components/Navbar';
import './App.css';

// Componente para rotas protegidas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, loading } = useContext<LoginContext>(AuthContext);

    if (loading) {
        return <div className="loading">Carregando...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return children;
};

function AppContent() {
    return (
        <Router>
            <Navbar />
            <div className="container">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/registro" element={<Registro />} />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <TodoApp />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
