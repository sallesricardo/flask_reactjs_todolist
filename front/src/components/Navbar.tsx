// frontend/src/components/Navbar.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext, LoginContext } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
    const { currentUser, isAuthenticated, logout } = useContext<LoginContext>(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">Lista de Tarefas</Link>
            </div>

            <div className="navbar-links">
                {isAuthenticated ? (
                    <>
                        <span className="welcome-message">Olá, {currentUser?.nome || 'Usuário'}</span>
                        <button onClick={handleLogout} className="btn-logout">
                            Sair
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/registro" className="nav-link register">Registrar</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
