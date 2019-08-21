const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
const portUsage = require('tcp-port-used')
const isDevelopment = require('electron-is-dev')

module.exports = {
  start: () => {
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(cors())

    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE'
      )
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
      )
      next()
    })

    const routes = require('./routes')({ express })

    if (!isDevelopment) {
      app.use('/', express.static(path.join(__dirname, './../../main')))
    }

    app.use('/api', routes)

    return new Promise((resolve, reject) => {
      const port = 3456
      portUsage.waitUntilFree(port, 500, 5000)
        .then(() => {
          app.listen(port, () => {
            console.info('API server is listening..')
            resolve()
          })
        })
        .catch((error) => reject(error))
    })
  }
}
