const { app, BrowserWindow, ipcMain, webContents } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      enableRemoteModule: true,
      webviewTag: true,
      contextIsolation: false,
      // preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      nodeIntegrationInSubFrames: true,
    },
  });

  win.loadFile('index.html');

  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('open-devtools', (event, targetContentsId, devtoolsContentsId) => {
  const target = webContents.fromId(targetContentsId);
  const devtools = webContents.fromId(devtoolsContentsId);
  target.setDevToolsWebContents(devtools);
  target.openDevTools();
  // add this one line to fix empty page bug.
  devtools.executeJavaScript('window.location.reload()');
});

app.commandLine.appendSwitch('remote-debugging-port', '8888');
app.commandLine.appendSwitch('remote-debugging-address', 'http://127.0.0.1');
