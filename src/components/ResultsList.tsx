import React from 'react';
import { GradingResult, Assignment, Submission } from '../types';

interface ResultsListProps {
  results: GradingResult[];
  assignments: Assignment[];
  submissions: Submission[];
  onViewDetail: (result: GradingResult) => void;
  onBack: () => void;
}

const ResultsList: React.FC<ResultsListProps> = ({
  results,
  assignments,
  submissions,
  onViewDetail,
  onBack,
}) => {
  const getGradeColor = (grade: string): string => {
    if (grade === 'A') return 'bg-green-100 text-green-700';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-700';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

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

      <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Hasil Penilaian</h2>

      {results.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-gray-500">Belum ada hasil penilaian.</p>
          <p className="text-sm text-gray-400 mt-1">Kerjakan tugas untuk melihat hasil penilaian AI.</p>
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
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-6 cursor-pointer"
                onClick={() => onViewDetail(result)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                        {assignment.subject}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getGradeColor(result.grade)}`}>
                        Grade: {result.grade}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1">{assignment.title}</h3>
                    <p className="text-sm text-gray-500">
                      {submission.studentName} • {submission.studentId}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-600">
                      {result.totalScore}
                      <span className="text-sm text-gray-400 font-normal">/{result.maxScore}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Integritas: {result.integrityScore}%
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
