const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const portUsage = require('tcp-port-used')

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

    app.use('/', routes)

    return new Promise((resolve, reject) => {
      const port = 3456
      portUsage.waitUntilFree(port, 500, 5000)
        .then(() => {
          const server = app.listen(port, () => {
            console.info('API server is listening..')
            resolve(server)
          })
        })
        .catch((error) => reject(error))
    })
  }
}
