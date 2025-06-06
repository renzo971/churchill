const electron = require('electron');
// Module to control application life.
const { app, ipcMain, BrowserWindow, shell, screen, desktopCapturer, dialog } =
  electron;

const path = require('path');
const url = require('url');
const fs = require('fs');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null;
let presenterWindow = null;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  // and load the index.html of the app.
  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, '../build/index.html'),
      protocol: 'file:',
      slashes: true,
    });

  mainWindow.loadURL(startUrl);

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  // Hide menu
  mainWindow.removeMenu();

  // Show window when everything is loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize();
    mainWindow.show();
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // Creando carpeta para los himnos
  fs.mkdirSync(path.join(app.getPath('documents'), 'Churchill/Pistas'), {
    recursive: true,
  });
  // Creando carpeta para los fondos
  fs.mkdirSync(path.join(app.getPath('documents'), 'Churchill/Fondos'), {
    recursive: true,
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.handle('get-background-images', async (_, relativePath) => {
  try {
    const documentsPath = app.getPath('documents'); // Ruta base "Mis Documentos"
    const folderPath = path.join(documentsPath, relativePath); // Ruta completa

    // Verificar si la carpeta existe, si no, crearla
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      return []; // Retorna vacío ya que la carpeta estaba vacía
    }

    const files = fs.readdirSync(folderPath);
    const imageFiles = files.filter((file) => /\.(jpg|jpeg|png)$/i.test(file));

    const images = imageFiles.map((file, idx) => {
      const filePath = path.join(folderPath, file);
      const extension = path.extname(file).replace('.', '');
      const title = path.basename(file, `.${extension}`);
      const id = `${title}-${idx}-${Date.now()}`; // Generar un ID único
      let bg = '';
      try {
        const base64 = fs.readFileSync(filePath, { encoding: 'base64' });
        bg = `data:image/${extension};base64,${base64}`;
      } catch (e) {
        console.error(`Error leyendo imagen: ${filePath}`, e);
        bg = '';
      }
      const description = `Imagen de fondo: ${title}`;

      return { id, title, description, bg };
    });

    return images;
  } catch (error) {
    console.error('Error reading folder:', error);
    return [];
  }
});

ipcMain.handle('save-image', async (_, fileName, buffer) => {
  try {
    const saveDir = path.join(app.getPath('documents'), 'Churchill', 'Images');
    const savePath = path.join(saveDir, fileName);

    // Crear la carpeta si no existe
    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir, { recursive: true });
    }

    // Verifica si el buffer es válido
    if (!buffer || buffer.length === 0) {
      throw new Error('El archivo está vacío o no se pudo cargar.');
    }

    // Guarda el archivo
    fs.writeFileSync(savePath, Buffer.from(buffer));

    return 'Imagen guardada correctamente en: ' + savePath;
  } catch (err) {
    // Muestra alerta al usuario si falla
    dialog.showErrorBox('Error al guardar la imagen', err.message);
    throw err; // Re-lanza el error para que lo capture el renderer si lo deseas
  }
});
// 👇 Este handler debe estar aquí:
ipcMain.handle('get-background-audios', async () => {
  try {
    const folderPath = path.join(
      app.getPath('documents'),
      'Churchill/Pistas/Fondomusical'
    );

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      return []; // ⬅️ Esto hace que retorne vacío la primera vez, ¡lo cual está bien!
    }

    const files = fs.readdirSync(folderPath);
    const audioFiles = files.filter((file) => /\.mp3$/i.test(file));

    return audioFiles;
  } catch (error) {
    console.error('Error leyendo carpeta fondomusical:', error);
    return [];
  }
});
// Obtener la ruta de la carpeta en "Mis Documentos"
ipcMain.handle('get-directory-path', (_, subPath) => {
  return path.join(app.getPath('documents'), subPath);
});

// Abrir la carpeta en el explorador
ipcMain.handle('open-directory', async (_, subPath) => {
  const folderPath = path.join(app.getPath('documents'), subPath);

  // Crear la carpeta si no existe
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  return shell.openPath(folderPath);
});

ipcMain.handle('toggle-presenter', (event, selectedMonitorId) => {
  const [parent] = BrowserWindow.getAllWindows();
  let url = parent.webContents.getURL();

  if (presenterWindow) {
    if (presenterWindow.isVisible()) {
      presenterWindow.hide();
    } else {
      presenterWindow.show();
    }
    return presenterWindow.isVisible();
  }

  const displays = screen.getAllDisplays();
  const extDisplay = displays[selectedMonitorId];

  if (!extDisplay) {
    console.error('Monitor seleccionado no válido.');
    return false;
  }

  if (extDisplay) {
    presenterWindow = new BrowserWindow({
      x: extDisplay.bounds.x + 50,
      y: extDisplay.bounds.y + 50,
      frame: false,
      fullscreen: true,
      show: false,
      parent,
    });

    presenterWindow.loadURL(url.replace(/#.*$/, '#/cast-screen'));

    presenterWindow.once('ready-to-show', () => {
      presenterWindow.show();
    });

    // presenterWindow.webContents.openDevTools();

    return true;
  }

  return false;
});

ipcMain.handle('close-presenter', () => {
  if (presenterWindow) {
    presenterWindow.close();
    presenterWindow = null;
    return false;
  }
  return true;
});

ipcMain.handle('reload', () => {
  const main = BrowserWindow.getFocusedWindow();
  if (main) {
    main.reload();
  }
});

ipcMain.handle('open-devtools', () => {
  const main = BrowserWindow.getFocusedWindow();
  if (main) {
    main.webContents.openDevTools();
  }
});

ipcMain.handle('get-displays', () => {
  return screen.getAllDisplays().map((display, index) => ({
    id: index,
    label: display.label,
    bounds: display.bounds,
  }));
});

ipcMain.handle('get-screen-sources', async () => {
  const sources = await desktopCapturer.getSources({ types: ['screen'] });

  return sources.map((source, index) => ({
    id: index,
    name: source.name,
    thumbnail: source.thumbnail.toDataURL(), // Convertimos la imagen en base64
  }));
});

ipcMain.on('open-link', (event, url) => {
  shell.openExternal(url); // Abre el enlace en el navegador predeterminado
});
