import fs from 'fs';
import path from 'path';
import type { Message } from '../types';

export const VALID_ROLES = {
    USER: 'user',
    ASSISTANT: 'assistant',
    SYSTEM: 'system',
    TOOL: 'tool'
} as const;

const THREADS_DIR = path.join(process.cwd(), 'threads');

// Ensure threads directory exists
if (!fs.existsSync(THREADS_DIR)) {
    fs.mkdirSync(THREADS_DIR, { recursive: true });
}

function getThreadFilePath(threadId: string): string {
    return path.join(THREADS_DIR, `${threadId}.json`);
}

export function getThreadMessages(threadId: string): Message[] {
    const filePath = getThreadFilePath(threadId);
    if (!fs.existsSync(filePath)) {
        return [];
    }

    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error(`Error reading thread ${threadId}:`, error);
        return [];
    }
}

export function addMessageToThread(threadId: string, message: Message): void {
    const filePath = getThreadFilePath(threadId);
    const messages = getThreadMessages(threadId);
    messages.push(message);

    try {
        fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));
    } catch (error) {
        console.error(`Error writing to thread ${threadId}:`, error);
        throw error;
    }
}

export function deleteThread(threadId: string): void {
    const filePath = getThreadFilePath(threadId);
    if (fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
        } catch (error) {
            console.error(`Error deleting thread ${threadId}:`, error);
            throw error;
        }
    }
}

export function listThreads(): string[] {
    try {
        return fs.readdirSync(THREADS_DIR)
            .filter(file => file.endsWith('.json'))
            .map(file => file.replace('.json', ''));
    } catch (error) {
        console.error('Error listing threads:', error);
        return [];
    }
} 