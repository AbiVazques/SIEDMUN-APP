// src/RegisterScreen.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterScreen.css'; 

function RegisterScreen() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');

  const handleRegister = (e) => {
    e.preventDefault(); 

    if (contrasena !== confirmarContrasena) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    
    console.log({ nombre, correo, contrasena });
    alert('Registro exitoso. Ahora puedes iniciar sesión.');
    navigate('/'); 
  };

  const handleLoginRedirect = () => {
    navigate('/'); 
  };

  return (
    <div className="register-screen-container">
      <div className="register-card">
        <div className="register-icon"></div> {/* Icono de usuario */}
        <h2>Registrarse</h2>
        <form onSubmit={handleRegister} className="register-form">
          <div className="input-group">
            <label htmlFor="nombre">Nombre completo</label>
            <input
              type="text"
              id="nombre"
              placeholder="Ingresa tu nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              placeholder="Ingresa tu correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              placeholder="Ingresa tu contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirm-password">Confirmar contraseña</label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Confirma tu contraseña"
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="register-button">Registrarse</button>
        </form>
        <p className="login-link">
          ¿Ya tienes una cuenta? <span onClick={handleLoginRedirect}>Iniciar Sesión</span>
        </p>
      </div>
    </div>
  );
}

export default RegisterScreen;