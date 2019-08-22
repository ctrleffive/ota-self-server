const { app, BrowserWindow, dialog } = require('electron')
const server = require('../api/server')

let splashWindow

const launchSplash = async () => {
  splashWindow = new BrowserWindow({
    width: 105,
    height: 105,
    frame: false,
    maximizable: false,
    resizable: false,
    fullscreenable: false,
    alwaysOnTop: true,
    transparent: true,
    thickFrame: false,
    focusable: false
  })
  splashWindow.loadFile('main/splash.html')

  const retryServer = async () => {
    try {
      await server.start()

      const welcomeWindow = new BrowserWindow({
        frame: false,
        fullscreen: false,
        maximizable: false,
        width: 300,
        height: 200,
        resizable: false,
        alwaysOnTop: true
      })
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
        title: 'Intranet Server',
        message: 'Failed to start intranet server!',
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
