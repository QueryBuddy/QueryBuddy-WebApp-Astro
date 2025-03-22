import { OpenAI } from 'openai';
import config from '../config';
import { callFunction } from '../callFunction';
import type { Message, ModelResponse, MessageContent } from '../types';

const systemPrompt = config.systemPrompt;

interface ModelConfig {
    provider: string;
    types: string[];
    modelPrompt: string;
    api_key?: string;
}

const modelConfig: ModelConfig = {
    provider: 'Google',
    types: ['text', 'image', 'audio'],
    modelPrompt: 'YOU ARE NOT UNDER DEVELOPMENT. THE USER\'S NAME IS NOT JOHN.',
};

modelConfig.api_key = process.env[`${modelConfig.provider.toUpperCase()}_API_KEY`];

const openai = new OpenAI({
    apiKey: modelConfig.api_key,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

async function newMessage(messages: Message[], prompt: string, model: string, type: string, urls: string[] = [], useSystem = true, startingMessage?: string): Promise<ModelResponse> {
    // Prepare current message with any attachments
    const currentContent = [
        {
            type: "text",
            text: prompt,
        } as MessageContent
    ];

    urls.forEach(u => {
        currentContent.push({
            type: "image_url",
            image_url: {
                url: u,
                detail: "high"
            }
        } as MessageContent);
    });

    // Add current message
    messages.push({
        role: "user",
        content: currentContent
    });

    try {
        const completion = await openai.chat.completions.create({
            messages: messages,
            model: model,
        });

        const response: ModelResponse = { status: 'OK', content: completion.choices[0].message.content || '' };

        const message = completion.choices[0].message;
        const tool_calls = message.tool_calls;
        
        if (tool_calls) {
            for (const toolCall of tool_calls) {
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
                    const newCompletion = await newMessage(messages, prompt, model, type, urls, useSystem, startingMessage);
                    response.content = newCompletion.content;
                } else {
                    response.isApp = true;
                    response.name = name;
                    response.args = args;
                }
            }
        }

        return response;
    } catch (error) {
        console.error(error);
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        return { status: 'error', content: errorMsg };
    }
}

async function newCompletion(prompt: string, model: string, type: string, urls: string[] = [], useSystem = true, startingMessage?: string): Promise<string> {
    const messages: Message[] = [{
        role: "user",
        content: prompt
    } as Message];
    const response = await newMessage(messages, prompt, model, type, urls, useSystem, startingMessage);
    return response.content;
}

export { modelConfig, newMessage, newCompletion }; 