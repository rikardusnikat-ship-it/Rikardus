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

  const getGradeBg = (grade: string): string => {
    if (grade === 'A') return 'bg-green-100 text-green-700 border-green-200';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  // Calculate stats
  const avgScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.totalScore, 0) / results.length)
    : 0;
  const highestScore = results.length > 0 ? Math.max(...results.map((r) => r.totalScore)) : 0;
  const lowestScore = results.length > 0 ? Math.min(...results.map((r) => r.totalScore)) : 0;

  return (
    <div className="max-w-5xl mx-auto animate-fadeIn">
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
          <p className="text-blue-100 text-xs mb-1">
            {isLecturer ? 'REKAPITULASI NILAI MAHASISWA' : 'REKAPITULASI NILAI UJIAN'}
          </p>
          <h2 className="text-xl font-bold">
            {isLecturer ? 'Semua Hasil Penilaian' : 'Hasil Ujian Saya'}
          </h2>
          <p className="text-blue-100 text-sm mt-1">{results.length} hasil penilaian</p>
        </div>

        {results.length > 0 && (
          <div className="p-5 grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Rata-rata</div>
              <div className="text-2xl font-bold text-blue-600">{avgScore}</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Tertinggi</div>
              <div className="text-2xl font-bold text-green-600">{highestScore}</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Terendah</div>
              <div className="text-2xl font-bold text-orange-600">{lowestScore}</div>
            </div>
          </div>
        )}
      </div>

      {/* Results Table */}
      {results.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-5xl mb-3">📭</div>
          <p className="text-gray-500 font-medium">
            {isLecturer ? 'Belum ada submission dari mahasiswa.' : 'Belum ada hasil penilaian.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase">
                  <th className="text-left px-4 py-3 font-medium">No</th>
                  {isLecturer && <th className="text-left px-4 py-3 font-medium">Mahasiswa</th>}
                  <th className="text-left px-4 py-3 font-medium">Judul Soal</th>
                  <th className="text-center px-4 py-3 font-medium">Nilai</th>
                  <th className="text-center px-4 py-3 font-medium">Grade</th>
                  <th className="text-center px-4 py-3 font-medium">Integritas</th>
                  <th className="text-center px-4 py-3 font-medium">Tanggal</th>
                  <th className="text-center px-4 py-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => {
                  const submission = submissions.find((s) => s.id === result.submissionId);
                  const assignment = assignments.find((a) => a.id === submission?.assignmentId);
                  if (!submission || !assignment) return null;

                  return (
                    <tr key={result.submissionId} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                      {isLecturer && (
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-gray-800">{submission.studentName}</div>
                          <div className="text-xs text-gray-500">{submission.studentId}</div>
                        </td>
                      )}
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-800 max-w-xs truncate">{assignment.title}</div>
                        <div className="text-xs text-gray-500">{assignment.subject}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-bold text-gray-800">
                          {result.totalScore}<span className="text-gray-400 font-normal">/{result.maxScore}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold border ${getGradeBg(result.grade)}`}>
                          {result.grade}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-sm font-semibold ${
                          result.integrityScore >= 70 ? 'text-green-600' :
                          result.integrityScore >= 40 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {result.integrityScore}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-gray-500">
                        {new Date(submission.submittedAt).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => onViewDetail(result)}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1 hover:bg-blue-50 rounded"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsList;
