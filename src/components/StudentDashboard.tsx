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
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-8 md:p-10 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <span className="text-2xl">👨‍🎓</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Halo, {user.name}!</h1>
              <p className="text-white/80 text-sm">NIM: {user.nim} • {user.department}</p>
            </div>
          </div>
          <p className="text-white/90 max-w-2xl text-sm md:text-base">
            Kerjakan tugas essay di bawah ini. Jawaban harus diketik manual — sistem akan menilai
            berdasarkan kedalaman analisis, struktur, dan orisinalitas.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm">
              📝 {pendingCount} Tugas Pending
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm">
              ✅ {completedCount} Dikumpulkan
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm">
              📊 Rata-rata: {avgScore}/100
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Cards */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Tugas Essay</h2>
          {myResults.length > 0 && (
            <button
              onClick={onViewResults}
              className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
            >
              📊 Lihat Nilai Saya
            </button>
          )}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assignments.map((assignment) => {
            const isSubmitted = mySubmissions.some((s) => s.assignmentId === assignment.id);
            const result = myResults.find(
              (r) => r.submissionId === mySubmissions.find((s) => s.assignmentId === assignment.id)?.id
            );

            return (
              <div
                key={assignment.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                      {assignment.subject}
                    </span>
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      {assignment.maxScore} poin
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                    {assignment.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-3 mb-4">
                    {assignment.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      📅 {new Date(assignment.dueDate).toLocaleDateString('id-ID')}
                    </span>
                    {isSubmitted ? (
                      <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                        ✓ Selesai
                        {result && (
                          <span className="ml-1">— {result.totalScore}/{result.maxScore}</span>
                        )}
                      </span>
                    ) : (
                      <button
                        onClick={() => onStartSubmit(assignment)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                      >
                        Kerjakan →
                      </button>
                    )}
                  </div>
                </div>
                <div className="border-t border-gray-100 bg-gray-50 px-6 py-3">
                  <div className="flex flex-wrap gap-1">
                    {assignment.rubric.map((r, i) => (
                      <span
                        key={i}
                        className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200"
                      >
                        {r.criteria}: {r.maxScore}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features Info */}
      <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
          🛡️ Ketentuan Pengerjaan
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-2">🚫</div>
            <h3 className="font-semibold text-gray-800 mb-1">Anti Copy-Paste</h3>
            <p className="text-sm text-gray-500">
              Jawaban harus diketik manual. Copy-paste akan terdeteksi dan mempengaruhi skor integritas.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🤖</div>
            <h3 className="font-semibold text-gray-800 mb-1">Penilaian Otomatis</h3>
            <p className="text-sm text-gray-500">
              Esai dinilai AI berdasarkan rubrik: analisis, struktur, contoh, orisinalitas, dan tata bahasa.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">⏱️</div>
            <h3 className="font-semibold text-gray-800 mb-1">Waktu Dipantau</h3>
            <p className="text-sm text-gray-500">
              Sistem mencatat waktu pengerjaan dan pola pengetikan untuk memastikan orisinalitas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
