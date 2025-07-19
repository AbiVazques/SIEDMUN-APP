// src/EditMunicipioScreen.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AddElementScreen.css'; 

function EditMunicipioScreen() {
  const navigate = useNavigate();
  const { id } = useParams();

  
  const allMunicipiosData = [
    { id: 'xoxo', name: 'XOCOTLÁN', image: './assets/xoxocotlan.png', description: 'Santa Cruz Xoxocotlán es un municipio con rica historia y cultura. Conocido por sus zonas arqueológicas y festividades.', document: null },
    { id: 'tutu', name: 'TUTUTEPEC', image: './assets/tututepec.png', description: 'Santiago Pinotepa Nacional, también conocido como Tututepec, es un centro económico importante en la costa de Oaxaca.', document: null },
    { id: 'chahui', name: 'CHAHUITES', image: './assets/chahuites.png', description: 'Un municipio en el Istmo de Tehuantepec, famoso por su producción agrícola y su ambiente cálido.', document: null },
    { id: 'cienega', name: 'CIENEGA ZIMATLÁN', image: './assets/cienega_zimatlan.png', description: 'Ciénega de Zimatlán se distingue por sus paisajes naturales y su cercanía a los Valles Centrales.', document: null },
    { id: 'zimatlan', name: 'ZIMATLÁN', image: './assets/zimatlan.png', description: 'Zimatlán de Álvarez, cabecera de distrito, con un mercado vibrante y tradiciones arraigadas.', document: null },
    { id: 'huazo', name: 'SANTA MARÍA HUAZOLOTITLAN', image: './assets/santa_maria_huazolotitlan.png', description: 'Información general de Santa María Huazolotitlán.', document: null },
  ];

  const [nombreElemento, setNombreElemento] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagenPerfil, setImagenPerfil] = useState(null);
  const [documentoAdjunto, setDocumentoAdjunto] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [currentDocumentName, setCurrentDocumentName] = useState('');

  const imageInputRef = useRef(null);
  const documentInputRef = useRef(null);

  useEffect(() => {
    const municipioToEdit = allMunicipiosData.find(m => m.id === id);
    if (municipioToEdit) {
      setNombreElemento(municipioToEdit.name);
      setDescripcion(municipioToEdit.description || '');
      setCurrentImageUrl(municipioToEdit.image || '');
      setCurrentDocumentName(municipioToEdit.document ? 'documento_actual.pdf' : '');
    } else {
      alert('Municipio no encontrado.');
      navigate('/municipios');
    }
  }, [id, navigate]);

  const handleMunicipiosClick = () => {
    navigate('/municipios');
  };

  const handleImageUploadClick = () => {
    imageInputRef.current.click();
  };

  const handleDocumentUploadClick = () => {
    documentInputRef.current.click();
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImagenPerfil(e.target.files[0]);
      setCurrentImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleDocumentChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentoAdjunto(e.target.files[0]);
      setCurrentDocumentName(e.target.files[0].name);
    }
  };

  const handleGuardar = (e) => {
    e.preventDefault();

    if (!nombreElemento.trim()) {
      alert('Por favor, ingresa el nombre del elemento.');
      return;
    }

    const updatedData = {
      id: id,
      name: nombreElemento,
      description: descripcion,
      imagenFile: imagenPerfil,
      documentoFile: documentoAdjunto,
      currentImageUrl: currentImageUrl,
      currentDocumentName: currentDocumentName
    };

    console.log('Guardando cambios para:', updatedData);
    alert(`Información de "${nombreElemento}" actualizada exitosamente.`);
    navigate('/municipios');
  };

  const handleCancelar = () => {
    if (window.confirm('¿Estás seguro de que quieres cancelar? Los cambios no guardados se perderán.')) {
      navigate('/municipios');
    }
  };

  return (
    <div className="add-element-screen-container">
      <header className="add-element-header">
        <div className="add-element-logo-placeholder">UPN</div>
        <h1>Editar Municipio</h1>
        <nav>
          <button className="add-element-nav-button" onClick={handleMunicipiosClick}>
            Municipios
          </button>
        </nav>
      </header>

      <main className="add-element-content">
        <form className="add-element-form" onSubmit={handleGuardar}>
          <div className="form-sections-wrapper">
            <div className="form-left-section">
              <div className="input-group">
                <label htmlFor="nombreElemento">Nombre del Elemento</label>
                <input
                  type="text"
                  id="nombreElemento"
                  placeholder="Escribe el nombre del elemento"
                  value={nombreElemento}
                  onChange={(e) => setNombreElemento(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="descripcion">Descripción (Opcional)</label>
                <textarea
                  id="descripcion"
                  placeholder="Agrega una descripción detallada aquí..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows="4"
                ></textarea>
              </div>

              <div className="input-group">
                <label htmlFor="documentoAdjunto">AGREGAR DOCUMENTO</label>
                <div className="file-input-wrapper" onClick={handleDocumentUploadClick}>
                  <input
                    type="file"
                    id="documentoAdjunto"
                    ref={documentInputRef}
                    onChange={handleDocumentChange}
                    className="hidden-file-input"
                  />
                  <div className="file-placeholder">
                    {documentoAdjunto ? documentoAdjunto.name : (currentDocumentName || 'Seleccionar archivo PDF/DOC')}
                  </div>
                  <button type="button" className="upload-button">Examinar</button>
                </div>
              </div>
            </div>

            <div className="form-right-section">
              <div className="image-upload-area" onClick={handleImageUploadClick}>
                <input
                  type="file"
                  id="imagenPerfil"
                  accept="image/*"
                  ref={imageInputRef}
                  onChange={handleImageChange}
                  className="hidden-file-input"
                />
                {currentImageUrl ? (
                  <img src={currentImageUrl} alt="Vista previa" className="uploaded-image-preview" />
                ) : (
                  <>
                    <div className="image-placeholder-icon"></div>
                    <p>AGREGAR IMAGEN</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="form-buttons-container">
            <button type="submit" className="save-button">Guardar Cambios</button>
            <button type="button" className="cancel-button" onClick={handleCancelar}>Cancelar</button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default EditMunicipioScreen;