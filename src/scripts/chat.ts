import { Marked } from 'marked';
import TurndownService from 'turndown';

const marked = new Marked();
const turndownService = new TurndownService();

export function initChat() {
  const messagesContainer = document.querySelector('.messages') as HTMLElement;
  const htmlPreview = document.querySelector('.html-preview') as HTMLIFrameElement;
  const input = document.querySelector('.input') as HTMLTextAreaElement;
  const sendButton = document.querySelector('.send-btn') as HTMLButtonElement;

  if (!messagesContainer || !htmlPreview || !input || !sendButton) {
    console.error('Required elements not found');
    return;
  }

  // Initialize HTML preview
  const previewDoc = htmlPreview.contentDocument || htmlPreview.contentWindow?.document;
  if (previewDoc) {
    previewDoc.body.innerHTML = '<div class="preview"></div>';
  }

  // Handle message sending
  function sendMessage() {
    const message = input.value.trim();
    if (!message) return;

    // Add message to messages container
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.innerHTML = marked.parse(message) as string;
    messagesContainer.appendChild(messageElement);

    // Update preview
    if (previewDoc) {
      const previewContent = previewDoc.querySelector('.preview');
      if (previewContent) {
        previewContent.innerHTML = marked.parse(message) as string;
      }
    }

    // Clear input
    input.value = '';
    input.style.height = 'auto';
  }

  // Event listeners
  sendButton.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Handle file uploads
  const uploadCheck = document.querySelector('.upload-check') as HTMLInputElement;
  const uploadIframe = document.querySelector('.upload-iframe iframe') as HTMLIFrameElement;

  if (uploadCheck && uploadIframe) {
    uploadCheck.addEventListener('change', () => {
      if (uploadCheck.checked) {
        uploadIframe.style.display = 'block';
      }
    });

    window.addEventListener('message', (event) => {
      if (event.data.type === 'upload-complete') {
        uploadCheck.checked = false;
        uploadIframe.style.display = 'none';
        
        // Add image to message
        const imageUrl = event.data.url;
        const imageMarkdown = `![](${imageUrl})`;
        input.value += imageMarkdown;
      }
    });
  }
} 