// src/SideImage.jsx
import React from 'react';
import './SideImage.css'; // <<<< ¡Asegúrate de que esta línea esté y sea correcta!

function SideImage() {
  return (
    <div className="side-image-content">
      <h2 className="siedmun-title">SIEDMUN</h2>
      <p className="siedmun-subtitle">Sistema de Información Estratégica de Municipios</p>

      <div className="graphics-container">
        {/* Usamos emojis como marcadores de posición por ahora */}
        <span role="img" aria-label="building" className="graphic-icon">🏛️</span>
        <span role="img" aria-label="person" className="graphic-icon">🧑‍💻</span>
        <span role="img" aria-label="magnifying glass" className="graphic-icon">🔍</span>
        <span role="img" aria-label="chart" className="graphic-icon">📈</span>
      </div>
    </div>
  );
}

export default SideImage;