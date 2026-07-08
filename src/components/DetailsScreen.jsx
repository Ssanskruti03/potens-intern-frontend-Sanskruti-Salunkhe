import React, { useState, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function DetailsScreen({ report, onUpdate }) {
  const { t } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Handle text input changes
  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    setCharacterCount(text.length);
    onUpdate({ description: text });
  };

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onUpdate({ photo: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Start voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onload = () => {
          onUpdate({ voiceNote: reader.result });
        };
        reader.readAsDataURL(audioBlob);
        
        // Stop all microphone tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert('Microphone access denied or not available');
    }
  };

  // Stop voice recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#2C2C2C]">{t('detailsTitle')}</h2>
        <p className="text-[#6B6B6B] text-sm mt-1">{t('detailsSubtitle')}</p>
      </div>

      {/* Description text area */}
      <div className="mb-4">
        <label className="label-text">{t('descriptionLabel')}</label>
        <textarea
          value={report.description || ''}
          onChange={handleDescriptionChange}
          maxLength={500}
          rows={4}
          className="input-field resize-none"
          placeholder={t('descriptionPlaceholder')}
        />
        <p className="text-xs text-[#6B6B6B] mt-1 text-right">
          {t('characterCount', { current: characterCount, max: 500 })}
        </p>
      </div>

      {/* Photo upload */}
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoUpload}
          className="hidden"
          id="photo-input"
        />
        <label
          htmlFor="photo-input"
          className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-dashed border-secondary-dark/50 hover:border-primary/50 cursor-pointer transition-all"
        >
          <span className="text-2xl">📷</span>
          <span className="text-sm font-medium text-[#2C2C2C]">
            {report.photo ? '✅ Photo Added' : t('addPhoto')}
          </span>
        </label>
      </div>

      {/* Voice recording */}
      <div>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`
            flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl transition-all
            ${isRecording 
              ? 'bg-red-100 border-2 border-red-400 text-red-700 animate-pulse' 
              : 'bg-primary/10 border-2 border-primary/30 hover:bg-primary/20 text-primary'
            }
          `}
        >
          <span className="text-2xl">{isRecording ? '🔴' : '🎤'}</span>
          <span className="font-medium">
            {isRecording ? t('recording') : t('addVoice')}
          </span>
        </button>
        {report.voiceNote && (
          <div className="mt-2 text-xs text-[#6B6B6B] text-center">
            ✅ Voice note recorded
          </div>
        )}
      </div>
    </div>
  );
}