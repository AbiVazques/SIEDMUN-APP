import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AddElementScreen.css';
import './MunicipioDetailScreen.css';
import HtmlEditor from './HtmlEditor';

function MunicipioDetailScreen() {
  const navigate = useNavigate();
  const { id: municipioId } = useParams();

  const [municipioIndexData, setMunicipioIndexData] = useState(null);
  const [sectionData, setSectionData] = useState({});
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
            const mensajeElemento = indexFound.elementos[0];
            setActiveSectionKey(mensajeElemento.id);
            setEditedSectionContent(mensajeElemento.titulo);
            fetchSectionData(mensajeElemento.id);
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

  const fetchSectionData = async (elementId) => {
    try {
      const res = await fetch(`${BASE_URL}/secciones/indices/${elementId}`);
      const data = await res.json();
      if (data && data.contenido) {
        setSectionData(data);
        setEditedSectionContent(data.contenido.body);
      } else {
        data.contenido = {}
        data.contenido.body = "No hay contenido disponible para esta sección.";
        setSectionData(data);
      }
    } catch {
      setSectionData({ contenido: { body: 'Error al cargar el contenido de la sección.' } });
    }
  };

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
    fetchSectionData(elementId)
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

  const handleUpdateSectionEdit = async () => {
    sectionData.contenido.body = editedSectionContent;
    if (sectionData.id) {
      updateSection();
    } else {
      // Si no hay ID, se crea una nueva sección
      createSection();
    }
  };

  const updateSection = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/secciones/${sectionData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sectionData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error HTTP al guardar: ${response.status} - ${errorData.error || response.statusText}`);
      }
      const updatedSection = await response.json();
      setSectionData(updatedSection);
      setIsEditingSection(false);
    } catch (err) {
      console.error("Error al guardar la sección:", err);
      setError(`No se pudieron guardar los cambios: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createSection = async () => {
    setLoading(true);
    setError(null);
    console.log("Creando nueva sección para indice:", activeSectionKey);
    let data = {
      "indice_id": activeSectionKey,
      "tipo": "texto",
      contenido: {
        titulo: "tbd",
        body: editedSectionContent,
      },
    };
    try {
      const response = await fetch(`${BASE_URL}/secciones/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error HTTP al guardar: ${response.status} - ${errorData.error || response.statusText}`);
      }
      const createdSection = await response.json();
      setSectionData(createdSection);
      setIsEditingSection(false);
    } catch (err) {
      console.error("Error al creat la sección:", err);
      setError(`No se pudo crear la seccion: ${err.message}`);
    } finally {
      setLoading(false);
    }
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
              </li>
            ))}
          </ul>
        </div>

        <div className="detail-right-panel">
          {isEditingSection ? (
            <div className="edit-section-form">
              <HtmlEditor
                id="editSectionContent"
                onChange={(e) => setEditedSectionContent(e.target.value)}
                html={editedSectionContent} setHtml={setEditedSectionContent}
                HtmlEditor />
              <div className="form-buttons-container section-edit-buttons">
                <button type="submit" className="save-button" onClick={handleUpdateSectionEdit}>Guardar Cambios</button>
                <button type="button" className="cancel-button" onClick={handleCancelSectionEdit}>Cancelar</button>
              </div>
            </div>
          ) : (
            <div style={{ padding: 0 }}>
              <div
                style={{ justifyContent: 'center', alignItems: 'center', padding: '10px 0' }}
                dangerouslySetInnerHTML={{ __html: sectionData.contenido?.body || '' }}
              />
              <div className="detail-buttons-container">
                <button className="download-button" onClick={() => handleDownload('word')}>WORD</button>
                <button className="download-button" onClick={() => handleDownload('pdf')}>PDF</button>
              </div>
            </div >
          )
          }
        </div >
      </main >
    </div >
  );
}

export default MunicipioDetailScreen;