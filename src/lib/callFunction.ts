import type { FunctionResult } from './types';
import config from './config';

interface FunctionArgs {
    [key: string]: any;
}

export async function callFunction(name: string, args: FunctionArgs): Promise<FunctionResult> {
    // Get the app configuration
    const app = config.appsList.find(a => a === name);
    if (!app) {
        return {
            result: `Function ${name} not found`,
            callModel: false
        };
    }

    try {
        // Call the API endpoint for the function
        const response = await fetch(`/api/apps/${name}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(args)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return {
            result,
            callModel: false
        };
    } catch (error) {
        console.error(`Error calling function ${name}:`, error);
        return {
            result: error instanceof Error ? error.message : 'Unknown error',
            callModel: false
        };
    }
} 