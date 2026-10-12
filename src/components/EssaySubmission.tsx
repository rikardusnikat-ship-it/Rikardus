import React, { useState, useRef, useEffect } from 'react';
import { Assignment } from '../types';
import AntiPasteTextarea from './AntiPasteTextarea';

interface EssaySubmissionProps {
  assignment: Assignment;
  onSubmit: (answer: string, studentName: string, studentId: string, typingTime: number, pasteAttempts: number) => void;
  onBack: () => void;
}

const EssaySubmission: React.FC<EssaySubmissionProps> = ({ assignment, onSubmit, onBack }) => {
  const [answer, setAnswer] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [pasteAttempts, setPasteAttempts] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const startTime = useRef<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;
  const minWords = 300;
  const maxWords = 600;

  const handleSubmit = () => {
    if (!studentName.trim() || !studentId.trim()) {
      alert('Mohon isi nama dan NIM/NPM Anda.');
      return;
    }
    if (wordCount < 50) {
      alert('Jawaban terlalu pendek. Minimal tulis 50 kata.');
      return;
    }
    setShowConfirm(true);
  };

  const confirmSubmit = () => {
    setIsSubmitting(true);
    const typingTime = Math.floor((Date.now() - startTime.current) / 1000);
    setTimeout(() => {
      onSubmit(answer, studentName, studentId, typingTime, pasteAttempts);
    }, 2500);
  };

  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-indigo-200 rounded-full animate-spin border-t-indigo-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
        </div>
        <h3 className="mt-6 text-xl font-semibold text-gray-800">AI Sedang Menilai Esai Anda...</h3>
        <p className="mt-2 text-gray-500 text-sm">Menganalisis kedalaman, struktur, dan orisinalitas jawaban</p>
        <div className="mt-4 flex gap-2">
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Kembali ke Dashboard
      </button>

      {/* Assignment Info */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
            {assignment.subject}
          </span>
          <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
            Max: {assignment.maxScore} poin
          </span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">{assignment.title}</h2>
        <p className="text-gray-600 leading-relaxed">{assignment.description}</p>

        {/* Rubric */}
        <div className="mt-4 border-t border-gray-100 pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">📋 Rubrik Penilaian:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {assignment.rubric.map((r, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-sm text-gray-600">{r.criteria}</span>
                <span className="text-sm font-medium text-indigo-600">{r.maxScore} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Info */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">👤 Data Mahasiswa</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NIM / NPM</label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Masukkan NIM/NPM"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Essay Answer */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">✍️ Jawaban Esai</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">⏱️ {formatTime(elapsedTime)}</span>
            {pasteAttempts > 0 && (
              <span className="text-sm text-red-500 font-medium">
                ⚠️ {pasteAttempts}x percobaan paste
              </span>
            )}
          </div>
        </div>

        <AntiPasteTextarea
          value={answer}
          onChange={setAnswer}
          onPasteAttempt={() => setPasteAttempts((prev) => prev + 1)}
          placeholder="Ketik jawaban esai Anda di sini... (Minimal 300 kata, Maksimal 600 kata)"
        />

        {/* Word Count Indicator */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  wordCount < minWords
                    ? 'bg-orange-400'
                    : wordCount > maxWords
                    ? 'bg-red-400'
                    : 'bg-green-400'
                }`}
                style={{ width: `${Math.min(100, (wordCount / maxWords) * 100)}%` }}
              ></div>
            </div>
            <span className={`text-sm ${wordCount >= minWords && wordCount <= maxWords ? 'text-green-600' : 'text-orange-600'}`}>
              {wordCount} / {minWords}-{maxWords} kata
            </span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={wordCount < 50 || !studentName.trim() || !studentId.trim()}
          className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300"
        >
          📤 Kumpulkan Jawaban
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Konfirmasi Pengumpulan</h3>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p>👤 <strong>Nama:</strong> {studentName}</p>
              <p>🆔 <strong>NIM:</strong> {studentId}</p>
              <p>📝 <strong>Jumlah Kata:</strong> {wordCount}</p>
              <p>⏱️ <strong>Waktu Pengerjaan:</strong> {formatTime(elapsedTime)}</p>
              <p>⚠️ <strong>Percobaan Paste:</strong> {pasteAttempts}x</p>
            </div>
            {pasteAttempts > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-700">
                ⚠️ Terdeteksi {pasteAttempts}x percobaan copy-paste. Hal ini akan mempengaruhi
                skor integritas jawaban Anda.
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Batal
              </button>
              <button
                onClick={confirmSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                Ya, Kumpulkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EssaySubmission;
