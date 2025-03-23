import newRequest from './request.js'

function host(app) {
  app.post('/sendRequest', (req, res) => {
    var model = req.body.model
    var thread = req.body.thread
    var prompt = req.body.p
    var type = req.body.t
    var urls = req.body.urls
    var voice = req.body.v
    var startingMessage = req.body.startingmessage
    newRequest(
      res, model || '', thread || '', 
      prompt, type, urls=urls, voice=voice, 
      startingMessage=startingMessage
    )
  })

  return app
}

export default host