import React, { useState, useEffect, useRef } from 'react';
import { Upload, Play, Square, Volume2, BookOpen } from 'lucide-react';

function App() {
  const [text, setText] = useState<string>('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const synth = window.speechSynthesis;
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      setSelectedVoice(availableVoices[0]);
    };

    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setText(e.target?.result as string);
    };
    reader.readAsText(file);
  };

  const handlePlay = () => {
    if (isPlaying) return;
    
    if (text && selectedVoice) {
      utteranceRef.current = new SpeechSynthesisUtterance(text);
      utteranceRef.current.voice = selectedVoice;
      utteranceRef.current.onend = () => setIsPlaying(false);
      synth.speak(utteranceRef.current);
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    synth.cancel();
    setIsPlaying(false);
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat p-4"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 68, 129, 0.85), rgba(0, 68, 129, 0.95)), url("https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80")',
      }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 space-y-6">
          <div className="text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-[#004481]" />
            <h1 className="text-3xl font-bold text-[#004481] mb-2">Lector de documentos</h1>
            <p className="text-[#666]">Sube un documento de texto para que te lo lea</p>
          </div>

          <div className="space-y-4">
            {/* File Upload */}
            <div className="relative">
              <input
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center px-4 py-3 border-2 border-[#004481] rounded-lg cursor-pointer hover:bg-[#004481]/5 transition-colors w-full"
              >
                <Upload className="w-5 h-5 mr-2 text-[#004481]" />
                <span className="text-[#004481] font-medium">Choose text file</span>
              </label>
            </div>

            {/* Voice Selection */}
            <div>
              <label className="block text-sm font-medium text-[#004481] mb-1">
                Select Voice
              </label>
              <div className="relative">
                <select
                  value={selectedVoice?.name || ''}
                  onChange={(e) => {
                    const voice = voices.find(v => v.name === e.target.value);
                    setSelectedVoice(voice || null);
                  }}
                  className="block w-full rounded-lg border-2 border-[#004481] py-2 px-3 focus:ring-2 focus:ring-[#004481]/20 focus:outline-none"
                >
                  {voices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
                <Volume2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#004481] pointer-events-none" />
              </div>
            </div>

            {/* Text Preview */}
            {text && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-[#004481] mb-1">
                  Documento
                </label>
                <div className="p-4 bg-[#f4f4f4] rounded-lg max-h-48 overflow-y-auto border-2 border-[#004481]/10">
                  <p className="text-[#333] whitespace-pre-wrap">{text}</p>
                </div>
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex gap-4 justify-center mt-6">
              <button
                onClick={handlePlay}
                disabled={!text || isPlaying}
                className={`flex items-center px-8 py-3 rounded-lg ${
                  !text || isPlaying
                    ? 'bg-gray-200 cursor-not-allowed'
                    : 'bg-[#004481] hover:bg-[#043263]'
                } text-white transition-colors font-medium`}
              >
                <Play className="w-5 h-5 mr-2" />
                Leer
              </button>
              <button
                onClick={handleStop}
                disabled={!isPlaying}
                className={`flex items-center px-8 py-3 rounded-lg ${
                  !isPlaying
                    ? 'bg-gray-200 cursor-not-allowed'
                    : 'bg-[#dc3545] hover:bg-[#bb2d3b]'
                } text-white transition-colors font-medium`}
              >
                <Square className="w-5 h-5 mr-2" />
                Parar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;