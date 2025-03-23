import fs from 'fs'
import path from 'path'

const userThreadsDir = './userThreads'

async function deleteThread(req, res) {
    const threadId = req.body.thread

    try {
        const filePath = path.join(userThreadsDir, `${threadId}.json`)
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
        res.json({ status: 'success', threadId })
    } catch (error) {
        res.status(404).json({ status: 'error', message: 'Thread not found' })
    }
}

export default deleteThread