interface AppsData {
  [key: string]: (...args: any[]) => Promise<void>;
}

let firstGeolocation = true;

export const appsData: AppsData = {
  weather: async (latitude?: number, longitude?: number) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        if (!latitude) latitude = position.coords.latitude;
        if (!longitude) longitude = position.coords.longitude;
        goWeather(latitude, longitude);
      });
    } else {
      if (firstGeolocation) {
        newMessage('box', "I'm going to need to know your location to get the weather so I hope you've enabled it.", { variation: 'alert' });
        firstGeolocation = false;
      }
      if (!navigator.geolocation) {
        newMessage('error', 'Geolocation is not supported by this browser.');
      }
      return;
    }

    async function goWeather(lat: number, lon: number) {
      const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      if (response.ok) {
        const weather = await response.json();
        newRequest('text', JSON.stringify(weather));
      } else {
        newMessage('box', 'Unable to get weather.', { variation: 'alert' });
      }
    }
  },

  openLink: async (links: string[]) => {
    links.forEach(async link => {
      window.open(link, '_blank');
      newMessage('app', `Opened "${link}".`, { appName: 'openLink' });
    });
  },

  createImage: async (prompt: string) => {
    newRequest('create-image', prompt);
  },

  transcribeAudio: async (audioFile: string) => {
    newRequest('transcribe-audio', audioFile);
  },

  liveImage: async (prompt?: string) => {
    const dialog = document.querySelector('.live-photo') as HTMLDialogElement;
    if (!dialog) return;

    const iframe = dialog.querySelector('iframe');
    if (!iframe) return;

    iframe.src = iframe.getAttribute('data-src') || '';
    iframe.removeAttribute('data-src');

    dialog.showModal();
  },

  showHTML: async (html: string) => {
    const preview = document.querySelector('.html-preview') as HTMLIFrameElement;
    if (!preview) return;

    preview.srcdoc = html;
  }
};

// Helper functions used by apps
function newMessage(role: string, content: string | object, moreParams: any = {}) {
  const messagesContainer = document.querySelector('.messages');
  if (!messagesContainer) return;

  const message = document.createElement('div');
  message.classList.add('message', role);

  switch (role) {
    case 'box':
      const variation = moreParams.variation || 'info';
      message.classList.add(variation);
      break;
    case 'app':
      if (moreParams.appName) {
        message.classList.add(moreParams.appName);
      }
      break;
  }

  if (role !== 'error' && role !== 'box') {
    const image = document.createElement('div');
    image.classList.add('image');
    message.appendChild(image);
  }

  const text = document.createElement('span');
  text.classList.add('text');

  const textSpan = document.createElement('span');
  textSpan.classList.add('text__span');
  textSpan.textContent = typeof content === 'string' ? content : JSON.stringify(content);
  text.appendChild(textSpan);

  message.appendChild(text);
  messagesContainer.appendChild(message);
}

function newRequest(type: string, content: string) {
  // This function will be implemented in the chat component
  const event = new CustomEvent('newRequest', {
    detail: { type, content }
  });
  window.dispatchEvent(event);
} 