// src/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './LoginForm.css';

function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async  (e) => {
    e.preventDefault(); 
    try {
      const response = await fetch('http://localhost:8000/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      alert('Inicio de sesión exitoso!');
      navigate('/instructivo'); 
    } catch (error) {
      alert('Correo o contraseña incorrectos.');
    }

  };

  const handleRegisterClick = () => {
    navigate('/register'); 
  };

  return (
    <div className="login-form-card"> {/* Usamos card para el estilo */}
      <div className="login-icon"></div> {/* Ícono de usuario */}
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            placeholder="Ingresa tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="links-group">
          <a href="#" className="forgot-password">¿Olvidó su contraseña?</a>
          {/* El botón/enlace de Registrarse */}
          <span className="register-link" onClick={handleRegisterClick}>Registrarse</span>
        </div>
        <button type="submit" className="login-button">Iniciar sesión</button>
      </form>
    </div>
  );
}

export default LoginForm;