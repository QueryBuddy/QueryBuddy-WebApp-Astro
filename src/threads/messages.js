import fs from 'fs'
import path from 'path'

const userThreadsDir = './userThreads'

// Valid roles for messages
const VALID_ROLES = {
    USER: 'user',
    ASSISTANT: 'assistant',
    SYSTEM: 'system'
}

// Read messages from a thread file
function getThreadMessages(threadId) {
    try {
        const filePath = path.join(userThreadsDir, `${threadId}.json`)
        const threadData = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        return threadData.messages || []
    } catch (error) {
        console.error('Error reading thread:', error)
        return []
    }
}

// Add a new message to a thread file
function addMessageToThread(threadId, message) {
    try {
        const filePath = path.join(userThreadsDir, `${threadId}.json`)
        const threadData = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        
        // Ensure message has a valid role
        if (!message.role || !Object.values(VALID_ROLES).includes(message.role)) {
            throw new Error('Invalid message role')
        }

        threadData.messages.push({
            role: message.role,
            content: (message.content === null ? '' : message.content) ?? '',
            timestamp: new Date().toISOString()
        })
        
        fs.writeFileSync(filePath, JSON.stringify(threadData, null, 2))
        return true
    } catch (error) {
        console.error('Error adding message:', error)
        return false
    }
}

export { getThreadMessages, addMessageToThread, VALID_ROLES } 