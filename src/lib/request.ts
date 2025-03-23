import fs from 'fs';
import fetch from 'node-fetch' ;
import path from 'path';

var provider = 'OpenAI'
var api_key = process.env[`${provider.toUpperCase()}_API_KEY`]

import OpenAI from 'openai';
const openai = new OpenAI();

import config from './config.js'
import { getThreadMessages, addMessageToThread, VALID_ROLES } from './threads/messages.js';

var models = config.models

var checkPrompt = config.checkPrompt;
var errorCheck = config.errorCheck;

import apps from './appsConfig.js';
var appsData = apps.appsData

function isJSON(text) {
  let isValid = false;
  
  if (typeof text !== 'string' || (typeof text === 'string' && text.length === 0)) {
    return isValid;
  }
  
  try {
    JSON.parse(text);
    isValid = true;
  } catch (e) {
  }
  
  return isValid;
}

function newRequest(res, model, threadId, prompt, type, urls, voice, startingMessage) {
  if (!urls) urls = []

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${api_key}`,
  };

  switch (type) {
    case 'create-image': 
      model = `dall-e-${3}`
      imageRequest(headers, res, threadId, prompt, model, startingMessage)
      break;
    case 'create-audio':
      model = `tts-${1}-hd`
      audioRequest(res, threadId, prompt, voice, model, startingMessage)
      break;
    case 'transcribe-audio': 
      var path = `/temp/${prompt}`
      model = `whisper-${1}`
      transcriptionRequest(path, threadId, res, model, startingMessage)
      break;
    default:
      if (!model) model = config.defaultModel ?? Object.keys(models).find(m => !m.startsWith('_'))
      textRequest(res, threadId, prompt, model, type, urls, startingMessage)
      break;
  }
}

async function textRequest(res, threadId, prompt, model, type, urls, startingMessage) {
  var modelObj = models[model]

  if (type === 'live-image-send') type = 'image'

  if (!modelObj) {
    console.dir({model: model, modelObj: modelObj, message: 'Model not found'})
    res.send({status: 'Error', content: `Model ${model} not found`})
    return
  }
    
  if (startingMessage) {
    var sOutput = await (await modelObj.actions).completion(prompt, model, type, urls, true, startingMessage)
    res.send({status: 'OK', content: sOutput})
    return
  }
  
  // Save user message to thread file
  addMessageToThread(threadId, {
    role: VALID_ROLES.USER,
    content: prompt ?? ''
  })

  // Get previous messages from thread file
  const previousMessages = getThreadMessages(threadId)
    
  var output = await (await modelObj.actions).message(previousMessages, prompt, model, type, urls, true, startingMessage)

  if (output.isApp) output.status = 'appOK'
  else {
  // Save assistant response to thread file
    addMessageToThread(threadId, {
      role: VALID_ROLES.ASSISTANT,
      content: output.content
    })
  }

  // if (checkPrompt.includes('{userPrompt}')) {
  //   checkPrompt = checkPrompt.replace('{userPrompt}', prompt)
  // }
  // if (checkPrompt.includes('{aiResponse}')) {
  //   checkPrompt = checkPrompt.replace('{aiResponse}', output)
  // }

  // var cOutput = await (await modelObj.actions).completion(previousMessages, checkPrompt, model, type, urls, false, startingMessage)
  // if (cOutput === 'good') {
  //   res.send({status: 'OK', content: output})
  // }
  // else if (cOutput === 'not good') {
  //   if (errorCheck.includes('{errorMessage}')) {
  //     errorCheck = errorCheck.replace('{errorMessage}', output)
  //   }
  //   output = await (await modelObj.actions).completion(previousMessages, errorCheck, model, type, urls, false, startingMessage)
  //   res.send({status: 'Error', content: output})
  // }
  // else {
      res.send(output)
  // }
}

async function imageRequest(headers, res, threadId, prompt, model, startingMessage) {
  const payload = {
    model: model,
    prompt: prompt,
    n: 1,
    size: "1024x1024", 
  };

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: 'post',
    body: JSON.stringify(payload),
    headers: headers
  });

  const body = await response.json();
  if (body.error) {
    var err = body.error.message
    res.send({content: err, status: 'Error'})
  }
  else {
    data = body["data"];
    data.forEach(d => {
      url = d["url"];
      var status = url.includes('://') ? 'Success' : 'Error'
      res.send({status: status, content: url});
    });
  }
}

async function audioRequest(res, threadId, prompt, voice, model, startingMessage) {
  var fname = './speech.mp3'
  const speechFile = path.resolve(fname);

  if (model.endsWith('-')) model = model.substring(0, model.length - 1)

  const mp3 = await openai.audio.speech.create({
    model: model,
    voice: voice,
    input: prompt,
  });
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);
  res.send(fname)
}

async function transcriptionRequest(path, threadId, res, model, startingMessage) {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(path),
    model: model,
  });

  res.send({status: 'OK', content: transcription.text});
}

export default newRequest