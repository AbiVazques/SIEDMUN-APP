// src/LoginScreen.jsx
import React from 'react';
import LoginForm from './LoginForm'; 
import SideImage from './SideImage'; 
import './LoginScreen.css';

function LoginScreen() {
  return (
    <div className="login-container">
      <div className="login-form-section">
        <LoginForm />
      </div>
      <div className="login-image-section">
        <SideImage />
      </div>
    </div>
  );
}

export default LoginScreen;