const IMAGES_PER_GROUP = 4;

interface RequestResponse {
    status?: string;
    message?: string;
    url?: string;
}

export function initCreate() {
    const imagesContainer = document.querySelector('.images') as HTMLElement;
    const input = document.querySelector('.input') as HTMLTextAreaElement;
    const sendButton = document.querySelector('.send-btn') as HTMLButtonElement;

    if (!imagesContainer || !input || !sendButton) {
        console.error('Required elements not found');
        return;
    }

    // Set grid properties
    imagesContainer.style.setProperty('--cols', IMAGES_PER_GROUP.toString());

    // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    const initialPrompt = params.get('prompt');
    const urls = params.get('urls');

    if (initialPrompt) {
        input.value = initialPrompt;
        sendMessages(initialPrompt, IMAGES_PER_GROUP, urls);
    }

    // Event listeners
    input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter' && input.value.trim()) {
            sendMessages(input.value, IMAGES_PER_GROUP, urls);
        }
    });

    sendButton.addEventListener('click', () => {
        if (input.value.trim()) {
            sendMessages(input.value, IMAGES_PER_GROUP, urls);
        }
    });

    let imageCount = 0;

    function sendMessages(prompt: string, amount: number, urls: string | null) {
        for (let i = 0; i < amount; i++) {
            sendRequest(prompt, urls);
        }
        input.value = '';
    }

    async function sendRequest(prompt: string, urls: string | null) {
        try {
            const response = await fetch(`/api/create-image?prompt=${encodeURIComponent(prompt)}${urls ? `&urls=${urls}` : ''}`);
            const data = await response.json();
            addMessage(data);
        } catch (error) {
            addMessage({
                status: 'Error',
                message: error instanceof Error ? error.message : 'Unknown error occurred'
            });
        }
    }

    function addMessage(response: RequestResponse) {
        const status = response.status || 'Error';
        const errorMessage = response.message || 'An unknown error occurred';
        const imageUrl = response.url || '';

        const message = document.createElement('a');
        message.className = 'image message';
        
        if (imageUrl) {
            message.href = `/viewImage?u=${btoa(imageUrl)}&p=${encodeURIComponent(input.value)}`;
            
            const img = document.createElement('img');
            img.className = 'img';
            img.src = imageUrl;
            img.alt = input.value;
            
            message.appendChild(img);
        } else {
            message.classList.add('error');
            message.textContent = errorMessage;
        }

        addToImageGroup(message);
    }

    function addToImageGroup(element: HTMLElement) {
        if (imageCount % IMAGES_PER_GROUP === 0) {
            const newGroup = document.createElement('div');
            newGroup.className = 'image-group';
            imagesContainer.prepend(newGroup);
        }

        const imageGroup = imagesContainer.querySelector('.image-group');
        if (imageGroup) {
            imageGroup.appendChild(element);
            imageCount++;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initCreate); 