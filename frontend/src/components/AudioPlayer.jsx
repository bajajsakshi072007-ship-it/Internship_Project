import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AudioPlayer({ text, title = "Artisan's Voice Story" }) {
  const { t, lang } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech audio story is not supported in this browser.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel(); // clear previous
      const utterance = new SpeechSynthesisUtterance(text);

      // Match speech voice language if available
      const langCodes = { hi: 'hi-IN', bn: 'bn-IN', ta: 'ta-IN', te: 'te-IN', mr: 'mr-IN', gu: 'gu-IN', en: 'en-IN' };
      utterance.lang = langCodes[lang] || 'en-IN';
      utterance.rate = 0.95;

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <button
      onClick={handleToggleAudio}
      type="button"
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium text-xs transition-all duration-300 shadow-sm ${
        isPlaying
          ? 'bg-terracotta-600 text-white ring-2 ring-terracotta-400 animate-pulse'
          : 'bg-amber-100/90 hover:bg-amber-200 text-amber-900 border border-amber-300/80'
      }`}
      title={title}
    >
      {isPlaying ? (
        <>
          <VolumeX className="w-4 h-4 text-white" />
          <span>{t('stopStory')}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-terracotta-600" />
          <span>{t('listenStory')}</span>
          <Sparkles className="w-3 h-3 text-amber-600" />
        </>
      )}
    </button>
  );
}
