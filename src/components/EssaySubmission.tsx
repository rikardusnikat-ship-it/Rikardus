import React, { useState, useRef, useEffect } from 'react';
import { Assignment, User } from '../types';
import AntiPasteTextarea from './AntiPasteTextarea';

interface EssaySubmissionProps {
  assignment: Assignment;
  currentUser?: User;
  onSubmit: (answer: string, studentName: string, studentId: string, typingTime: number, pasteAttempts: number) => void;
  onBack: () => void;
}

const EssaySubmission: React.FC<EssaySubmissionProps> = ({ assignment, currentUser, onSubmit, onBack }) => {
  const [answer, setAnswer] = useState('');
  const [studentName, setStudentName] = useState(currentUser?.name || '');
  const [studentId, setStudentId] = useState(currentUser?.nim || '');
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
      <div className="min-h-[500px] flex flex-col items-center justify-center animate-fadeIn">
        <div className="relative mb-8">
          <div className="w-24 h-24 border-4 border-indigo-100 rounded-full animate-spin border-t-indigo-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-3xl">🤖</span>
            </div>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">AI Sedang Menilai Esai Anda...</h3>
        <p className="text-gray-500 text-center max-w-md">
          Menganalisis kedalaman analisis, struktur penulisan, penggunaan contoh, orisinalitas, dan tata bahasa.
        </p>
        <div className="mt-6 flex gap-2">
          <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2.5 h-2.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors group"
      >
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-medium">Kembali</span>
      </button>

      {/* Assignment Info Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 animate-fadeInUp">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200/50 flex-shrink-0">
            <span className="text-xl">📝</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold">
                {assignment.subject}
              </span>
              <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-medium">
                Max: {assignment.maxScore} poin
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">{assignment.title}</h2>
            <p className="text-gray-600 leading-relaxed text-sm">{assignment.description}</p>
          </div>
        </div>

        {/* Rubric */}
        <div className="mt-5 pt-5 border-t border-gray-100">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span>📋</span> Rubrik Penilaian
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {assignment.rubric.map((r, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100">
                <span className="text-sm text-gray-600">{r.criteria}</span>
                <span className="text-sm font-bold text-indigo-600">{r.maxScore}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 animate-fadeInUp animation-delay-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-xl">👤</span> Data Mahasiswa
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">NIM / NPM</label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Masukkan NIM/NPM"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-sm"
            />
          </div>
        </div>
      </div>

      {/* Essay Answer */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 animate-fadeInUp animation-delay-300">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="text-xl">✍️</span> Jawaban Esai
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-mono text-gray-600">{formatTime(elapsedTime)}</span>
            </div>
            {pasteAttempts > 0 && (
              <div className="flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-red-600">{pasteAttempts}x</span>
              </div>
            )}
          </div>
        </div>

        <AntiPasteTextarea
          value={answer}
          onChange={setAnswer}
          onPasteAttempt={() => setPasteAttempts((prev) => prev + 1)}
          placeholder="Ketik jawaban esai Anda di sini... (Minimal 300 kata, Maksimal 600 kata)"
        />

        {/* Word Count Progress */}
        <div className="mt-5 pt-5 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Progress kata</span>
            <span className={`text-sm font-semibold ${wordCount >= minWords && wordCount <= maxWords ? 'text-green-600' : 'text-orange-600'}`}>
              {wordCount} / {minWords}-{maxWords} kata
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                wordCount < minWords
                  ? 'bg-gradient-to-r from-orange-400 to-yellow-400'
                  : wordCount > maxWords
                  ? 'bg-gradient-to-r from-red-400 to-pink-400'
                  : 'bg-gradient-to-r from-green-400 to-emerald-400'
              }`}
              style={{ width: `${Math.min(100, (wordCount / maxWords) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end animate-fadeInUp animation-delay-500">
        <button
          onClick={handleSubmit}
          disabled={wordCount < 50 || !studentName.trim() || !studentId.trim()}
          className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-indigo-200/50 hover:shadow-2xl hover:shadow-indigo-300/50 flex items-center gap-2 btn-shine"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Kumpulkan Jawaban
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-scaleIn">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📤</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Konfirmasi Pengumpulan</h3>
              <p className="text-sm text-gray-500 mt-1">Pastikan data sudah benar</p>
            </div>
            
            <div className="space-y-3 bg-gray-50 rounded-xl p-4 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Nama:</span>
                <span className="font-semibold text-gray-800">{studentName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">NIM:</span>
                <span className="font-semibold text-gray-800">{studentId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Jumlah Kata:</span>
                <span className="font-semibold text-gray-800">{wordCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Waktu Pengerjaan:</span>
                <span className="font-semibold text-gray-800">{formatTime(elapsedTime)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Percobaan Paste:</span>
                <span className={`font-semibold ${pasteAttempts > 0 ? 'text-red-600' : 'text-gray-800'}`}>
                  {pasteAttempts}x
                </span>
              </div>
            </div>

            {pasteAttempts > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
                <p className="text-sm text-red-700">
                  ⚠️ Terdeteksi {pasteAttempts}x percobaan copy-paste. Hal ini akan mempengaruhi skor integritas jawaban Anda.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Batal
              </button>
              <button
                onClick={confirmSubmit}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all text-sm font-semibold shadow-lg shadow-indigo-200/50"
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
