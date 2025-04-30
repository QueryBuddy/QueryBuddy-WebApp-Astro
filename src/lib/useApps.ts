import { useState, useCallback } from 'react';

interface AppMessage {
  type: 'box' | 'error' | 'app';
  content: string;
  variation?: 'alert' | 'info';
  appName?: string;
  isApp?: boolean;
}

interface AppsData {
  weather: (latitude?: number, longitude?: number) => Promise<void>;
  openLink: (links: string[]) => Promise<void>;
  createImage: (prompt: string) => Promise<void>;
  transcribeAudio: (fileNames: string[]) => Promise<void>;
  liveImage: () => Promise<void>;
  takeLiveImage: () => Promise<void>;
  showHTML: (html: string) => Promise<void>;
  sendLiveImage: (json: { name: string; filelocation: string }) => Promise<void>;
}

export function useApps() {
  const [messages, setMessages] = useState<AppMessage[]>([]);
  const [isFirstGeolocation, setIsFirstGeolocation] = useState(true);

  const addMessage = useCallback((message: AppMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const apps: AppsData = {
    weather: async (latitude?: number, longitude?: number) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async position => {
          const lat = latitude ?? position.coords.latitude;
          const lon = longitude ?? position.coords.longitude;

          try {
            const response = await fetch(`/getWeather?lat=${lat}&lon=${lon}`);
            if (response.ok) {
              const weather = await response.json();
              addMessage({ type: 'app', content: JSON.stringify(weather), appName: 'weather', isApp: true });
            } else {
              addMessage({ type: 'box', content: 'Unable to get weather.', variation: 'alert' });
            }
          } catch (error) {
            addMessage({ type: 'error', content: 'Failed to fetch weather data.' });
          }
        });
      } else {
        if (isFirstGeolocation) {
          addMessage({
            type: 'box',
            content: "I'm going to need to know your location to get the weather so I hope you've enabled it.",
            variation: 'alert'
          });
          setIsFirstGeolocation(false);
        }
        addMessage({ type: 'error', content: 'Geolocation is not supported by this browser.' });
      }
    },

    openLink: async (links: string[]) => {
      links.forEach(link => {
        window.open(link, '_blank');
        addMessage({ type: 'app', content: `Opened "${link}".`, appName: 'openLink' });
      });
    },

    createImage: async (prompt: string) => {
      // Implementation for createImage
      addMessage({ type: 'app', content: 'Creating image...', appName: 'createImage' });
    },

    transcribeAudio: async (fileNames: string[]) => {
      // Implementation for transcribeAudio
      addMessage({ type: 'app', content: 'Transcribing audio...', appName: 'transcribeAudio' });
    },

    liveImage: async () => {
      // Implementation for liveImage
      addMessage({ type: 'app', content: 'Taking live image...', appName: 'liveImage' });
    },

    takeLiveImage: async () => {
      // Implementation for takeLiveImage
      addMessage({ type: 'app', content: 'Taking live image...', appName: 'takeLiveImage' });
    },

    showHTML: async (html: string) => {
      // Implementation for showHTML
      addMessage({ type: 'app', content: 'Showing HTML preview...', appName: 'showHTML' });
    },

    sendLiveImage: async (json: { name: string; filelocation: string }) => {
      // Implementation for sendLiveImage
      addMessage({ type: 'app', content: 'Sending live image...', appName: 'sendLiveImage' });
    }
  };

  return { apps, messages };
} 