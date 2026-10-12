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
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 md:p-10 text-white animate-fadeInUp">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3"></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-yellow-300/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-xl">
              <span className="text-3xl">👨‍🎓</span>
            </div>
            <div>
              <p className="text-white/70 text-sm mb-1">Selamat datang kembali,</p>
              <h1 className="text-2xl md:text-3xl font-bold">{user.name}</h1>
              <p className="text-white/70 text-sm mt-1">
                {user.nim} • {user.department}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="glass-dark rounded-2xl px-5 py-3 text-center min-w-[90px]">
              <div className="text-2xl font-bold">{pendingCount}</div>
              <div className="text-xs text-white/70">Pending</div>
            </div>
            <div className="glass-dark rounded-2xl px-5 py-3 text-center min-w-[90px]">
              <div className="text-2xl font-bold">{completedCount}</div>
              <div className="text-xs text-white/70">Selesai</div>
            </div>
            <div className="glass-dark rounded-2xl px-5 py-3 text-center min-w-[90px]">
              <div className="text-2xl font-bold">{avgScore}</div>
              <div className="text-xs text-white/70">Rata-rata</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => {
            const pending = assignments.find(a => !mySubmissions.some(s => s.assignmentId === a.id));
            if (pending) onStartSubmit(pending);
          }}
          className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50 transition-all hover-lift text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200/50 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Kerjakan Tugas</h3>
              <p className="text-sm text-gray-500">Mulai mengerjakan essay</p>
            </div>
          </div>
        </button>

        <button
          onClick={onViewResults}
          className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-green-200 hover:shadow-lg hover:shadow-green-100/50 transition-all hover-lift text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-200/50 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Lihat Nilai</h3>
              <p className="text-sm text-gray-500">Cek hasil penilaian AI</p>
            </div>
          </div>
        </button>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200/50">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Progress</h3>
              <p className="text-sm text-gray-500">
                {assignments.length > 0 ? Math.round((completedCount / assignments.length) * 100) : 0}% selesai
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Tugas Essay</h2>
            <p className="text-gray-500 text-sm mt-1">{assignments.length} tugas tersedia</p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {assignments.map((assignment, index) => {
            const isSubmitted = mySubmissions.some((s) => s.assignmentId === assignment.id);
            const result = myResults.find(
              (r) => r.submissionId === mySubmissions.find((s) => s.assignmentId === assignment.id)?.id
            );

            return (
              <div
                key={assignment.id}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 overflow-hidden hover-lift"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Card Header with gradient */}
                <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold">
                      {assignment.subject}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(assignment.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {assignment.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {assignment.description}
                  </p>

                  {/* Rubric tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {assignment.rubric.slice(0, 3).map((r, i) => (
                      <span
                        key={i}
                        className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100"
                      >
                        {r.criteria}
                      </span>
                    ))}
                    {assignment.rubric.length > 3 && (
                      <span className="text-xs text-gray-400 px-2 py-1">
                        +{assignment.rubric.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-800">{assignment.maxScore}</span>
                      <span className="text-xs text-gray-400">poin</span>
                    </div>
                    {isSubmitted ? (
                      <div className="flex items-center gap-2">
                        {result && (
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                            result.grade === 'A' ? 'bg-green-100 text-green-700' :
                            result.grade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {result.grade} • {result.totalScore}
                          </span>
                        )}
                        <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-semibold flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Selesai
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => onStartSubmit(assignment)}
                        className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md shadow-indigo-200/50 flex items-center gap-1.5 group/btn"
                      >
                        Kerjakan
                        <svg className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-gradient-to-br from-gray-50 to-indigo-50/50 rounded-3xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">🛡️ Ketentuan Pengerjaan</h2>
          <p className="text-gray-500">Pastikan Anda memahami aturan berikut</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '🚫', title: 'Anti Copy-Paste', desc: 'Jawaban harus diketik manual. Sistem mendeteksi aktivitas copy-paste.' },
            { icon: '🤖', title: 'Penilaian AI', desc: 'Esai dinilai otomatis berdasarkan rubrik yang telah ditentukan.' },
            { icon: '⏱️', title: 'Waktu Dipantau', desc: 'Sistem mencatat waktu pengerjaan untuk memastikan orisinalitas.' },
          ].map((item, i) => (
            <div key={i} className="text-center bg-white rounded-2xl p-6 border border-gray-100 hover-lift">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
