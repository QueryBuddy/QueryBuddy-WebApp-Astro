import { useEffect, useRef, useState } from 'react';
import Layout from '../layouts/Layout.astro';
import '../styles/pages/chat.scss';
import '../styles/components/options.scss';
import '../styles/components/dialog.scss';

// Import external libraries
import { marked } from 'marked';
import TurndownService from 'turndown';

interface ChatProps {}

const Chat: React.FC<ChatProps> = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDictateEnabled, setIsDictateEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [selectedModel, setSelectedModel] = useState('');

  const messagesRef = useRef<HTMLDivElement>(null);
  const htmlPreviewRef = useRef<HTMLIFrameElement>(null);
  const uploadIframeRef = useRef<HTMLIFrameElement>(null);
  const livePhotoDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    // Load external scripts
    const markedScript = document.createElement('script');
    markedScript.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
    document.body.appendChild(markedScript);

    const turndownScript = document.createElement('script');
    turndownScript.src = 'https://unpkg.com/turndown/dist/turndown.js';
    document.body.appendChild(turndownScript);

    const appsScript = document.createElement('script');
    appsScript.src = '/apps.js';
    document.body.appendChild(appsScript);

    const chat2Script = document.createElement('script');
    chat2Script.src = '/chat2.js';
    document.body.appendChild(chat2Script);

    const chatScript = document.createElement('script');
    chatScript.src = '/chat.js';
    document.body.appendChild(chatScript);

    const languagesScript = document.createElement('script');
    languagesScript.src = '/languages.js';
    document.body.appendChild(languagesScript);

    return () => {
      // Cleanup scripts when component unmounts
      document.body.removeChild(markedScript);
      document.body.removeChild(turndownScript);
      document.body.removeChild(appsScript);
      document.body.removeChild(chat2Script);
      document.body.removeChild(chatScript);
      document.body.removeChild(languagesScript);
    };
  }, []);

  return (
    <>
      <main className="container">
        <section className="messages" ref={messagesRef} />
        <iframe 
          title="HTML Preview" 
          className="html-preview" 
          ref={htmlPreviewRef}
        />
      </main>
      
      <section className="toolbar-container">
        <div className="toolbar">
          <div className="upload-button">
            <input 
              title="Upload File" 
              id="upload" 
              type="checkbox" 
              className="upload-check"
              checked={isUploadOpen}
              onChange={(e) => setIsUploadOpen(e.target.checked)}
            />
            <div className="upload-iframe">
              <iframe 
                title="Upload File Here" 
                frameBorder="0" 
                src="/upload.html?hasParent=true"
                ref={uploadIframeRef}
              />
            </div>
            <label title="Upload File" htmlFor="upload" className="upload-icon" />
          </div>
          
          <textarea 
            className="input" 
            placeholder="Type a message..." 
            rows={1}
          />
          
          <div className="options">
            <input 
              title="Dictate" 
              className="dictate" 
              id="chkSpeak" 
              type="checkbox"
              checked={isDictateEnabled}
              onChange={(e) => setIsDictateEnabled(e.target.checked)}
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
              <option value="en-US">English (US)</option>
              <option value="fr-FR">French (FR)</option>
              <option value="ru-RU">Russian (RU)</option>
              <option value="pt-BR">Portuguese (BR)</option>
              <option value="es-ES">Spanish (ES)</option>
              <option value="de-DE">German (DE)</option>
              <option value="it-IT">Italian (IT)</option>
              <option value="pl-PL">Polish (PL)</option>
              <option value="nl-NL">Dutch (NL)</option>
            </select>
            
            <select 
              title="Select Model" 
              id="model"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              {/* Model options will be populated dynamically */}
            </select>
          </div>
          
          <button title="Send Message" className="send-btn" />
        </div>
      </section>

      <dialog className="dialog live-photo" ref={livePhotoDialogRef}>
        <iframe 
          title="Take Live Photo" 
          frameBorder="0" 
          data-src="/photo/take.html?mode=live-image"
        />
      </dialog>
    </>
  );
};

export default Chat; 