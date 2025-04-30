import { useEffect, useRef, useState } from 'react';
import '../styles/pages/chat.scss';
import '../styles/components/options.scss';
import '../styles/components/dialog.scss';

// Import external libraries
import { marked } from 'marked';
// import TurndownService from 'turndown';
import { getLanguageOptions } from '../lib/languages';
import { useApps } from '../lib/useApps';
import { useThreads } from '../lib/useThreads';

interface Message {
  role: 'user' | 'ai' | 'info' | 'warning' | 'app' | 'error';
  content: string;
  variation?: 'alert' | 'info' | 'warning';
  appName?: string;
  isApp?: boolean;
}

interface ChatProps {
  keepValue?: boolean;
  maxUses?: number;
  messageSpeed?: number;
}

// Add SpeechRecognition type
declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

const Chat: React.FC<ChatProps> = ({
  keepValue = false,
  maxUses = 10,
  messageSpeed = 1
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [useCount, setUseCount] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [selectedModel, setSelectedModel] = useState('');
  const [isDictateEnabled, setIsDictateEnabled] = useState(false);
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);

  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const speechRecognizerRef = useRef<SpeechRecognition | null>(null);
  const { apps, messages: appMessages } = useApps();
  const { threads, currentThread, createThread, deleteThread, setCurrentThread, isLoading: isThreadLoading } = useThreads();

  useEffect(() => {
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      speechRecognizerRef.current = new SpeechRecognition();
      speechRecognizerRef.current.lang = selectedLanguage;
      speechRecognizerRef.current.continuous = true;
      speechRecognizerRef.current.interimResults = true;

      speechRecognizerRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setInputValue(transcript);
      };
    }

    // Handle file uploads from URL parameters
    const params = new URLSearchParams(window.location.search);
    const fileLocation = params.get('filelocation');
    const names = params.get('name');
    const urls = params.get('url');

    if (names) {
      const nameArray = names.includes(',') ? names.split(',') : [names];
      setFileNames(nameArray);
    }

    if (urls) {
      const urlArray = urls.includes(',') ? urls.split(',') : [urls];
      setFileUrls(urlArray.map(url => decodeURIComponent(url)));
    }

    // Send welcome message
    sendWelcomeMessage();

    // Create initial thread if none exists
    if (threads.length === 0 && !currentThread) {
      createThread('New Conversation');
    }
  }, [threads.length, currentThread, createThread]);

  const sendWelcomeMessage = async () => {
    const welcomeMessage = `Welcome to QueryBuddy, where your images open the door to personalized, insightful responses tailored just for you.`;
    addMessage('ai', welcomeMessage);
  };

  const addMessage = (role: Message['role'], content: string, options?: Partial<Message>) => {
    setMessages(prev => [...prev, { role, content, ...options }]);
    setTimeout(() => {
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    }, 100);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || useCount >= maxUses) return;

    const prompt = inputValue.trim();
    addMessage('user', prompt);
    setUseCount(prev => prev + 1);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          model: selectedModel,
          urls: fileUrls,
          threadId: currentThread?.id,
        }),
      });

      const data = await response.json();
      addMessage('ai', data.response);
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage('ai', 'Sorry, there was an error processing your request.');
    }

    if (!keepValue) {
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDictateToggle = () => {
    if (speechRecognizerRef.current) {
      if (isDictateEnabled) {
        speechRecognizerRef.current.stop();
      } else {
        speechRecognizerRef.current.start();
      }
      setIsDictateEnabled(!isDictateEnabled);
    }
  };

  const languageOptions = getLanguageOptions();

  return (
    <div className="chat-container">
      <div className="thread-controls">
        <select
          value={currentThread?.id || ''}
          onChange={(e) => {
            const thread = threads.find(t => t.id === e.target.value);
            setCurrentThread(thread || null);
          }}
          disabled={isThreadLoading}
          title="Select Conversation Thread"
          aria-label="Select Conversation Thread"
        >
          <option value="">Select a thread</option>
          {threads.map(thread => (
            <option key={thread.id} value={thread.id}>
              {thread.title}
            </option>
          ))}
        </select>
        <button
          onClick={() => createThread('New Conversation')}
          disabled={isThreadLoading}
        >
          New Thread
        </button>
        {currentThread && (
          <button
            onClick={() => deleteThread(currentThread.id)}
            disabled={isThreadLoading}
          >
            Delete Thread
          </button>
        )}
      </div>

      <div className="messages" ref={messagesRef}>
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <div className="text__span" dangerouslySetInnerHTML={{ __html: message.content }} />
          </div>
        ))}
        {appMessages.map((message, index) => (
          <div key={`app-${index}`} className={`message ${message.type}`}>
            <div className="text__span" dangerouslySetInnerHTML={{ __html: message.content }} />
          </div>
        ))}
      </div>

      <div className="toolbar-container">
        <div className="toolbar">
          <div className="upload-button">
            <input
              type="checkbox"
              id="upload"
              className="upload-check"
              title="Upload File"
            />
            <div className="upload-iframe">
              <iframe
                title="Upload File Here"
                src="/upload.html?hasParent=true"
              />
            </div>
            <label htmlFor="upload" className="upload-icon" title="Upload File" />
          </div>

          <textarea
            ref={inputRef}
            className="input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            rows={1}
            title="Message Input"
            aria-label="Type your message here"
          />

          <div className="options">
            <input
              type="checkbox"
              id="chkSpeak"
              className="dictate"
              checked={isDictateEnabled}
              onChange={handleDictateToggle}
              title="Dictate Message"
            />
            <label htmlFor="chkSpeak" className="dictate" tabIndex={0} title="Dictate Message" />

            <select
              id="selLang"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              title="Select Language"
              aria-label="Select Language"
            >
              {languageOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              id="model"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              title="Select Model"
              aria-label="Select AI Model"
            >
              {/* Model options will be populated dynamically */}
            </select>
          </div>

          <button
            className="send-btn"
            onClick={handleSendMessage}
            disabled={useCount >= maxUses}
            title="Send Message"
            aria-label="Send Message"
          />
        </div>
      </div>
    </div>
  );
};

export default Chat; 