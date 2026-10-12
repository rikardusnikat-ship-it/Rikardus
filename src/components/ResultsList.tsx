import React from 'react';
import { GradingResult, Assignment, Submission, User } from '../types';

interface ResultsListProps {
  results: GradingResult[];
  assignments: Assignment[];
  submissions: Submission[];
  currentUser?: User;
  onViewDetail: (result: GradingResult) => void;
  onBack: () => void;
}

const ResultsList: React.FC<ResultsListProps> = ({
  results,
  assignments,
  submissions,
  currentUser,
  onViewDetail,
  onBack,
}) => {
  const isLecturer = currentUser?.role === 'lecturer';

  const getGradeColor = (grade: string): string => {
    if (grade === 'A') return 'from-green-400 to-emerald-500';
    if (grade.startsWith('B')) return 'from-blue-400 to-indigo-500';
    if (grade.startsWith('C')) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  const getGradeBg = (grade: string): string => {
    if (grade === 'A') return 'bg-green-50 border-green-200';
    if (grade.startsWith('B')) return 'bg-blue-50 border-blue-200';
    if (grade.startsWith('C')) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  // Calculate stats
  const avgScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.totalScore, 0) / results.length)
    : 0;
  const highestScore = results.length > 0
    ? Math.max(...results.map((r) => r.totalScore))
    : 0;
  const lowestScore = results.length > 0
    ? Math.min(...results.map((r) => r.totalScore))
    : 0;

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors group"
      >
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-medium">Kembali</span>
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {isLecturer ? '📊 Semua Hasil Penilaian' : '📊 Hasil Penilaian Saya'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">{results.length} hasil penilaian</p>
        </div>
      </div>

      {/* Stats Summary */}
      {results.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center hover-lift">
            <div className="text-3xl font-black gradient-text">{avgScore}</div>
            <div className="text-xs text-gray-500 mt-1 font-medium">Rata-rata</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center hover-lift">
            <div className="text-3xl font-black text-green-600">{highestScore}</div>
            <div className="text-xs text-gray-500 mt-1 font-medium">Tertinggi</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center hover-lift">
            <div className="text-3xl font-black text-orange-600">{lowestScore}</div>
            <div className="text-xs text-gray-500 mt-1 font-medium">Terendah</div>
          </div>
        </div>
      )}

      {results.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-500 font-medium text-lg">
            {isLecturer ? 'Belum ada submission dari mahasiswa.' : 'Belum ada hasil penilaian.'}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            {isLecturer
              ? 'Mahasiswa belum mengumpulkan tugas.'
              : 'Kerjakan tugas untuk melihat hasil penilaian AI.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((result, index) => {
            const submission = submissions.find((s) => s.id === result.submissionId);
            const assignment = assignments.find((a) => a.id === submission?.assignmentId);
            if (!submission || !assignment) return null;

            return (
              <div
                key={result.submissionId}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 p-6 cursor-pointer group hover-lift animate-fadeInUp"
                onClick={() => onViewDetail(result)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold">
                        {assignment.subject}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getGradeColor(result.grade)} text-white`}>
                        Grade {result.grade}
                      </span>
                      {isLecturer && (
                        <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-medium border border-gray-100">
                          👨‍🎓 {submission.studentName}
                        </span>
                      )}
                      {submission.pasteAttempts > 0 && (
                        <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium border border-red-100">
                          ⚠️ {submission.pasteAttempts}x paste
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                      {assignment.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {isLecturer && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                          </svg>
                          NIM: {submission.studentId}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {submission.wordCount} kata
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(submission.submittedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${getGradeColor(result.grade)} shadow-lg mb-2`}>
                      <div className="text-center">
                        <div className="text-2xl font-black text-white">{result.totalScore}</div>
                        <div className="text-xs text-white/80 font-medium">/{result.maxScore}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      Integritas: {result.integrityScore}%
                    </div>
                    <div className="mt-2 flex justify-end">
                      <svg className="w-5 h-5 text-gray-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ResultsList;
