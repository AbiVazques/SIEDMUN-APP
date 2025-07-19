import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AddElementScreen.css';
import './MunicipioDetailScreen.css';

function MunicipioDetailScreen() {
  const navigate = useNavigate();
  const { id: municipioId } = useParams();

  const [municipioIndexData, setMunicipioIndexData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeSectionKey, setActiveSectionKey] = useState('mensaje');
  const [isEditingSection, setIsEditingSection] = useState(false);
  const [editedSectionContent, setEditedSectionContent] = useState('');

  const BASE_URL = 'http://localhost:8000';

  useEffect(() => {
    const fetchMunicipioIndex = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BASE_URL}/indices/municipio/${municipioId}`);

        if (!response.ok) {
          throw new Error(`Error HTTP! Estado: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        if (data.length > 0) {
          const indexFound = data[0];
          setMunicipioIndexData(indexFound);

          if (indexFound.elementos && indexFound.elementos.length > 0) {
            const mensajeElemento = indexFound.elementos.find(el => el.titulo === 'MENSAJE DEL PRESIDENTE MUNICIPAL CONSTITUCIONAL');
            if (mensajeElemento) {
              setActiveSectionKey(mensajeElemento.id);
              setEditedSectionContent(mensajeElemento.titulo);
            } else {
              setActiveSectionKey(indexFound.elementos[0].id);
              setEditedSectionContent(indexFound.elementos[0].titulo);
            }
          }
        } else {
          setMunicipioIndexData(null);
          setError("No se encontró información de índice para este municipio.");
        }
      } catch (err) {
        console.error("Error al obtener el índice del municipio:", err);
        setError("Error al cargar la información del municipio. Inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    if (municipioId) {
      fetchMunicipioIndex();
    }
  }, [municipioId, navigate]);

  useEffect(() => {
    if (municipioIndexData && activeSectionKey) {
      const currentElement = municipioIndexData.elementos.find(el => el.id === activeSectionKey);
      setEditedSectionContent(currentElement ? currentElement.titulo : '');
      setIsEditingSection(false);
    }
  }, [activeSectionKey, municipioIndexData]);

  const handleInicioClick = () => {
    navigate('/home');
  };

  const handleSectionClick = (elementId) => {
    if (isEditingSection) {
      if (!window.confirm('Estás editando. ¿Deseas cambiar de sección sin guardar los cambios actuales?')) {
        return;
      }
    }
    setActiveSectionKey(elementId);
  };
  
  const handleEditSectionClick = () => {
    setIsEditingSection(true);
  };

  const handleSaveSectionContent = async (e) => {
    e.preventDefault();
    if (!municipioIndexData) return;

    setLoading(true);
    setError(null);

    try {
      const updatedElementos = municipioIndexData.elementos.map(el =>
        el.id === activeSectionKey
          ? { ...el, titulo: editedSectionContent }
          : el
      );

      const dataToUpdate = {
        municipio_id: municipioIndexData.municipio_id,
        elementos: updatedElementos
      };

      const response = await fetch(`${BASE_URL}/indices/${municipioIndexData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToUpdate),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error HTTP al guardar: ${response.status} - ${errorData.error || response.statusText}`);
      }

      const updatedIndice = await response.json();
      setMunicipioIndexData(updatedIndice);
      alert(`Contenido de la sección actualizado exitosamente.`);
      setIsEditingSection(false);
    } catch (err) {
      console.error("Error al guardar la sección:", err);
      setError(`No se pudieron guardar los cambios: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSectionEdit = () => {
    const currentElement = municipioIndexData.elementos.find(el => el.id === activeSectionKey);
    setEditedSectionContent(currentElement ? currentElement.titulo : '');
    setIsEditingSection(false);
  };

  const handleDownload = (format) => {
    alert(`Descargando ${format.toUpperCase()} (funcionalidad no conectada al backend aún).`);
  };

  if (loading) {
    return (
      <div className="municipio-detail-screen-container">
        <header className="municipios-header">
          <div className="municipios-logo-placeholder">UPN</div>
          <h1>Cargando Datos del Municipio...</h1>
          <nav>
            <button className="municipios-nav-button" onClick={() => navigate('/municipios')}>
              Municipios
            </button>
          </nav>
        </header>
        <main className="detail-content-main">
          <p>Cargando información detallada del municipio...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="municipio-detail-screen-container">
        <header className="municipios-header">
          <div className="municipios-logo-placeholder">UPN</div>
          <h1>Error al Cargar</h1>
          <nav>
            <button className="municipios-nav-button" onClick={() => navigate('/municipios')}>
              Municipios
            </button>
          </nav>
        </header>
        <main className="detail-content-main">
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </main>
      </div>
    );
  }

  if (!municipioIndexData) {
    return (
      <div className="municipio-detail-screen-container">
        <header className="municipios-header">
          <div className="municipios-logo-placeholder">UPN</div>
          <h1>Municipio No Encontrado</h1>
          <nav>
            <button className="municipios-nav-button" onClick={() => navigate('/municipios')}>
              Municipios
            </button>
          </nav>
        </header>
        <main className="detail-content-main">
          <p>La información para el municipio con ID "{municipioId}" no fue encontrada.</p>
          <p>Asegúrate de que este municipio tenga un "Índice" asociado en el backend.</p>
        </main>
      </div>
    );
  }

  const currentActiveElement = municipioIndexData.elementos.find(el => el.id === activeSectionKey);

  return (
    <div className="municipio-detail-screen-container">
      <header className="municipios-header">
        <div className="municipios-logo-placeholder">UPN</div>
        <h1>Datos del Municipio: {municipioIndexData.municipio_id}</h1>
        <nav>
          <button className="municipios-nav-button" onClick={handleInicioClick}>
            Inicio
          </button>
          {!isEditingSection ? (
            <button className="edit-section-button" onClick={handleEditSectionClick}>
              Editar Sección
            </button>
          ) : (
            <button className="edit-section-button cancel-edit-button" onClick={handleCancelSectionEdit}>
              Modo Lectura
            </button>
          )}
        </nav>
      </header>

      <main className="detail-content-main">
        <div className="detail-left-panel">
          <div className="detail-menu-header">
            <h3>ÍNDICE</h3>
            <span className="arrow-icon">&#9660;</span>
          </div>
          <ul className="detail-menu-list">
            {municipioIndexData.elementos && municipioIndexData.elementos.map((elemento) => (
              <li
                key={elemento.id}
                className={`detail-menu-item ${activeSectionKey === elemento.id ? 'active' : ''}`}
                onClick={() => handleSectionClick(elemento.id)}
              >
                {elemento.titulo || 'Sección sin título'}
                <span className="arrow-icon">{activeSectionKey === elemento.id ? '&#9650;' : '&#9660;'}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="detail-right-panel">
          {isEditingSection ? (
            <form onSubmit={handleSaveSectionContent} className="edit-section-form">
              <div className="input-group">
                <label htmlFor="editSectionContent">
                  Contenido de "{currentActiveElement?.titulo || 'Sección' }":
                </label>
                <textarea
                  id="editSectionContent"
                  value={editedSectionContent}
                  onChange={(e) => setEditedSectionContent(e.target.value)}
                  rows="10"
                  className="edit-textarea"
                />
              </div>
              <div className="form-buttons-container section-edit-buttons">
                <button type="submit" className="save-button">Guardar Cambios</button>
                <button type="button" className="cancel-button" onClick={handleCancelSectionEdit}>Cancelar</button>
              </div>
            </form>
          ) : (
            <>
              <div className="detail-text-content">
                <p>{currentActiveElement?.titulo || 'No hay información disponible para esta sección.'}</p>
              </div>
              <div className="detail-buttons-container">
                <button className="download-button" onClick={() => handleDownload('word')}>WORD</button>
                <button className="download-button" onClick={() => handleDownload('pdf')}>PDF</button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default MunicipioDetailScreen;