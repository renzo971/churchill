import { Add } from '@mui/icons-material';
import {
  Alert,
  DisplayButton,
  List,
  Presenter,
  Sidebar,
  Title,
  Wrapper,
} from 'components';
import { usePresenter } from 'hooks';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import createPersistedState from 'use-persisted-state';
import { BROADCAST } from 'values';
import { ResourceModal } from './modal';

const useSettings = createPersistedState(BROADCAST.SETTINGS);
const useBroadcast = createPersistedState(BROADCAST.CHANNEL);

export default function MiscPage() {
  const [settings] = useSettings(BROADCAST.INITIAL_SETTINGS);
  const [, setMessage] = useBroadcast(BROADCAST.INITIAL_CHANNEL);
  const [resources, setResources] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showLogo, setShowLogo] = useState(true);
  const [current, setCurrent] = useState(resources[0] || null);
  const { presenting } = usePresenter();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const subPath = 'Churchill\\Images';
    window.electronAPI?.getBackgroundImages(subPath).then((images) => {
      if (images?.length) {
        setResources(images);
      }
      setIsLoading(false);
    });
  }, [showModal]);

  const handleDelete = async (data) => {
    const subPath = 'Churchill\\Images';
    const fileName = `${data.title}.${data.bg.split(';')[0].split('/')[1]}`; // Extrae extensión del base64
    try {
      const result = await window.electronAPI?.deleteBackgroundImage(
        subPath,
        fileName
      );
      if (result.success) {
        setResources((prev) => prev.filter((r) => r.id !== data.id));
      } else {
        alert(result.message);
      }
    } catch (e) {
      alert('Error eliminando imagen');
    }
  };

  useEffect(() => {
    setMessage(showLogo ? null : current);
  }, [current, showLogo, setMessage]);
  useEffect(() => {
    setCurrent(resources[0]);
  }, [resources]);
  return (
    <Wrapper>
      <Sidebar>
        <Title>Recursos</Title>

        <DisplayButton
          value={showLogo}
          presenting={presenting}
          onToggle={setShowLogo}
        />

        <Button
          block
          size="lg"
          variant="success"
          className="mb-4"
          onClick={() => setShowModal(true)}
        >
          <Add /> Agregar
        </Button>

        <List>
          <List.Item className="mb-1">
            <List.Title>listado de recursos</List.Title>
          </List.Item>

          {isLoading ? (
            <p style={{ color: 'white' }}>Buscando recursos...</p>
          ) : (
            resources.map((resource) => (
              <List.Image
                key={resource.id}
                onClick={() => setCurrent(resource)}
                onEdit={() => setShowModal(resource)}
                onDelete={() => handleDelete(resource)}
                src={resource.bg}
                title={resource.title}
                description={resource.description}
                active={current?.id === resource.id}
                disabled={!showLogo && presenting}
              />
            ))
          )}
        </List>
      </Sidebar>

      {presenting ? (
        <Alert presenting={!showLogo} label={current?.title} />
      ) : null}

      <Wrapper direction="column" {...settings}>
        <Presenter
          id={current?.id}
          live={!showLogo}
          bg={current?.bg}
          grayscale={presenting && showLogo}
          {...settings}
        />
      </Wrapper>

      <ResourceModal
        show={!!showModal}
        handleClose={() => setShowModal(false)}
      />
    </Wrapper>
  );
}
