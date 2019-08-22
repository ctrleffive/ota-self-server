const { app, BrowserWindow, dialog } = require('electron')
const server = require('../api/server')

let splashWindow

const launchSplash = async () => {
  splashWindow = new BrowserWindow({
    width: 150,
    height: 150,
    frame: false,
    maximizable: false,
    resizable: false,
    fullscreenable: false,
    alwaysOnTop: true
  })
  splashWindow.loadFile('main/splash.html')

  const retryServer = async () => {
    try {
      await server.start()

      const welcomeWindow = new BrowserWindow({})
      welcomeWindow.loadFile('main/welcome.html')

      splashWindow.close()
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

  splashWindow.on('closed', () => {
    splashWindow = null
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
  if (splashWindow === null) {
    launchSplash()
  }
})
