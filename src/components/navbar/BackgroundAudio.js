import { useContext, useRef, useState, useEffect, useMemo } from 'react';
import useSound from 'use-sound';
import { Close, FolderCopy, PlayArrow, Stop } from '@mui/icons-material';
import {
  Badge,
  Button,
  ListGroup,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';

import { BackgroundAudioContext } from 'providers/BackgroundAudioProvider';
import { Sidebar } from 'components/sidebar';

// Constantes
const SOUND_CONFIG = {
  volume: 1,
  playbackRate: 1,
  interrupt: true,
  html5: true,
};

const PLAY_DELAY = 50;

// Componente para cada pista de audio
const TrackItem = ({ track, index, currentIndex, isPlaying, onClick }) => (
  <ListGroup.Item
    action
    active={currentIndex === index}
    className="d-flex justify-content-between align-items-start"
    onClick={onClick}
    style={{ cursor: 'pointer' }}
  >
    <div className="ms-2 me-auto">
      <div className="fw-bold">
        {index + 1}. {track.replace('.mp3', '')}
      </div>
      {isPlaying && currentIndex === index && (
        <span className="text-success">Reproduciendo</span>
      )}
    </div>
    <Badge bg={currentIndex === index ? 'success' : 'primary'} pill>
      {currentIndex === index && isPlaying ? <Stop /> : <PlayArrow />}
    </Badge>
  </ListGroup.Item>
);

export function BackgroundAudio() {
  const folder = useMemo(() => {
    const subPath = 'Churchill\\Pistas\\Fondomusical';

    return {
      open: () => window.electronAPI?.openDirectory(subPath),
      getPath: async () => {
        const basePath = await window.electronAPI?.getDirectoryPath(subPath);
        return `file://${basePath}`;
      },
    };
  }, []);
  const {
    localUrl,
    setIsReady,
    index,
    setIndex,
    playlist,
    showOptions,
    setShowOptions,
  } = useContext(BackgroundAudioContext);

  const [shouldPlay, setShouldPlay] = useState(false);
  const [pendingIndex, setPendingIndex] = useState(null);

  const [play, { stop, isPlaying }] = useSound(localUrl, {
    ...SOUND_CONFIG,
    onload: () => setIsReady(true),
    onloaderror: (err) => {
      console.error(`Error cargando audio ${localUrl}:`, err);
      setIsReady(false);
    },
  });

  useEffect(() => {
    if (shouldPlay && localUrl && playlist.length > 0) {
      stop();
      const timer = setTimeout(() => play(), PLAY_DELAY);
      return () => clearTimeout(timer);
    }
  }, [shouldPlay, localUrl, play, stop, playlist.length]);

  useEffect(() => {
    if (pendingIndex !== null && playlist.length > 0) {
      stop();
      setIndex(pendingIndex);
      setShouldPlay(true);
      setPendingIndex(null);
    }
  }, [pendingIndex, setIndex, stop, playlist.length]);

  const handlePlay = (idx) => {
    if (index === idx && isPlaying) {
      stop();
      setShouldPlay(false);
    } else {
      stop();
      setShouldPlay(false);
      setPendingIndex(idx);
    }
  };

  const handleOpenPath = (e) => {
    e.preventDefault(); console.log(folder);
    folder.open();
  };

  return (
    <Sidebar
      light
      closable
      className={showOptions ? '' : 'closed'}
      size={600}
      offset={320 + 55}
    >
      <h1 className="display-4">Fondos Musicales</h1>
      <p className="text-muted">
        Agrega su pista en formato <i>.mp3</i> en la carpeta{' '}
        <strong>Documentos/Pistas/Fondomusical</strong>{' '}
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Abrir directorio de pistas</Tooltip>}
        >
          <Button
            className="mr-2"
            variant="secondary"
            onClick={handleOpenPath}
          >
            <FolderCopy />
          </Button>
        </OverlayTrigger>
      </p>
      <hr />

      {playlist.length === 0 ? (
        <div className="text-center text-muted mt-4">
          <p>No hay pistas de audio disponibles</p>
          <p>Agrega archivos MP3 al directorio de pistas</p>
          <p>y volver a abrir la aplicación</p>
        </div>
      ) : (
        <div style={{ marginTop: 16 }}>
          <ListGroup>
            {playlist.map((track, idx) => (
              <TrackItem
                key={track}
                track={track}
                index={idx}
                currentIndex={index}
                isPlaying={isPlaying}
                onClick={() => handlePlay(idx)}
              />
            ))}
          </ListGroup>
        </div>
      )}

      <Button
        className="p-0 text-dark"
        variant="link"
        style={{ position: 'absolute', top: 13, right: 10 }}
        onClick={() => setShowOptions(false)}
      >
        <Close />
      </Button>
    </Sidebar>
  );
}
