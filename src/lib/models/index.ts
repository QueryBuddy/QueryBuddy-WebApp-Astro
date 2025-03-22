import * as gpt4oMini from './gpt-4o-mini';
import * as gemini2Flash from './_gemini-2.0-flash-lite';
import * as testModel from './_Test-Model';
import type { ModelResponse } from '../types';

interface ModelConfig {
    provider: string;
    types: string[];
    modelPrompt?: string;
    api_key?: string;
}

interface Model {
    config: ModelConfig;
    model: string;
    provider: {
        id: string;
        name: string;
    };
    actions: {
        message: typeof gpt4oMini.newMessage;
        completion: typeof gpt4oMini.newCompletion;
    };
}

const models: Record<string, Model> = {};

// Add GPT-4 Mini
models['gpt-4o-mini'] = {
    config: gpt4oMini.modelConfig,
    model: 'gpt-4o-mini',
    provider: {
        id: gpt4oMini.modelConfig.provider.toLowerCase(),
        name: gpt4oMini.modelConfig.provider
    },
    actions: {
        message: gpt4oMini.newMessage,
        completion: gpt4oMini.newCompletion
    }
};

// Add Gemini 2.0 Flash
models['_gemini-2.0-flash-lite'] = {
    config: gemini2Flash.modelConfig,
    model: '_gemini-2.0-flash-lite',
    provider: {
        id: gemini2Flash.modelConfig.provider.toLowerCase(),
        name: gemini2Flash.modelConfig.provider
    },
    actions: {
        message: gemini2Flash.newMessage,
        completion: gemini2Flash.newCompletion
    }
};

// Add Test Model
models['_Test-Model'] = {
    config: testModel.modelConfig,
    model: '_Test-Model',
    provider: {
        id: testModel.modelConfig.provider.toLowerCase(),
        name: testModel.modelConfig.provider
    },
    actions: {
        message: testModel.newMessage,
        completion: testModel.newCompletion
    }
};

export { models }; 