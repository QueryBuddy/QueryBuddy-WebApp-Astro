import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

import config from '../config.js'

// Ensure userThreads directory exists
const userThreadsDir = './userThreads'
if (!fs.existsSync(userThreadsDir)) {
    fs.mkdirSync(userThreadsDir)
}

async function createThread(req, res) {
    const threadId = uuidv4()

    // Create thread JSON file with messages array that includes roles


    // Prepare all messages for sending
    const messages = []
    
    // Add system message if needed
    if (config.systemPromptNoApps) {
        messages.push({
            role: 'system',
            content: config.systemPromptNoApps,
            timestamp: new Date().toISOString()
        })
    }
    
    if (config.firstMessage) {
        messages.push({
            role: 'system',
            content: config.firstMessage,
            timestamp: new Date().toISOString()
        })
    }
    
    const threadData = {
        id: threadId,
        messages: messages  // Each message will be {role: 'user'|'assistant', content: string}
    }

    // Save thread data to JSON file
    const filePath = path.join(userThreadsDir, `${threadId}.json`)
    fs.writeFileSync(filePath, JSON.stringify(threadData, null, 2))
    res.json({ id: threadId })
}

export default createThread