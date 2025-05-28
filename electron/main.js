const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, '../public/logo.jpeg'),
    title: 'Galerie Joséphine',
  });

  // En développement, charge l'URL de développement Next.js
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    // En production, charge le build statique
    const indexPath = path.join(__dirname, '../out/index.html');
    mainWindow.loadFile(indexPath);
  }

  // Désactive le menu en production
  if (!isDev) {
    mainWindow.setMenu(null);
  }
}

// Gestion du démarrage de l'application
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Gestion de la fermeture de l'application
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
