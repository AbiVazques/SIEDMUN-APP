
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeScreen.css';

// ¡I
import oaxacaImage from '../oaxaca.jpg'; 
 

function HomeScreen() {
  const navigate = useNavigate();

  const handleLogout = () => {
    
    alert('Cerrando sesión...');
    navigate('/'); 
  };

  const handleMunicipiosClick = () => {
    navigate('/municipios'); 
  };

  return (
    <div className="home-screen-container">
      <header className="home-header">
        <div className="home-logo-section">
          {/* Aquí iría tu logo de UPN */}
          <div className="upn-logo-placeholder">UPN</div>
          <span className="siedmun-text">SIEDMUN</span>
        </div>
        <nav className="home-nav">
          <button className="home-nav-button active">instructivo</button>
          <button className="home-nav-button" onClick={handleMunicipiosClick}>Municipios</button> {/* Botón de Municipios */}
        </nav>
        <div className="user-logout-section">
          <div className="user-icon"></div> {/* Ícono de usuario */}
          <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      </header>

      <main className="home-main-content">
        {}
        <img src={oaxacaImage} alt="Oaxaca" className="oaxaca-image" />
      </main>
    </div>
  );
}

export default HomeScreen;