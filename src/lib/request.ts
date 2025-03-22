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

import { appsData } from './appsConfig.js';

function isJSON(text: String) {
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

async function newRequest({ model, threadId, prompt, type, urls, voice, startingMessage }: { model: string; threadId: string; prompt: string; type: string; urls?: string[]; voice?: string; startingMessage?: string }) {
    if (!urls) urls = []

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${api_key}`,
    };

    switch (type) {
        case 'create-image': 
            model = `dall-e-${3}`
            return await imageRequest({ headers, threadId, prompt, model, startingMessage })
        case 'create-audio':
            model = `tts-${1}-hd`
            return await audioRequest({ threadId, prompt, voice: voice ?? 'defaultVoice', model, startingMessage })
        case 'transcribe-audio': 
            var path = `/temp/${prompt}`
            model = `whisper-${1}`
            return await transcriptionRequest({ path, threadId, model, startingMessage })
        default:
            if (!model) model = config.defaultModel ?? Object.keys(models).find(m => !m.startsWith('_'))
            return await textRequest({ threadId, prompt, model, type, urls, startingMessage })
    }
}

async function textRequest({ threadId, prompt, model, type, urls, startingMessage }: { threadId: string; prompt: string; model: string; type: string; urls?: string[]; startingMessage?: string }) {
    var modelObj = models[model]

    if (type === 'live-image-send') type = 'image'

    if (!modelObj) {
        console.dir({model, modelObj, message: 'Model not found'})
        return new Response(JSON.stringify({status: 'Error', content: `Model ${model} not found`}), {
            headers: { 'Content-Type': 'application/json' }
        })
    }
    
    if (startingMessage) {
        var sOutput = await (await modelObj.actions).completion(prompt, model, type, urls, true, startingMessage)
        return new Response(JSON.stringify({status: 'OK', content: sOutput}), {
            headers: { 'Content-Type': 'application/json' }
        })
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
        addMessageToThread(threadId, {
            role: VALID_ROLES.ASSISTANT,
            content: output.content
        })
    }

    return new Response(JSON.stringify(output), {
        headers: { 'Content-Type': 'application/json' }
    })
}

async function imageRequest({ headers, threadId, prompt, model, startingMessage }: { headers: Record<string, string>; threadId: string; prompt: string; model: string; startingMessage?: string }) {
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
        return new Response(JSON.stringify({content: body.error.message, status: 'Error'}), {
            headers: { 'Content-Type': 'application/json' }
        })
    }

    const url = body.data[0].url;
    const status = url.includes('://') ? 'Success' : 'Error'
    
    return new Response(JSON.stringify({status, content: url}), {
        headers: { 'Content-Type': 'application/json' }
    })
}

async function audioRequest({ threadId, prompt, voice, model, startingMessage }: { threadId: string; prompt: string; voice: string; model: string; startingMessage?: string }) {
    var fname = './speech.mp3'
    const speechFile = path.resolve(fname);

    if (model.endsWith('-')) model = model.substring(0, model.length - 1)

    const mp3 = await openai.audio.speech.create({
        model: model,
        voice: voice as "alloy" | "ash" | "coral" | "echo" | "fable" | "onyx" | "nova" | "sage" | "shimmer",
        input: prompt,
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);
    
    return new Response(JSON.stringify({status: 'OK', content: fname}), {
        headers: { 'Content-Type': 'application/json' }
    })
}

async function transcriptionRequest({ path, threadId, model, startingMessage }: { path: string; threadId: string; model: string; startingMessage?: string }) {
    const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(path),
        model: model,
    });

    return new Response(JSON.stringify({status: 'OK', content: transcription.text}), {
        headers: { 'Content-Type': 'application/json' }
    })
}

export { newRequest }