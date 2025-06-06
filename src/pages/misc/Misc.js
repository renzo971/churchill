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
import { useCallback, useEffect, useState } from 'react';
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
  useEffect(() => {
    const subPath = 'Churchill\\Images';
    window.electronAPI?.getBackgroundImages(subPath).then((images) => {
      if (images?.length) {
        setResources(images);
      }
    });
  }, [showModal]);

  const handleSave = useCallback(
    (data) => {
      setShowModal(false);
      setResources((state) => {
        //  Verifica si el recurso ya existe
        const existingResource = state.find((item) => item.id === data.id);
        if (existingResource) {
          // Si existe, actualiza el recurso
          const newState = state.map((item) =>
            item.id === data.id ? { ...item, ...data } : item
          );
          // setear el recurso actualizado
          setCurrent(newState.find((item) => item.id === data.id));
          return newState;
        }

        const newState = [...state, data];
        return newState;
      });
    },
    [setResources]
  );

  const handleDelete = useCallback(
    (data) => {
      setResources((state) => {
        const newState = state.filter((item) => item.id !== data.id);
        setCurrent(newState[0] || null);
        return newState;
      });
    },
    [setResources]
  );

  useEffect(() => {
    setMessage(showLogo ? null : current);
  }, [current, showLogo, setMessage]);

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

          {resources.map((resource) => (
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
          ))}
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
        handleSave={handleSave}
        resource={typeof showModal === 'boolean' ? undefined : showModal}
      />
    </Wrapper>
  );
}
