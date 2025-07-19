// src/AddElementScreen.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddElementScreen.css';

function AddElementScreen() {
  const navigate = useNavigate();
  const [nombreElemento, setNombreElemento] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagenPerfil, setImagenPerfil] = useState(null);
  const [documentoAdjunto, setDocumentoAdjunto] = useState(null);

  const imageInputRef = useRef(null);
  const documentInputRef = useRef(null);

  // MODIFICACIÓN AQUÍ: Cambiamos la función de navegación para ir a /municipios
  const handleMunicipiosClick = () => { // Cambiado el nombre de la función para mayor claridad
    navigate('/municipios'); // Redirige a la pantalla de Municipios
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
    }
  };

  const handleDocumentChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentoAdjunto(e.target.files[0]);
    }
  };

  const handleGuardar = (e) => {
    e.preventDefault();

    if (!nombreElemento) {
      alert('Por favor, ingresa el nombre del elemento.');
      return;
    }

    // Aquí iría la lógica real para guardar los datos.
    console.log('Guardando elemento:', {
      nombre: nombreElemento,
      descripcion: descripcion,
      imagen: imagenPerfil ? imagenPerfil.name : 'No seleccionada',
      documento: documentoAdjunto ? documentoAdjunto.name : 'No seleccionado',
    });

    alert(`"${nombreElemento}" guardado exitosamente.`);
    navigate('/municipios'); // Vuelve a la pantalla de municipios después de guardar
  };

  const handleCancelar = () => {
    if (window.confirm('¿Estás seguro de que quieres cancelar? Los cambios no guardados se perderán.')) {
      navigate('/municipios'); // Vuelve a la pantalla de municipios
    }
  };

  return (
    <div className="add-element-screen-container">
      <header className="add-element-header">
        <div className="add-element-logo-placeholder">UPN</div>
        <h1>Añadir Elemento</h1>
        <nav>
          {/* MODIFICACIÓN AQUÍ: Cambiado el texto del botón y el onClick */}
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
                    {documentoAdjunto ? documentoAdjunto.name : 'Seleccionar archivo PDF/DOC'}
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
                {imagenPerfil ? (
                  <img src={URL.createObjectURL(imagenPerfil)} alt="Vista previa" className="uploaded-image-preview" />
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
            <button type="submit" className="save-button">Guardar</button>
            <button type="button" className="cancel-button" onClick={handleCancelar}>Cancelar</button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default AddElementScreen;