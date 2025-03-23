import OpenAI from 'openai';
const openai = new OpenAI();

import config from '../config.js'
import appsConfig from '../appsConfig.js'

import { callFunction } from '../callFunction.js'

const FileObj = (...types) => ({ type: 'file', types });

var systemPrompt = config.systemPrompt

var modelConfig = {
    provider: 'OpenAI',
    types: ['text', FileObj('image', 'audio')],
}

async function runTools(tool_calls, completion, message, response, messages, prompt, model, type, urls, useSystem, startingMessage) {
    tool_calls.forEach(async toolCall => {
        const name = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);
        
        const result = await callFunction(name, args);
        messages.push(message);
        messages.push({
            role: "tool", 
            tool_call_id: toolCall.id,
            content: JSON.stringify(result.result)
        });

        if (result.callModel) {
            completion = newMessage(messages, prompt, model, type, urls, useSystem, startingMessage)
            response = {status: 'OK', content: completion.content}
        }
        else {
            response = {isApp: true, name: name, args: args}
        }
    });

    return await response
}

async function newMessage(messages, prompt, model, type, urls, useSystem=true, startingMessage) {
    // Prepare current message with any attachments
    var currentContent = [
        {
            "type": "text",
            "text": prompt,
        }
    ]

    urls.forEach(u => {
        currentContent.push({
            "type": "image_url",
            "image_url": {
                "url": u,
                "detail": "high"
            },
        })
    })

    // Add current message
    messages.push({
        role: "user",
        content: currentContent
    })

    var tools = []
    Object.keys(appsConfig.appsData).forEach(appName => {
        if (!appsConfig.appsData[appName].hostOnly) {
            tools.push({
                type: 'function',
                function: appsConfig.appsData[appName]
            })
        }
    })

    try {
        var completion = await openai.chat.completions.create({
            messages: messages,
            model: model,
            tools,
        });

        var content = completion.choices[0].message.content
        var response = {status: 'OK', content: content}

        var message = completion.choices[0].message

        var tool_calls = message.tool_calls
        if (tool_calls) {
            return await runTools(tool_calls, completion, message, response, messages, prompt, model, type, urls, useSystem, startingMessage)
        }
    
        return response
    } catch (error) {
        console.warn(error)
        const errorMsg = `Error: ${error.message}`
        return {status: 'error', content: errorMsg}
    }
}

async function newCompletion(prompt, model, type, urls, useSystem=true, startingMessage) {
    var messages = []
    if (systemPrompt && useSystem) {
        messages.push({"role": "system", "content": systemPrompt})
    }

    var cArr = [
        {
            "type": "text",
            "text": prompt,
        },
    ]

    urls.forEach(u => {
        cArr.push({
            "type": "image_url",
            "image_url": {
                "url": u,
            },
        })
    })

    messages.push({"role": "user", "content": cArr})

    const completion = await openai.chat.completions.create({
        messages: messages,
        model: model,
    });

    return completion.choices[0].message.content
}

export default { config: modelConfig, message: newMessage, completion: newCompletion }