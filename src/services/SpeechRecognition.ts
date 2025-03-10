interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
}

interface SpeechRecognitionError extends Event {
  error: string;
  message: string;
}

class SpeechRecognitionService {
  private recognition: any;
  private isListening: boolean = false;
  private onResultCallback: ((words: string) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private SpeechRecognition: any;

  constructor() {
    this.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.initializeRecognition();
  }

  private initializeRecognition() {
    // Check if running in Safari
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      throw new Error('Speech Recognition is not supported in Safari. Please use Chrome or Edge for the best experience.');
    }

    if (!this.SpeechRecognition) {
      throw new Error('Speech Recognition is not supported in this browser. Please use Chrome or Edge.');
    }

    // Create a new instance
    this.recognition = new this.SpeechRecognition();
    this.setupRecognition();
  }

  private setupRecognition() {
    // Configure recognition settings
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      console.log('Speech recognition started');
      this.isListening = true;
    };

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      // Process all results
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;

        if (result.isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        console.log('Final transcript:', finalTranscript);
        if (this.onResultCallback) {
          this.onResultCallback(finalTranscript);
        }
      }
    };

    this.recognition.onerror = (event: SpeechRecognitionError) => {
      console.error('Speech recognition error:', event.error, event.message);

      // Only handle critical errors
      switch (event.error) {
        case 'not-allowed':
          this.isListening = false;
          if (this.onErrorCallback) {
            this.onErrorCallback('Microphone access was denied. Please allow microphone access and try again.');
          }
          break;
        case 'audio-capture':
          this.isListening = false;
          if (this.onErrorCallback) {
            this.onErrorCallback('No microphone was found. Please check your microphone settings.');
          }
          break;
        // Ignore non-critical errors
        case 'no-speech':
        case 'aborted':
        case 'network':
          return;
      }
    };

    this.recognition.onend = () => {
      console.log('Speech recognition ended');

      // Automatically restart if we're still supposed to be listening
      if (this.isListening) {
        console.log('Restarting speech recognition');
        setTimeout(() => {
          try {
            this.recognition.start();
          } catch (error) {
            console.error('Failed to restart recognition:', error);
            this.isListening = false;
          }
        }, 100);
      } else {
        this.isListening = false;
      }
    };
  }

  public reset() {
    if (this.recognition) {
      try {
        if (this.isListening) {
          this.recognition.abort();
        }
      } catch (error) {
        console.error('Error stopping recognition during reset:', error);
      }
    }

    // Create fresh instance
    this.recognition = new this.SpeechRecognition();
    this.setupRecognition();
  }

  public async start() {
    // If already listening, don't try to start again
    if (this.isListening) {
      console.log('Speech recognition is already running');
      return;
    }

    try {
      console.log('Starting speech recognition');
      await this.recognition.start();
    } catch (error) {
      if (error instanceof Error && error.message.includes('recognition has already started')) {
        // If recognition is already started, just update our state
        this.isListening = true;
        return;
      }

      console.error('Failed to start speech recognition:', error);
      this.isListening = false;
      if (this.onErrorCallback) {
        this.onErrorCallback(error instanceof Error ? error.message : 'Failed to start speech recognition. Please try again.');
      }
      throw error;
    }
  }

  public stop() {
    console.log('Stopping speech recognition service');

    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
    this.isListening = false;
  }

  public isRecognitionActive() {
    return this.isListening;
  }

  public onResult(callback: (words: string) => void) {
    this.onResultCallback = callback;
  }

  public onError(callback: (error: string) => void) {
    this.onErrorCallback = callback;
  }
}

export default SpeechRecognitionService;
