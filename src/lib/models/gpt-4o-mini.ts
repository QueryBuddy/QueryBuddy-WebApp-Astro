import { OpenAI } from 'openai';
import config from '../config';
import { callFunction } from '../callFunction';
import type { Message, MessageContent } from '../types';

const systemPrompt = config.systemPrompt;

interface ModelConfig {
  provider: string;
  types: string[];
}

const modelConfig: ModelConfig = {
  provider: 'OpenAI',
  types: ['text', 'image', 'audio'],
};

async function runTools(tool_calls: any[], completion: any, message: any, response: any, messages: Message[], prompt: string, model: string, type: string, urls: string[], useSystem: boolean, startingMessage?: string) {
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
      completion = await newMessage(messages, prompt, model, type, urls, useSystem, startingMessage);
      response = { status: 'OK', content: completion.content };
    } else {
      response = { isApp: true, name: name, args: args };
    }
  }

  return response;
}

async function newMessage(messages: Message[], prompt: string, model: string, type: string, urls: string[] = [], useSystem = true, startingMessage?: string) {
  const openai = new OpenAI();

  // Prepare current message with any attachments
  const currentContent = [
    {
      type: "text",
      text: prompt
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

    const response = { status: 'OK', content: completion.choices[0].message.content };

    const message = completion.choices[0].message;
    const tool_calls = message.tool_calls;
    
    if (tool_calls) {
      return await runTools(tool_calls, completion, message, response, messages, prompt, model, type, urls, useSystem, startingMessage);
    }

    return response;
  } catch (error) {
    console.error(error);
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return { status: 'error', content: errorMsg };
  }
}

async function newCompletion(prompt: string, model: string, type: string, urls: string[] = [], useSystem = true, startingMessage?: string) {
  const messages: Message[] = [{
    role: "user",
    content: prompt
  } as Message];
  const response = await newMessage(messages, prompt, model, type, urls, useSystem, startingMessage);
  return response.content;
}

export { modelConfig, newMessage, newCompletion }; 