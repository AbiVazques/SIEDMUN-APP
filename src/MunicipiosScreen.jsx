import React, { useState, useEffect } from 'react'; // ¡Importa useEffect aquí!
import { useNavigate } from 'react-router-dom';
import './MunicipiosScreen.css';


import xoxoImage from './assets/xoxocotlan.png';
import tutuImage from './assets/tututepec.png';
import chahuiImage from './assets/chahuites.png';
import cienegaImage from './assets/cienega_zimatlan.png';
import zimatlanImage from './assets/zimatlan.png';
import huazoImage from './assets/santa_maria_huazolotitlan.png';

function MunicipiosScreen() {
  const navigate = useNavigate();

  
  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(true); // Nuevo estado para indicar que se están cargando los datos
  const [error, setError] = useState(null);   // Nuevo estado para manejar errores de la API

  useEffect(() => {
    const fetchMunicipios = async () => {
      try {
        // Indica que estamos cargando
        setLoading(true);
        setError(null); // Limpia cualquier error anterior

        // Reemplaza 'http://localhost:8000/municipios/' con la URL **exacta** de tu API.
        // Si tu urls.py principal tiene un prefijo como 'api/', sería 'http://localhost:8000/api/municipios/'
        const response = await fetch('http://localhost:8000/municipios/');

        if (!response.ok) {
          // Si la respuesta no es 2xx, lanza un error
          throw new Error(`Error HTTP! Estado: ${response.status}`);
        }

        const data = await response.json();
        setMunicipios(data); // Actualiza el estado con los municipios recibidos
      } catch (err) {
        // Captura cualquier error en la solicitud (red, servidor, etc.)
        console.error("Error al obtener los municipios:", err);
        setError("No se pudieron cargar los municipios. Inténtalo de nuevo más tarde.");
      } finally {
        // Siempre, sin importar si hubo éxito o error, termina el estado de carga
        setLoading(false);
      }
    };

    fetchMunicipios(); // Llama a la función para obtener los datos cuando el componente se carga

    // El array vacío [] como segundo argumento de useEffect asegura que
    // esta función solo se ejecute una vez al montar el componente (como componentDidMount).
  }, []);

  const handleInicioClick = () => {
    navigate('/home');
  };

  // Cuando se hace clic en un municipio, usaremos el ID que viene de la base de datos (MongoDB _id)
  const handleMunicipioClick = (municipioId) => {
    navigate(`/municipio-detail/${municipioId}`);
  };

  const handleAddMunicipioClick = () => {
    navigate('/add-element');
  };

  return (
    <div className="municipios-screen-container">
      <header className="municipios-header">
        <div className="municipios-logo-placeholder">
          UPN
        </div>
        <h1>MUNICIPIOS</h1>
        <nav>
          <button className="municipios-nav-button" onClick={handleInicioClick}>
            Inicio
          </button>
        </nav>
      </header>

      <main className="municipios-content">
        <div className="municipios-grid">
          {/* Condicional para mostrar estados de carga, error o los municipios */}
          {loading && <p>Cargando municipios...</p>}
          {error && <p className="error-message">{error}</p>} {/* Puedes estilizar .error-message en tu CSS */}
          
          {/* Muestra los municipios solo si no hay carga y no hay error */}
          {!loading && !error && (
            municipios.length > 0 ? (
              municipios.map((municipio) => (
                <div
                  // Usamos municipio.id, que es el ID de MongoDB mapeado por DRF/MongoEngine
                  key={municipio.id}
                  className="municipio-card"
                  onClick={() => handleMunicipioClick(municipio.id)}
                >
                  {/*
                    Si tu modelo de MongoDB incluye una URL de imagen (ej. 'imagen_url'), úsala aquí:
                    <img src={municipio.imagen_url || 'placeholder.png'} alt={municipio.nombre} />
                    De lo contrario, puedes usar una imagen por defecto o la que ya tenías:
                  */}
                  <img src={xoxoImage} alt={municipio.nombre} /> {/* Usando una imagen local de placeholder */}
                  <p>{municipio.nombre}</p>
                  {/* Puedes añadir más detalles del municipio si quieres, por ejemplo: */}
                  {/* <p>Población: {municipio.poblacion}</p> */}
                  {/* <p>Estado: {municipio.estado}</p> */}
                </div>
              ))
            ) : (
              // Si no hay municipios después de la carga y no hay error
              <p>No hay municipios disponibles en este momento.</p>
            )
          )}
        </div>
      </main>

      <button className="add-municipio-button" onClick={handleAddMunicipioClick}>+</button>
    </div>
  );
}

export default MunicipiosScreen;