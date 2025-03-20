import { useState, useRef, useEffect } from 'react';
import type { FC } from 'react';
import { appsData } from '../lib/apps';

const languages = [
    { code: 'en-US', label: 'English (US)' },
    { code: 'fr-FR', label: 'French (FR)' },
    { code: 'ru-RU', label: 'Russian (RU)' },
    { code: 'pt-BR', label: 'Portuguese (BR)' },
    { code: 'es-ES', label: 'Spanish (ES)' },
    { code: 'de-DE', label: 'German (DE)' },
    { code: 'it-IT', label: 'Italian (IT)' },
    { code: 'pl-PL', label: 'Polish (PL)' },
    { code: 'nl-NL', label: 'Dutch (NL)' }
];

interface Message {
    role: string;
    content: string;
    isApp?: boolean;
    appName?: string;
}

const ChatComponent: FC = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isDictating, setIsDictating] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('en-US');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [message]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const handleNewRequest = (event: CustomEvent<{ type: string; content: string }>) => {
            const { type, content } = event.detail;
            handleRequest(type, content);
        };

        window.addEventListener('newRequest', handleNewRequest as EventListener);
        return () => {
            window.removeEventListener('newRequest', handleNewRequest as EventListener);
        };
    }, []);

    const handleRequest = async (type: string, content: string) => {
        try {
            let response;
            switch (type) {
                case 'text':
                    addMessage('user', content);
                    break;
                case 'create-image':
                    response = await fetch('/api/create-image', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ prompt: content })
                    });
                    if (response.ok) {
                        const data = await response.json();
                        addMessage('app', `Generated image: ${data.url}`, { appName: 'createImage' });
                    }
                    break;
                case 'transcribe-audio':
                    // Handle audio transcription
                    break;
                default:
                    console.warn('Unknown request type:', type);
            }
        } catch (error: unknown) {
            console.error('Error handling request:', error);
            addMessage('error', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const addMessage = (role: string, content: string, params: any = {}) => {
        setMessages(prev => [...prev, { role, content, ...params }]);
    };

    const handleSend = async () => {
        if (!message.trim()) return;

        try {
            // Check if the message is a JSON app call
            if (message.includes('"isApp": true')) {
                try {
                    const appCall = JSON.parse(message);
                    if (appCall.isApp && appCall.appName && appsData[appCall.appName]) {
                        await appsData[appCall.appName](...(appCall.args || []));
                    }
                } catch (e) {
                    console.error('Error parsing app call:', e);
                }
            }

            addMessage('user', message);
            setMessage('');

            // Send message to AI endpoint
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, language: selectedLanguage })
            });

            if (response.ok) {
                const data = await response.json();
                addMessage('ai', data.message);
            } else {
                throw new Error('Failed to get AI response');
            }
        } catch (error: unknown) {
            console.error('Error sending message:', error);
            addMessage('error', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const toggleDictation = () => {
        setIsDictating(!isDictating);
        // Speech recognition will be handled by the languages.ts script
    };

    const handleUpload = () => {
        // File upload is handled by the upload iframe
    };

    return (
        <div className="chat-component">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}${msg.appName ? ` ${msg.appName}` : ''}`}>
                        <div className="image" />
                        <span className="text">
                            <span className="text__span">{msg.content}</span>
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="toolbar">
                <div className="upload-button">
                    <input
                        title="Upload File"
                        id="upload"
                        type="checkbox"
                        className="upload-check"
                        onChange={handleUpload}
                    />
                    <div className="upload-iframe">
                        <iframe 
                            title="Upload File Here" 
                            frameBorder="0" 
                            src="/upload?hasParent=true"
                            style={{ display: 'none' }}
                        />
                    </div>
                    <label title="Upload File" htmlFor="upload" className="upload-icon" />
                </div>
                
                <textarea
                    ref={textareaRef}
                    className="input"
                    placeholder="Type a message..."
                    rows={1}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                />
                
                <div className="options">
                    <input
                        title="Dictate"
                        className="dictate"
                        id="chkSpeak"
                        type="checkbox"
                        checked={isDictating}
                        onChange={toggleDictation}
                    />
                    <label
                        tabIndex={0}
                        className="dictate"
                        htmlFor="chkSpeak"
                    />
                    
                    <select
                        title="Set Language"
                        id="selLang"
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                    >
                        {languages.map(({ code, label }) => (
                            <option key={code} value={code}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>
                
                <button
                    title="Send Message"
                    className="send-btn"
                    onClick={handleSend}
                />
            </div>
        </div>
    );
};

export default ChatComponent; 