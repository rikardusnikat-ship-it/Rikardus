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
    if (grade === 'A') return 'bg-green-100 text-green-700';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-700';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
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
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Kembali ke Dashboard
      </button>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {isLecturer ? '📊 Semua Hasil Penilaian' : '📊 Hasil Penilaian Saya'}
        </h2>
        <span className="text-sm text-gray-500">{results.length} hasil</span>
      </div>

      {/* Stats Summary */}
      {results.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-xl font-bold text-indigo-600">{avgScore}</div>
            <div className="text-xs text-gray-500">Rata-rata</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-xl font-bold text-green-600">{highestScore}</div>
            <div className="text-xs text-gray-500">Tertinggi</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-xl font-bold text-orange-600">{lowestScore}</div>
            <div className="text-xs text-gray-500">Terendah</div>
          </div>
        </div>
      )}

      {results.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-gray-500">
            {isLecturer ? 'Belum ada submission dari mahasiswa.' : 'Belum ada hasil penilaian.'}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {isLecturer
              ? 'Mahasiswa belum mengumpulkan tugas.'
              : 'Kerjakan tugas untuk melihat hasil penilaian AI.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((result) => {
            const submission = submissions.find((s) => s.id === result.submissionId);
            const assignment = assignments.find((a) => a.id === submission?.assignmentId);
            if (!submission || !assignment) return null;

            return (
              <div
                key={result.submissionId}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-6 cursor-pointer group"
                onClick={() => onViewDetail(result)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                        {assignment.subject}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getGradeColor(result.grade)}`}>
                        Grade: {result.grade}
                      </span>
                      {isLecturer && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                          👨‍🎓 {submission.studentName}
                        </span>
                      )}
                      {submission.pasteAttempts > 0 && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs">
                          ⚠️ {submission.pasteAttempts}x paste
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">
                      {assignment.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      {isLecturer && (
                        <span>NIM: {submission.studentId}</span>
                      )}
                      <span>📝 {submission.wordCount} kata</span>
                      <span>📅 {new Date(submission.submittedAt).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <div className="text-2xl font-bold text-indigo-600">
                      {result.totalScore}
                      <span className="text-sm text-gray-400 font-normal">/{result.maxScore}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Integritas: {result.integrityScore}%
                    </div>
                    <div className="mt-2 flex justify-end">
                      <svg className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
