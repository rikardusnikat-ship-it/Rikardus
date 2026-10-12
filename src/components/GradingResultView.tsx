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
  const getScoreColor = (score: number, max: number): string => {
    const ratio = score / max;
    if (ratio >= 0.8) return 'text-green-600 bg-green-50';
    if (ratio >= 0.6) return 'text-blue-600 bg-blue-50';
    if (ratio >= 0.4) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
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
    <div className="max-w-4xl mx-auto animate-fadeIn">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors text-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Kembali
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-xs mb-1">HASIL PENILAIAN UJIAN</p>
              <h2 className="text-xl font-bold">{assignment.title}</h2>
              <p className="text-blue-100 text-sm mt-1">{assignment.subject}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black">{result.totalScore}</div>
              <div className="text-blue-100 text-sm">dari {result.maxScore} poin</div>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Grade</div>
            <div className={`text-2xl font-bold ${
              result.grade === 'A' ? 'text-green-600' :
              result.grade.startsWith('B') ? 'text-blue-600' :
              result.grade.startsWith('C') ? 'text-yellow-600' : 'text-red-600'
            }`}>{result.grade}</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Peserta</div>
            <div className="text-sm font-semibold text-gray-800">{submission.studentName}</div>
            <div className="text-xs text-gray-500">{submission.studentId}</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Waktu Pengerjaan</div>
            <div className="text-sm font-semibold text-gray-800">{formatTime(submission.typingTime)}</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Integritas</div>
            <div className={`text-2xl font-bold ${
              result.integrityScore >= 70 ? 'text-green-600' :
              result.integrityScore >= 40 ? 'text-yellow-600' : 'text-red-600'
            }`}>{result.integrityScore}%</div>
          </div>
        </div>
      </div>

      {/* Criteria Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 mb-4">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-bold text-gray-800">📊 Rincian Nilai per Kriteria</h3>
        </div>
        <div className="p-5">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 uppercase border-b border-gray-200">
                <th className="text-left pb-3 font-medium">Kriteria</th>
                <th className="text-center pb-3 font-medium">Nilai</th>
                <th className="text-center pb-3 font-medium">Progress</th>
                <th className="text-left pb-3 font-medium pl-4">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {result.criteriaScores.map((cs, i) => (
                <tr key={i} className="border-b border-gray-100 last:border-0">
                  <td className="py-3 text-sm font-medium text-gray-800">{cs.criteria}</td>
                  <td className="py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-sm font-bold ${getScoreColor(cs.score, cs.maxScore)}`}>
                      {cs.score}/{cs.maxScore}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden w-full min-w-[80px]">
                      <div
                        className={`h-full rounded-full ${getProgressColor(cs.score, cs.maxScore)}`}
                        style={{ width: `${(cs.score / cs.maxScore) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="py-3 text-xs text-gray-500 pl-4">{cs.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feedback */}
      <div className="bg-white rounded-xl border border-gray-200 mb-4">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-bold text-gray-800">💬 Feedback dari AI</h3>
        </div>
        <div className="p-5">
          <p className="text-sm text-gray-700 leading-relaxed bg-blue-50 border border-blue-100 rounded-lg p-4">
            {result.feedback}
          </p>
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200 bg-green-50">
            <h3 className="font-bold text-green-800 text-sm">✅ Kekuatan</h3>
          </div>
          <div className="p-4">
            <ul className="space-y-2">
              {result.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-500 mt-0.5">•</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200 bg-orange-50">
            <h3 className="font-bold text-orange-800 text-sm">📈 Area Perbaikan</h3>
          </div>
          <div className="p-4">
            <ul className="space-y-2">
              {result.improvements.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-orange-500 mt-0.5">•</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Submission Details */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-bold text-gray-800">📝 Detail Pengumpulan</h3>
        </div>
        <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-800">{submission.wordCount}</div>
            <div className="text-xs text-gray-500">Kata</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-800">{formatTime(submission.typingTime)}</div>
            <div className="text-xs text-gray-500">Waktu Ketik</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-800">{submission.pasteAttempts}</div>
            <div className="text-xs text-gray-500">Percobaan Paste</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-800">
              {new Date(submission.submittedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-xs text-gray-500">Waktu Submit</div>
          </div>
        </div>

        {submission.pasteAttempts > 0 && (
          <div className="mx-5 mb-5 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700 font-medium">⚠️ Peringatan Integritas</p>
            <p className="text-xs text-red-600 mt-1">
              Terdeteksi {submission.pasteAttempts}x percobaan copy-paste. Hal ini mempengaruhi skor integritas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GradingResultView;
