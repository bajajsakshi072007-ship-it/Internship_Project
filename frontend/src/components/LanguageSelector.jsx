import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
];

export default function LanguageSelector() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="relative inline-flex items-center gap-1.5 bg-amber-100/70 border border-amber-300/60 text-stone-800 text-xs font-semibold px-2.5 py-1.5 rounded-full hover:bg-amber-200/80 transition-colors shadow-sm cursor-pointer">
      <Globe className="w-3.5 h-3.5 text-terracotta-600 animate-pulse" />
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className="bg-transparent border-none outline-none text-xs font-bold text-stone-800 cursor-pointer pr-1"
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code} className="bg-amber-50 text-stone-900 font-medium">
            {l.native} ({l.name})
          </option>
        ))}
      </select>
    </div>
  );
}
