import createThread from './threads/create.js'
import deleteThread from './threads/delete.js'

function host(app) {
  app.get('/cThread', createThread)
  app.post('/createThread', createThread)

  app.get('/dThread', deleteThread)
  app.delete('/deleteThread', deleteThread)
  return app
}

export default host