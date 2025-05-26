import { useApp } from 'hooks';
import { useEffect, useState, createContext } from 'react';
import { Spinner } from 'react-bootstrap'; // Asegúrate de tener react-bootstrap instalado

const BackgroundAudioContext = createContext({});

function BackgroundAudioProvider({ children }) {
  const [playlist, setPlaylist] = useState([]);
  const [index, setIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [localUrl, setLocalUrl] = useState('');
  const [currentTrack, setCurrentTrack] = useState('');
  const { myDocumentsPath } = useApp();
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    window.electronAPI?.getBackgroundAudios().then((audios) => {
      if (audios?.length) {
        setPlaylist(audios);
      }
    });
  }, []);

  useEffect(() => {
    if (playlist.length > 0) {
      setCurrentTrack(playlist[index]);
    }
    setIsReady(false); // Reinicia el estado cuando cambia la pista
  }, [playlist, index]);

  useEffect(() => {
    if (currentTrack && myDocumentsPath) {
      setLocalUrl(`${myDocumentsPath}\\Fondomusical\\${currentTrack}`);
    } else {
      setLocalUrl('');
    }
  }, [currentTrack, myDocumentsPath]);

  // Loader mientras carga
  if (playlist.length !== 0 && localUrl === "") {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <Spinner animation="border" role="status" color='white' />
        <div className='text-white'>Verificando listas de audio...</div>
      </div>
    );
  }

  return (
    <BackgroundAudioContext.Provider
      value={{
        localUrl,
        isReady,
        setIndex,
        index,
        playlist,
        setIsReady,
        showOptions,
        setShowOptions,
      }}
    >
      {children}
    </BackgroundAudioContext.Provider>
  );
}

export { BackgroundAudioContext, BackgroundAudioProvider };
