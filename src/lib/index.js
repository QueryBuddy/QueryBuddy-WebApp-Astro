import 'dotenv/config'

import cors from 'cors'
import express from 'express'
var app = express()
  
import fs from 'fs';
import path from 'path'

import hostRequestEndpoint from './hostRequest.js'
import hostThreadEndpoints from './hostThreads.js'

import uploadFile from './uploadFile.js'

import config from './config.js'
var appsList = config.appsList

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(express.json())

// User inputs
app.get('/', (req, res) => {
  res.redirect('/chat')
})

app = hostRequestEndpoint(app)

appsList.forEach((aName, i) => {
  var hPath = `/get${aName[0].toUpperCase()}${aName.slice(1)}`
  var fPath = `./apps/${aName[0].toLowerCase()}${aName.slice(1)}.js`
  app.get(hPath, cors(corsOptions), (req, res) => {
    import(fPath).then(module => {
      module.default(req, res)
    })
  })
})

app.post("/uploadFile", uploadFile)

app.get('/temp/:name', (req, res) => {
  var name = req.params.name
  var file = '/temp.html'
  if (!!name) {
    file = `/temp/${name}`
  }
  res.sendFile(file, {root: '.'})
})

app.get('/listImages', (req, res) => {
  var files = fs.readdirSync('temp')
  res.json(files)
})

app.get('/clearImages', (req, res) => {
  const directory = `./temp`;

  fs.readdir(directory, (err, files) => {
    if (err) res.send(err);

    for (const file of files) {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) res.send(err);
      });
    }
    res.send('cleared!')
  });
})

app.get('/viewImage', (req, res) => {
  var url = req.query.u
  if (!!atob(url)) url = atob(url)
  var p = req.query.p

  var viewImage = fs.readFileSync('viewImage.html', 'utf8')
  viewImage = viewImage.replaceAll('$[src]', url)
  viewImage = viewImage.replaceAll('$[prompt]', p)

  res.send(viewImage)
})

app = hostThreadEndpoints(app)

app.get('/chat', (req, res) => {
  var fileContent = fs.readFileSync('chat.html', 'utf8')

  var models = config.models

  var mStr = ''

  if (Object.keys(models).length > 0) {
    Object.keys(models).forEach(key => {
      if (key.startsWith('_')) return
      var model = models[key]
      if (key === config.defaultModel) mStr += `<option value="${key}" selected="selected">${key} (${model.provider.name})</option>`
      else if (model) mStr += `<option value="${key}">${key} (${model.provider.name})</option>`
    })
    mStr = `<select title="Select Model" id="model">${mStr}</select>`
    fileContent = fileContent.replaceAll(/<selectModels>.*<\/selectModels>/g, mStr)
    fileContent = fileContent.replaceAll('<selectModels />', mStr)
  }
  else {
    fileContent = fileContent.replaceAll('<selectModels>', '')
    fileContent = fileContent.replaceAll('</selectModels>', '')
  }

  res.send(fileContent)
})

app.get('*', (req, res) => {
  var path = req.path
  if (path.startsWith('/')) path = path.slice(1)
  if (path.endsWith('/')) path = path.slice(0, -1)
  if (!path.includes('.')) path = `${path}.html`
  if (!fs.existsSync(`./${path}`)) {
    path = '404.html'
  }
  res.sendFile(path, {root: '.'})
})

var port = 3000
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})