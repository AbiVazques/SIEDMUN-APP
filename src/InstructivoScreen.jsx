// src/InstructivoScreen.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './InstructivoScreen.css'; 

function InstructivoScreen() {
  const navigate = useNavigate(); 

  
  const handleInicioClick = () => {
    navigate('/home'); 
  };

  return (
    <div className="instructivo-container">
      <header className="instructivo-header">
        <div className="logo-placeholder">
          {/* Aquí iría tu logo de UPN. Por ahora un texto simple. */}
          UPN
        </div>
        <h1>INSTRUCTIVO</h1>
        <nav>
          {/* <<<< AGREGADO: Asocia la función handleInicioClick al evento onClick del botón */}
          <button className="nav-button" onClick={handleInicioClick}>Inicio</button>
        </nav>
      </header>

      <main className="instructivo-content">
        <section className="paso">
          <h3>Paso 1: Acceso a la Aplicación (Inicio o Registro)</h3>
          <ul>
            <li>Si es tu primera vez o no tienes una cuenta:
              <ul>
                <li>La aplicación te dirigirá a una pantalla de Registro. Completa los campos solicitados (ej. nombre, correo electrónico) y crea tu contraseña segura.</li>
              </ul>
            </li>
            <li>Si ya tienes una cuenta:
              <ul>
                <li>Dirígete a la pantalla de Inicio de Sesión.</li>
                <li>Ingresa tu Usuario (o correo electrónico) y tu Contraseña en los campos correspondientes.</li>
                <li>Haz clic en el botón "Iniciar Sesión"</li>
              </ul>
            </li>
          </ul>
        </section>

        <section className="paso">
          <h3>Paso 2: Navegación por la Pantalla Principal</h3>
          <ul>
            <li>Una vez que inicies sesión correctamente, serás dirigido a la Pantalla Principal de la aplicación.</li>
            <li>Aquí encontrarás un Menú de Navegación que es tu punto de partida para explorar la información.</li>
          </ul>
        </section>

        <section className="paso">
          <h3>Paso 3: Selección de Municipio</h3>
          <ul>
            <li>Dentro del menú de navegación o en la pantalla principal, busca la opción para Seleccionar un Municipio.</li>
            <li>Podrás elegir entre los seis municipios disponibles. Haz clic en el nombre del municipio que te interese para ver su información específica.</li>
          </ul>
        </section>

        <section className="paso">
          <h3>Paso 4: Exploración de Módulos de Información</h3>
          <ul>
            <li>Después de seleccionar un municipio, la aplicación te mostrará sus datos organizados en Módulos Temáticos que es un menú de despliegue de información.</li>
            <li>Haz clic en el módulo que desees consultar. Algunos ejemplos de módulos pueden ser:
              <ul>
                <li>MISIÓN Y VISIÓN</li>
                <li>PLANEACIÓN PARA EL BIENESTAR Y DEMOCRACIA PARTICIPATIVA</li>
                <li>Salud y Servicios: Para datos de centros de salud y servicios básicos.</li>
                <li>(Y otros módulos que se hayan definido para este proyecto).</li>
              </ul>
            </li>
          </ul>
        </section>

        <section className="paso">
          <h3>Paso 5: Visualización de la Información (Tablas)</h3>
          <ul>
            <li>La información que solicites o encuentres se presentará principalmente en Tablas claras y organizadas.</li>
          </ul>
        </section>

        <section className="paso">
          <h3>Paso 6: Navegación y Salida</h3>
          <ul>
            <li>Para moverte por la aplicación:
              <ul>
                <li>Utiliza los botones de "Atrás" o el menú de navegación para regresar a módulos anteriores, cambiar de municipio o volver a la pantalla principal.</li>
                <li>Si necesitas salir de tu sesión, busca y haz clic en la opción "Cerrar Sesión" (generalmente en la esquina superior derecha o en el menú principal).</li>
              </ul>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}

export default InstructivoScreen;