/// <reference path="../types/speech-recognition.d.ts" />

interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    onresult: (event: any) => void;
    onerror: (event: any) => void;
    onend: () => void;
}

declare var SpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
};

declare var webkitSpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
};

let recognition: SpeechRecognition | null = null;

export function initSpeechRecognition() {
    const dictateCheck = document.querySelector('.dictate-check') as HTMLInputElement;
    const input = document.querySelector('.input') as HTMLTextAreaElement;
    const langSelect = document.querySelector('#selLang') as HTMLSelectElement;

    if (!input || !dictateCheck || !langSelect) {
        console.error('Required elements not found');
        return;
    }

    // Initialize speech recognition
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
        console.error('Speech recognition not supported');
        return;
    }

    recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = langSelect.value;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
        const result = event.results[event.results.length - 1];
        const transcript = result[0].transcript;
        
        if (result.isFinal) {
            input.value += transcript + ' ';
        }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        dictateCheck.checked = false;
    };

    recognition.onend = () => {
        if (dictateCheck.checked && recognition) {
            recognition.start();
        }
    };

    // Handle dictation checkbox
    dictateCheck.addEventListener('change', () => {
        if (!recognition) return;
        
        if (dictateCheck.checked) {
            recognition.start();
        } else {
            recognition.stop();
        }
    });
} 