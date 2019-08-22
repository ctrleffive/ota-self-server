module.exports = (deps) => {
  const controller = require('./controller')(deps)
  const router = deps.express.Router()

  const routes = [
    // method, path, controller name
    ['GET', '/', controller.root]
  ]

  routes.forEach(route => {
    router[route[0].toLowerCase()](route[1], route[2])
  })
  return router
}
