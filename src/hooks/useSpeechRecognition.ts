import { useEffect, useRef, useState, useCallback } from 'react';
import SpeechRecognitionService from '../services/SpeechRecognition';

interface UseSpeechRecognitionProps {
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
}

export function useSpeechRecognition({ onResult, onError }: UseSpeechRecognitionProps = {}) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const serviceRef = useRef<SpeechRecognitionService | null>(null);

  // Initialize the service
  useEffect(() => {
    try {
      serviceRef.current = new SpeechRecognitionService();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize speech recognition');
    }

    // Cleanup on unmount
    return () => {
      if (serviceRef.current) {
        serviceRef.current.stop();
        serviceRef.current = null;
      }
    };
  }, []);

  const handleError = useCallback((err: string) => {
    setError(err);
    setIsListening(false);
    onError?.(err);
  }, [onError]);

  const startListening = useCallback(async () => {
    try {
      if (!serviceRef.current) {
        serviceRef.current = new SpeechRecognitionService();
      }

      // Set up callbacks
      serviceRef.current.onResult((transcript) => {
        onResult?.(transcript);
      });

      serviceRef.current.onError((err) => {
        handleError(err);
      });

      await serviceRef.current.start();
      setIsListening(true);
      setError(null);
    } catch (err) {
      handleError(err instanceof Error ? err.message : 'Failed to start speech recognition');
    }
  }, [onResult, handleError]);

  const stopListening = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.stop();
      setIsListening(false);
    }
  }, []);

  return {
    isListening,
    error,
    startListening,
    stopListening
  };
}
