const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    frame: false,
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true, // Enable the remote module
    },
  })

  win.on('keydown', (event) => {
    if (event.key === 'F11') {
      event.preventDefault(); // Prevent the default behavior (exit fullscreen)
    }
  });

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})