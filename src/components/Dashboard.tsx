import React from 'react';
import { Assignment, Submission, GradingResult } from '../types';

interface DashboardProps {
  assignments: Assignment[];
  submissions: Submission[];
  results: GradingResult[];
  onStartSubmit: (assignment: Assignment) => void;
  onViewResults: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  assignments,
  submissions,
  results,
  onStartSubmit,
  onViewResults,
}) => {
  const totalSubmissions = submissions.length;
  const avgScore =
    results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + r.totalScore, 0) / results.length)
      : 0;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-8 md:p-12 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            🎓 AI Essay Grader
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl">
            Sistem penilaian tugas esai berbasis kecerdasan buatan. Tulis jawaban Anda secara
            original — sistem akan menilai berdasarkan kedalaman analisis, struktur, dan
            orisinalitas.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm">
              📝 {assignments.length} Tugas Tersedia
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm">
              ✅ {totalSubmissions} Tugas Dikumpulkan
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
          <h2 className="text-2xl font-bold text-gray-800">Tugas Essay Tersedia</h2>
          {results.length > 0 && (
            <button
              onClick={onViewResults}
              className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
            >
              📊 Lihat Semua Hasil
            </button>
          )}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assignments.map((assignment) => {
            const isSubmitted = submissions.some((s) => s.assignmentId === assignment.id);
            const result = results.find(
              (r) => r.submissionId === submissions.find((s) => s.assignmentId === assignment.id)?.id
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
                      📅 Deadline: {new Date(assignment.dueDate).toLocaleDateString('id-ID')}
                    </span>
                    {isSubmitted ? (
                      <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                        ✓ Sudah Dikumpulkan
                        {result && (
                          <span className="ml-1">
                            — Nilai: {result.totalScore}/{result.maxScore}
                          </span>
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
                {/* Rubric Preview */}
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

      {/* Features Section */}
      <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
          🛡️ Fitur Keamanan & Penilaian
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-2">🚫</div>
            <h3 className="font-semibold text-gray-800 mb-1">Anti Copy-Paste</h3>
            <p className="text-sm text-gray-500">
              Sistem mendeteksi dan memblokir aktivitas copy-paste untuk menjaga orisinalitas
              jawaban.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🤖</div>
            <h3 className="font-semibold text-gray-800 mb-1">Penilaian AI</h3>
            <p className="text-sm text-gray-500">
              Esai dinilai secara otomatis berdasarkan rubrik yang telah ditentukan dengan
              feedback detail.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-800 mb-1">Analisis Integritas</h3>
            <p className="text-sm text-gray-500">
              Sistem menganalisis pola pengetikan untuk memastikan jawaban diketik secara manual.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
