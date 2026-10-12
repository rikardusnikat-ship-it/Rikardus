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
    if (grade === 'A') return 'from-green-400 to-emerald-500';
    if (grade.startsWith('B')) return 'from-blue-400 to-indigo-500';
    if (grade.startsWith('C')) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
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
    if (ratio >= 0.8) return 'from-green-400 to-emerald-500';
    if (ratio >= 0.6) return 'from-blue-400 to-indigo-500';
    if (ratio >= 0.4) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} menit ${secs} detik`;
  };

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

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-8 text-white mb-6 animate-fadeInUp">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="relative z-10 flex items-start justify-between gap-6">
          <div className="flex-1">
            <p className="text-white/60 text-sm mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Hasil Penilaian AI
            </p>
            <h2 className="text-2xl font-bold mb-3">{assignment.title}</h2>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-sm">👨‍🎓</span>
              </div>
              <div>
                <p className="font-medium text-sm">{submission.studentName}</p>
                <p className="text-white/60 text-xs">{submission.studentId}</p>
              </div>
            </div>
          </div>
          <div className={`flex-shrink-0 text-center px-8 py-4 rounded-2xl bg-gradient-to-br ${getGradeColor(result.grade)} shadow-2xl`}>
            <div className="text-4xl font-black text-white">{result.grade}</div>
            <div className="text-xs text-white/80 font-medium mt-1">Grade</div>
          </div>
        </div>
      </div>

      {/* Score Overview */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover-lift animate-fadeInUp animation-delay-200">
          <div className="text-4xl font-black gradient-text">{result.totalScore}</div>
          <div className="text-sm text-gray-500 mt-1">dari {result.maxScore} poin</div>
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
              style={{ width: `${(result.totalScore / result.maxScore) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover-lift animate-fadeInUp animation-delay-300">
          <div className="text-4xl font-black gradient-text-gold">{result.aiConfidence}%</div>
          <div className="text-sm text-gray-500 mt-1">Kepercayaan AI</div>
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-orange-500 rounded-full transition-all duration-1000"
              style={{ width: `${result.aiConfidence}%` }}
            ></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover-lift animate-fadeInUp animation-delay-500">
          <div className={`text-4xl font-black ${result.integrityScore >= 70 ? 'text-green-600' : result.integrityScore >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
            {result.integrityScore}%
          </div>
          <div className="text-sm text-gray-500 mt-1">Skor Integritas</div>
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                result.integrityScore >= 70 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                result.integrityScore >= 40 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                'bg-gradient-to-r from-red-400 to-pink-500'
              }`}
              style={{ width: `${result.integrityScore}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Criteria Breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 animate-fadeInUp">
        <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
          <span className="text-xl">📊</span> Rincian Penilaian per Kriteria
        </h3>
        <div className="space-y-4">
          {result.criteriaScores.map((cs, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-700">{cs.criteria}</span>
                <span className={`font-bold text-lg ${getScoreColor(cs.score, cs.maxScore)}`}>
                  {cs.score}<span className="text-sm text-gray-400 font-normal">/{cs.maxScore}</span>
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(cs.score, cs.maxScore)} transition-all duration-700`}
                  style={{ width: `${(cs.score / cs.maxScore) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">{cs.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Feedback */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 animate-fadeInUp">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-xl">💬</span> Feedback AI
        </h3>
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100">
          <p className="text-gray-700 leading-relaxed">{result.feedback}</p>
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-fadeInUp">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-xl">✅</span> Kekuatan
          </h3>
          <ul className="space-y-3">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-fadeInUp">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-xl">📈</span> Area Perbaikan
          </h3>
          <ul className="space-y-3">
            {result.improvements.map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Submission Details */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-fadeInUp">
        <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
          <span className="text-xl">📝</span> Detail Pengumpulan
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Kata', value: submission.wordCount, icon: '📝' },
            { label: 'Waktu Ketik', value: formatTime(submission.typingTime), icon: '⏱️' },
            { label: 'Percobaan Paste', value: submission.pasteAttempts, icon: '📋' },
            { label: 'Waktu Submit', value: new Date(submission.submittedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }), icon: '🕐' },
          ].map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
              <div className="text-xl mb-1">{item.icon}</div>
              <div className="text-lg font-bold text-gray-800">{item.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Integrity Warning */}
        {submission.pasteAttempts > 0 && (
          <div className="mt-5 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-red-700 font-semibold text-sm mb-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Peringatan Integritas
            </div>
            <p className="text-sm text-red-600">
              Terdeteksi {submission.pasteAttempts}x percobaan copy-paste. Hal ini mempengaruhi skor integritas dan berpotensi mengurangi nilai akhir.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GradingResultView;
