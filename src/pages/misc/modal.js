import { useEffect, useState } from 'react';
import { Button, Col, Form, Modal } from 'react-bootstrap';
import { generateGUID, toBase64 } from 'utils';

export function ResourceModal({ show, resource, handleClose, handleSave }) {
  const [title, setTitle] = useState(null);
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [validated] = useState(true);
  const [error, setError] = useState(null);

  const save = () => {
    handleSave({
      id: resource ? resource.id : generateGUID(),
      title,
      base64: image,
      extension: file ? file.name.split('.').pop().toLowerCase() : null,
    });

    setTitle(null);
    setImage(null);
    setFile(null);
    setError(null);
  };

  const close = () => {
    handleClose();
    setTitle(null);
    setImage(null);
    setFile(null);
    setError(null);
  };

  useEffect(() => {
    if (resource) {
      setTitle(resource.title);
      setImage(resource.bg);
    } else {
      setTitle(null);
      setImage(null);
      setFile(null);
    }
    setError(null);
  }, [resource]);

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
        <Modal.Title>
          {resource ? 'Editar ' : 'Agregar '}
          Recurso
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated}>
          <Form.Row>
            <Form.Group hasValidation as={Col}>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.j. Mapa de viajes"
                value={title}
                onChange={({ target }) => setTitle(target.value)}
                required
                isInvalid
              />
            </Form.Group>
          </Form.Row>
        </Form>

        {image ? (
          <div
            className="d-flex align-items-center w-100"
            style={{ gap: '0.5rem' }}
          >
            <img
              src={image}
              alt=""
              className="preview-resource rounded image"
            />

            <Button
              size="sm"
              className="m-0"
              variant="outline-danger"
              disabled={!image}
              style={{ height: 38 }}
              onClick={() => {
                setImage(null);
                setFile(null);
              }}
            >
              Eliminar
            </Button>
          </div>
        ) : (
          <>
            <Form.File
              id="background"
              label="Selecciona una imagen de fondo..."
              accept="image/png, image/jpeg"
              size="sm"
              custom
              className="resource-custom"
              onChange={({ target }) => {
                const file = target.files[0];
                if (file) {
                  if (file.size > 1.5 * 1024 * 1024) {
                    setError('La imagen no puede pesar más de 1.5 MB.');
                    target.value = null;
                    return;
                  }
                  setError(null);
                  toBase64(file).then((image) => {
                    setImage(image);
                    setFile(file);
                  });
                }
              }}
            />

            {error && <small className="text-danger">{error}</small>}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={save} disabled={!title || !image}>
          {resource ? 'Actualizar' : 'Agregar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
