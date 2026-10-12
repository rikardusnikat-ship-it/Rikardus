import React from 'react';
import { GradingResult, Assignment, Submission } from '../types';

interface GradingResultViewProps {
  result: GradingResult;
  assignment: Assignment;
  submission: Submission;
  onBack: () => void;
}

const GradingResultView: React.FC<GradingResultViewProps> = ({
  result,
  assignment,
  submission,
  onBack,
}) => {
  const getGradeColor = (grade: string): string => {
    if (grade === 'A') return 'text-green-600 bg-green-50 border-green-200';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreColor = (score: number, max: number): string => {
    const ratio = score / max;
    if (ratio >= 0.8) return 'text-green-600';
    if (ratio >= 0.6) return 'text-blue-600';
    if (ratio >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number, max: number): string => {
    const ratio = score / max;
    if (ratio >= 0.8) return 'bg-green-500';
    if (ratio >= 0.6) return 'bg-blue-500';
    if (ratio >= 0.4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} menit ${secs} detik`;
  };

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

      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-indigo-200 text-sm mb-1">Hasil Penilaian AI</p>
            <h2 className="text-2xl font-bold mb-2">{assignment.title}</h2>
            <p className="text-indigo-200 text-sm">
              {submission.studentName} • {submission.studentId}
            </p>
          </div>
          <div className={`text-center px-6 py-3 rounded-xl border-2 ${getGradeColor(result.grade)} bg-white`}>
            <div className="text-3xl font-bold">{result.grade}</div>
            <div className="text-xs text-gray-500">Grade</div>
          </div>
        </div>
      </div>

      {/* Score Overview */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="text-4xl font-bold text-indigo-600">{result.totalScore}</div>
          <div className="text-sm text-gray-500 mt-1">dari {result.maxScore} poin</div>
          <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
              style={{ width: `${(result.totalScore / result.maxScore) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="text-4xl font-bold text-purple-600">{result.aiConfidence}%</div>
          <div className="text-sm text-gray-500 mt-1">Kepercayaan AI</div>
          <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-1000"
              style={{ width: `${result.aiConfidence}%` }}
            ></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className={`text-4xl font-bold ${result.integrityScore >= 70 ? 'text-green-600' : result.integrityScore >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
            {result.integrityScore}%
          </div>
          <div className="text-sm text-gray-500 mt-1">Skor Integritas</div>
          <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${result.integrityScore >= 70 ? 'bg-green-500' : result.integrityScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${result.integrityScore}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Criteria Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Rincian Penilaian per Kriteria</h3>
        <div className="space-y-4">
          {result.criteriaScores.map((cs, i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-700">{cs.criteria}</span>
                <span className={`font-bold ${getScoreColor(cs.score, cs.maxScore)}`}>
                  {cs.score}/{cs.maxScore}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${getProgressColor(cs.score, cs.maxScore)}`}
                  style={{ width: `${(cs.score / cs.maxScore) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">{cs.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Feedback */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">💬 Feedback AI</h3>
        <p className="text-gray-600 leading-relaxed bg-indigo-50 rounded-lg p-4 border border-indigo-100">
          {result.feedback}
        </p>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">✅ Kekuatan</h3>
          <ul className="space-y-2">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-green-500 mt-0.5">●</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 Area Perbaikan</h3>
          <ul className="space-y-2">
            {result.improvements.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-orange-500 mt-0.5">●</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Submission Details */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📝 Detail Pengumpulan</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-gray-800">{submission.wordCount}</div>
            <div className="text-xs text-gray-500">Kata</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-gray-800">{formatTime(submission.typingTime)}</div>
            <div className="text-xs text-gray-500">Waktu Ketik</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-gray-800">{submission.pasteAttempts}</div>
            <div className="text-xs text-gray-500">Percobaan Paste</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-gray-800">
              {new Date(submission.submittedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-xs text-gray-500">Waktu Submit</div>
          </div>
        </div>

        {/* Integrity Warning */}
        {submission.pasteAttempts > 0 && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-700 font-medium text-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Peringatan Integritas
            </div>
            <p className="text-sm text-red-600 mt-1">
              Terdeteksi {submission.pasteAttempts}x percobaan copy-paste selama pengerjaan. 
              Hal ini mempengaruhi skor integritas dan berpotensi mengurangi nilai akhir.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GradingResultView;
