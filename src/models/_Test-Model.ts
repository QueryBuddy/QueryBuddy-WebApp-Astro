import OpenAI from 'openai';
const openai = new OpenAI();

import config from '../config.js'

const FileObj = (...types) => ({ type: 'file', types });

var systemPrompt = config.systemPrompt

var modelConfig = {
    provider: 'QueryBuddy',
    types: ['text', FileObj('image', 'audio')],
}

async function newMessage(threadId, prompt, model, type, urls, useSystem=true, startingMessage) {
    return `Test response, thanks!`
}

async function newCompletion(threadId, prompt, model, type, urls, useSystem=true, startingMessage) {
    return `Test completion response, thanks!`
}

async function createThread() {
    return 1234567890
}

async function deleteThread(id) {
    return `Sample delete response for ${id}`
}

export default { config: modelConfig, message: newMessage, completion: newCompletion, thread: { create: createThread, delete: deleteThread } }