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
  const [studentName] = useState(currentUser?.name || '');
  const [studentId] = useState(currentUser?.nim || '');
  const [pasteAttempts, setPasteAttempts] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const startTime = useRef<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  // Duration: 90 minutes
  const DURATION_SECONDS = 90 * 60;

  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime.current) / 1000);
      setElapsedTime(elapsed);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const remainingTime = Math.max(0, DURATION_SECONDS - elapsedTime);

  const formatCountdown = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatElapsed = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;

  const handleSubmit = () => {
    if (wordCount < 10) {
      alert('Jawaban terlalu pendek.');
      return;
    }
    setShowConfirm(true);
  };

  const confirmSubmit = () => {
    setIsSubmitting(true);
    const typingTime = Math.floor((Date.now() - startTime.current) / 1000);
    setTimeout(() => {
      onSubmit(answer, studentName, studentId, typingTime, pasteAttempts);
    }, 2000);
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-10 text-center max-w-md w-full">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Sedang Menyimpan & Menilai Jawaban...</h3>
          <p className="text-sm text-gray-500">Mohon tunggu, AI sedang menganalisis esai Anda.</p>
        </div>
      </div>
    );
  }

  // Start screen
  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-sm font-bold">U</span>
              </div>
              <div>
                <h1 className="text-sm font-semibold text-gray-800">Ujian Online</h1>
                <p className="text-xs text-gray-500">Sistem Penilaian Essay</p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Keluar
            </button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto py-12 px-4">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-8 py-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-medium">
                  {assignment.subject}
                </span>
              </div>
              <h2 className="text-xl font-bold mb-1">TUGAS ESSAY</h2>
              <p className="text-blue-100 text-sm">{assignment.title}</p>
            </div>

            {/* Info */}
            <div className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">Waktu Pengerjaan</div>
                  <div className="font-bold text-gray-800">90 Menit</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">Jumlah Soal</div>
                  <div className="font-bold text-gray-800">1 Essay</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">Nilai Maksimum</div>
                  <div className="font-bold text-gray-800">{assignment.maxScore}</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">Deadline</div>
                  <div className="font-bold text-gray-800 text-sm">
                    {new Date(assignment.dueDate).toLocaleDateString('id-ID')}
                  </div>
                </div>
              </div>

              {/* Student Info */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Data Peserta</h3>
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-500 w-32">Nama</td>
                      <td className="py-2 font-medium text-gray-800">: {currentUser?.name}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-500">NIM</td>
                      <td className="py-2 font-medium text-gray-800">: {currentUser?.nim}</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-500">Mata Kuliah</td>
                      <td className="py-2 font-medium text-gray-800">: {assignment.subject}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Instructions */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Petunjuk Pengerjaan
                </h4>
                <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
                  <li>Klik tombol <strong>"Mulai Mengerjakan"</strong> untuk memulai ujian.</li>
                  <li>Timer akan berjalan otomatis setelah ujian dimulai.</li>
                  <li>Jawaban <strong>harus diketik manual</strong> (copy-paste tidak diperbolehkan).</li>
                  <li>Pastikan jawaban sesuai dengan soal yang diberikan.</li>
                  <li>Klik <strong>"Kirim Jawaban"</strong> jika sudah selesai.</li>
                </ol>
              </div>

              <button
                onClick={() => {
                  setIsStarted(true);
                  startTime.current = Date.now();
                }}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Mulai Mengerjakan
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main exam view
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Bar - Exam Header */}
      <div className="bg-white border-b-2 border-blue-600 shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-sm font-bold">U</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-800">UJIAN ESSAY</h1>
              <p className="text-xs text-gray-500">{assignment.subject} - {currentUser?.name}</p>
            </div>
          </div>

          {/* Timer */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold text-lg ${
            remainingTime < 300 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-blue-50 text-blue-700'
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formatCountdown(remainingTime)}</span>
          </div>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Kirim Jawaban
          </button>
        </div>
      </div>

      {/* Exam Content */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Sidebar - Question Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-20">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-800 text-sm">Navigasi Soal</h3>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                </div>
                <div className="text-xs text-gray-500 space-y-1.5 border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
                    <span>Sedang Dikerjakan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                    <span>Sudah Dijawab</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-300 rounded-sm"></div>
                    <span>Belum Dikerjakan</span>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="p-4 border-t border-gray-200">
                <div className="text-xs text-gray-500 mb-2">Progress Pengerjaan</div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (wordCount / 300) * 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600">
                  {wordCount} kata telah ditulis
                </div>
              </div>

              {/* Time Info */}
              <div className="p-4 border-t border-gray-200">
                <div className="text-xs text-gray-500 mb-1">Waktu Berjalan</div>
                <div className="text-sm font-mono font-semibold text-gray-800">
                  {formatElapsed(elapsedTime)}
                </div>
                {pasteAttempts > 0 && (
                  <div className="mt-3 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                    ⚠️ {pasteAttempts}x percobaan paste terdeteksi
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Question Area */}
          <div className="lg:col-span-3">
            {/* Question Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">Soal Essay</h3>
                    <p className="text-xs text-gray-500">Nilai: {assignment.maxScore} poin</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                  {assignment.subject}
                </span>
              </div>

              <div className="p-6">
                <h4 className="font-bold text-gray-800 mb-3 text-lg">{assignment.title}</h4>
                <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-4">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {assignment.description}
                  </p>
                </div>

                {/* Rubric */}
                <div className="border-t border-gray-200 pt-4">
                  <h5 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                    Kriteria Penilaian
                  </h5>
                  <div className="grid grid-cols-2 gap-2">
                    {assignment.rubric.map((r, i) => (
                      <div key={i} className="flex items-center justify-between text-xs bg-gray-50 px-3 py-2 rounded border border-gray-100">
                        <span className="text-gray-600">{r.criteria}</span>
                        <span className="font-semibold text-gray-800">{r.maxScore}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Answer Area */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <h3 className="font-semibold text-gray-800 text-sm">Jawaban Anda</h3>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500">Status:</span>
                  <span className={`px-2 py-0.5 rounded font-medium ${
                    wordCount > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {wordCount > 0 ? 'Sedang Dikerjakan' : 'Belum Dijawab'}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <AntiPasteTextarea
                  value={answer}
                  onChange={setAnswer}
                  onPasteAttempt={() => setPasteAttempts((prev) => prev + 1)}
                  placeholder="Ketik jawaban essay Anda di sini..."
                />
              </div>

              {/* Bottom Bar */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  <span className="font-semibold text-gray-700">{wordCount}</span> kata •{' '}
                  <span className="font-semibold text-gray-700">{answer.length}</span> karakter
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={wordCount < 10}
                  className="px-6 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Kirim Jawaban
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">Konfirmasi Pengiriman</h3>
              <p className="text-sm text-gray-500 mt-1">Apakah Anda yakin ingin mengirim jawaban?</p>
            </div>
            <div className="p-6 space-y-2 text-sm">
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Nama:</span>
                <span className="font-semibold">{studentName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">NIM:</span>
                <span className="font-semibold">{studentId}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Jumlah Kata:</span>
                <span className="font-semibold">{wordCount}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Waktu Pengerjaan:</span>
                <span className="font-semibold">{formatElapsed(elapsedTime)}</span>
              </div>
              {pasteAttempts > 0 && (
                <div className="flex justify-between py-1.5 text-red-600">
                  <span>Percobaan Paste:</span>
                  <span className="font-semibold">{pasteAttempts}x</span>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200 flex gap-3 justify-end bg-gray-50">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={confirmSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded text-sm font-semibold hover:bg-green-700"
              >
                Ya, Kirim Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EssaySubmission;
