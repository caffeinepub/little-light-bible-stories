import { useState, useCallback, useRef, useEffect } from 'react';

export function useSpeechNarration(text: string) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const clearProgressInterval = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const updateProgress = useCallback(() => {
    if (!utteranceRef.current || !isSupported) return;

    const synth = window.speechSynthesis;
    if (synth.speaking) {
      // Estimate progress based on time (rough approximation)
      const words = text.split(/\s+/).length;
      const estimatedDuration = words * 0.4; // ~0.4 seconds per word
      const elapsed = Date.now() - (utteranceRef.current as any).startTime;
      const newProgress = Math.min((elapsed / 1000 / estimatedDuration) * 100, 99);
      setProgress(newProgress);
    }
  }, [text, isSupported]);

  const play = useCallback(() => {
    if (!isSupported) return;

    const synth = window.speechSynthesis;

    if (synth.paused && utteranceRef.current) {
      synth.resume();
      setIsPlaying(true);
      return;
    }

    if (utteranceRef.current) {
      synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 1;

    (utterance as any).startTime = Date.now();

    utterance.onstart = () => {
      setIsPlaying(true);
      setProgress(0);
      clearProgressInterval();
      progressIntervalRef.current = window.setInterval(updateProgress, 100);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setProgress(100);
      clearProgressInterval();
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      clearProgressInterval();
    };

    utterance.onpause = () => {
      setIsPlaying(false);
      clearProgressInterval();
    };

    utteranceRef.current = utterance;
    synth.speak(utterance);
  }, [text, isSupported, clearProgressInterval, updateProgress]);

  const pause = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.pause();
    setIsPlaying(false);
    clearProgressInterval();
  }, [isSupported, clearProgressInterval]);

  const restart = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setProgress(0);
    setIsPlaying(false);
    clearProgressInterval();
    setTimeout(() => play(), 100);
  }, [isSupported, play, clearProgressInterval]);

  const reset = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setProgress(0);
    setIsPlaying(false);
    clearProgressInterval();
    utteranceRef.current = null;
  }, [isSupported, clearProgressInterval]);

  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
      clearProgressInterval();
    };
  }, [isSupported, clearProgressInterval]);

  return {
    isPlaying,
    isSupported,
    progress,
    play,
    pause,
    restart,
    reset,
  };
}
