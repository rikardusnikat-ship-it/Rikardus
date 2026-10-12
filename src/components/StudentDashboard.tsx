import React from 'react';
import { Assignment, Submission, GradingResult, User } from '../types';

interface StudentDashboardProps {
  user: User;
  assignments: Assignment[];
  submissions: Submission[];
  results: GradingResult[];
  onStartSubmit: (assignment: Assignment) => void;
  onViewResults: () => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  assignments,
  submissions,
  results,
  onStartSubmit,
  onViewResults,
}) => {
  const mySubmissions = submissions.filter((s) => s.studentId === user.nim);
  const myResults = results.filter((r) =>
    mySubmissions.some((s) => s.id === r.submissionId)
  );
  const avgScore = myResults.length > 0
    ? Math.round(myResults.reduce((sum, r) => sum + r.totalScore, 0) / myResults.length)
    : 0;
  const completedCount = mySubmissions.length;
  const pendingCount = assignments.length - completedCount;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-blue-600">{user.name.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Selamat Datang, {user.name}</h1>
              <p className="text-sm text-gray-500">NIM: {user.nim} • {user.department}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-center px-4 py-2 bg-blue-50 rounded-lg border border-blue-100">
              <div className="text-lg font-bold text-blue-700">{pendingCount}</div>
              <div className="text-xs text-blue-600">Belum Dikerjakan</div>
            </div>
            <div className="text-center px-4 py-2 bg-green-50 rounded-lg border border-green-100">
              <div className="text-lg font-bold text-green-700">{completedCount}</div>
              <div className="text-xs text-green-600">Selesai</div>
            </div>
            <div className="text-center px-4 py-2 bg-purple-50 rounded-lg border border-purple-100">
              <div className="text-lg font-bold text-purple-700">{avgScore}</div>
              <div className="text-xs text-purple-600">Rata-rata</div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">Informasi Ujian Online</p>
          <p className="text-blue-700">
            Setiap soal memiliki waktu pengerjaan <strong>90 menit</strong>. Jawaban harus diketik manual (copy-paste tidak diperbolehkan). 
            Pastikan Anda berada di tempat yang tenang sebelum memulai ujian.
          </p>
        </div>
      </div>

      {/* Assignment List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Daftar Soal Ujian</h2>
          {myResults.length > 0 && (
            <button
              onClick={onViewResults}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Lihat Hasil Nilai
            </button>
          )}
        </div>

        <div className="space-y-3">
          {assignments.map((assignment, index) => {
            const isSubmitted = mySubmissions.some((s) => s.assignmentId === assignment.id);
            const result = myResults.find(
              (r) => r.submissionId === mySubmissions.find((s) => s.assignmentId === assignment.id)?.id
            );

            return (
              <div
                key={assignment.id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                        Soal #{index + 1}
                      </span>
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                        {assignment.subject}
                      </span>
                      <span className="text-xs text-gray-400">
                        ⏱️ 90 menit
                      </span>
                      <span className="text-xs text-gray-400">
                        📅 {new Date(assignment.dueDate).toLocaleDateString('id-ID')}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-800 mb-1">{assignment.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{assignment.description}</p>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>⭐ Nilai Maks: {assignment.maxScore}</span>
                      <span>📋 {assignment.rubric.length} kriteria penilaian</span>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {isSubmitted ? (
                      <div className="text-center">
                        {result && (
                          <div className={`inline-block px-3 py-1.5 rounded-lg text-sm font-bold mb-1 ${
                            result.grade === 'A' ? 'bg-green-100 text-green-700' :
                            result.grade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                            result.grade.startsWith('C') ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {result.grade} ({result.totalScore})
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Selesai
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => onStartSubmit(assignment)}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Kerjakan
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rules */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Tata Tertib Ujian
        </h3>
        <ol className="text-sm text-gray-600 space-y-1.5 list-decimal list-inside">
          <li>Waktu pengerjaan setiap soal adalah <strong>90 menit</strong>.</li>
          <li>Jawaban <strong>harus diketik manual</strong>, copy-paste dari sumber manapun tidak diperbolehkan.</li>
          <li>Sistem akan mendeteksi aktivitas copy-paste dan mempengaruhi skor integritas.</li>
          <li>Pastikan koneksi internet stabil selama ujian berlangsung.</li>
          <li>Jawaban yang telah dikirim <strong>tidak dapat diubah</strong>.</li>
          <li>Penilaian dilakukan secara otomatis oleh sistem AI berdasarkan rubrik yang telah ditentukan.</li>
        </ol>
      </div>
    </div>
  );
};

export default StudentDashboard;
