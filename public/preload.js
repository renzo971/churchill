const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getBackgroundImages: (relativePath) =>
    ipcRenderer.invoke('get-background-images', relativePath),
  saveImage: (fileName, buffer) =>
    ipcRenderer.invoke('save-image', fileName, buffer),
  deleteBackgroundImage: (relativePath, fileName) =>
    ipcRenderer.invoke('delete-background-image', relativePath, fileName),
  getBackgroundAudios: () => ipcRenderer.invoke('get-background-audios'),
  getDirectoryPath: (subPath) =>
    ipcRenderer.invoke('get-directory-path', subPath),
  openDirectory: (subPath) => ipcRenderer.invoke('open-directory', subPath),
  togglePresenter: (monitorId) =>
    ipcRenderer.invoke('toggle-presenter', monitorId),
  closePresenter: () => ipcRenderer.invoke('close-presenter'),
  reload: () => ipcRenderer.invoke('reload'),
  openDevTools: () => ipcRenderer.invoke('open-devtools'),
  getDisplays: () => ipcRenderer.invoke('get-displays'),
  getScreenSources: () => ipcRenderer.invoke('get-screen-sources'),
  openLink: (url) => ipcRenderer.send('open-link', url),
});
