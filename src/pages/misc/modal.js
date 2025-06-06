import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

export function ResourceModal({ show, resource, handleClose, handleSave }) {
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
    }
  };

  const handleGuardar = async () => {
    if (!file) {
      alert('Primero selecciona una imagen.');
      return;
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer); // convierte en Buffer para fs

    try {
      const respuesta = await window.electronAPI?.saveImage(file.name, buffer);
      alert(respuesta);
      setError(null);
      handleClose();
      setFile(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const close = () => {
    handleClose();
    setError(null);
  };

  return (
    <Modal
      size="sm"
      centered
      show={show}
      onHide={close}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton className="border-0">
        <Modal.Title>Agregar Recurso</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {file && (
          <div
            className="d-flex align-items-center w-100"
            style={{ gap: '0.5rem' }}
          >
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="preview-resource rounded image"
            />
            <Button
              size="sm"
              className="m-0"
              variant="outline-danger"
              style={{ height: 38 }}
              onClick={() => setFile(null)}
            >
              Eliminar
            </Button>
          </div>
        )}

        <Form.File
          id="background"
          label={file ? file.name : 'Selecciona una imagen de fondo....'}
          accept="image/png, image/jpeg"
          size="sm"
          custom
          className="resource-custom"
          onChange={handleFileChange}
        />

        {error && <small className="text-danger">{error}</small>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleGuardar}>
          Agregar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
