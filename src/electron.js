/* eslint-disable import/no-extraneous-dependencies */

const { app, BrowserWindow } = require('electron');
const installExtension = require('electron-devtools-installer').default;
const poi = require('poi/bin/run');
const { join } = require('path');
const { format } = require('url');

const devServer = poi({ mode: 'development' });
const isProd = process.env.NODE_ENV === 'production';

let window;

function createWindow() {
  window = new BrowserWindow();
  window.setMenu(null);

  if (isProd) {
    window.loadURL(format({
      pathname: join(__dirname, '../../dist/index.html'),
      protocol: 'file',
      slashes: true,
    }));
  } else {
    window.loadURL('http://localhost:4000/');
  }

  installExtension({
    id: 'fmkadmapgofadopljbjfkapdkoienihi',
    electron: '^2.0.0',
  });

  window.on('closed', () => { window = null; });
}

app.on('ready', () => {
  devServer.then(() => createWindow());
});

app.on('activate', () => {
  if (window === null) createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
  if (!isProd) process.kill(0, 'SIGINT');
});
