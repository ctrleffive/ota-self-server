const { app, BrowserWindow, dialog } = require('electron')
const server = require('../api/server')

let mainWindow

const launchSplash = async () => {
  mainWindow = new BrowserWindow({
    width: 150,
    height: 150,
    frame: false,
    maximizable: false,
    resizable: false,
    fullscreenable: false
  })
  mainWindow.loadFile('main/index.html')

  const retryServer = async () => {
    try {
      await server.start()
      dialog.showMessageBox('Success!')
    } catch (error) {
      dialog.showMessageBox(null, {
        type: 'warning',
        buttons: [
          'Quit',
          'Retry'
        ],
        noLink: true,
        defaultId: 1,
        title: 'Error!',
        message: 'Failed to start server!',
        detail: 'Port 3456 is used by some other application.\nMake sure that 3456 port is available and retry.'
      }, (response) => {
        if (response === 1) {
          retryServer()
        } else {
          app.quit()
        }
      })
    }
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  retryServer()
}

app.on('ready', launchSplash)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    launchSplash()
  }
})
