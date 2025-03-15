import config from '../config';
import type { Message, ModelResponse } from '../types';

const systemPrompt = config.systemPrompt;

interface ModelConfig {
  provider: string;
  types: string[];
}

const modelConfig: ModelConfig = {
  provider: 'QueryBuddy',
  types: ['text', 'image', 'audio'],
};

async function newMessage(messages: Message[], prompt: string, model: string, type: string, urls: string[] = [], useSystem = true, startingMessage?: string): Promise<ModelResponse> {
  return {
    status: 'OK',
    content: 'Test response, thanks!'
  };
}

async function newCompletion(prompt: string, model: string, type: string, urls: string[] = [], useSystem = true, startingMessage?: string): Promise<string> {
  return 'Test completion response, thanks!';
}

export { modelConfig, newMessage, newCompletion };