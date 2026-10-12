import React, { useState } from 'react';
import { Assignment, Submission, GradingResult, User } from '../types';

interface LecturerDashboardProps {
  user: User;
  assignments: Assignment[];
  submissions: Submission[];
  results: GradingResult[];
  users: User[];
  onCreateAssignment: (assignment: Omit<Assignment, 'id' | 'createdBy'>) => void;
  onViewSubmissionDetail: (result: GradingResult) => void;
}

const LecturerDashboard: React.FC<LecturerDashboardProps> = ({
  user,
  assignments,
  submissions,
  results,
  users,
  onCreateAssignment,
  onViewSubmissionDetail,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'assignments'>('overview');

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newMaxScore, setNewMaxScore] = useState(100);
  const [newDueDate, setNewDueDate] = useState('');

  const studentUsers = users.filter((u) => u.role === 'student');
  const totalSubmissions = submissions.length;
  const avgScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.totalScore, 0) / results.length)
    : 0;
  const avgIntegrity = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.integrityScore, 0) / results.length)
    : 0;

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateAssignment({
      title: newTitle,
      description: newDescription,
      subject: newSubject,
      maxScore: newMaxScore,
      dueDate: newDueDate,
      rubric: [
        { criteria: 'Kedalaman Analisis', maxScore: 30, weight: 0.3 },
        { criteria: 'Struktur & Koherensi', maxScore: 25, weight: 0.25 },
        { criteria: 'Penggunaan Contoh & Bukti', maxScore: 20, weight: 0.2 },
        { criteria: 'Orisinalitas & Kreativitas', maxScore: 15, weight: 0.15 },
        { criteria: 'Tata Bahasa & Ejaan', maxScore: 10, weight: 0.1 },
      ],
    });
    setNewTitle('');
    setNewDescription('');
    setNewSubject('');
    setNewMaxScore(100);
    setNewDueDate('');
    setShowCreateForm(false);
  };

  const getGradeColor = (grade: string): string => {
    if (grade === 'A') return 'bg-green-100 text-green-700 border-green-200';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-900 p-8 md:p-10 text-white animate-fadeInUp">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full translate-y-1/2 -translate-x-1/3"></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
              <span className="text-3xl">👨‍🏫</span>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">Panel Dosen</p>
              <h1 className="text-2xl md:text-3xl font-bold">{user.name.split(',')[0]}</h1>
              <p className="text-white/60 text-sm mt-1">
                {user.department} • NIP: {user.nip}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-white text-slate-900 rounded-xl font-semibold hover:bg-white/90 transition-all shadow-xl flex items-center gap-2 hover-lift"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Buat Tugas Baru
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Tugas Dibuat', value: assignments.length, icon: '📝', color: 'from-indigo-500 to-purple-500', bgColor: 'bg-indigo-50' },
          { label: 'Mahasiswa', value: studentUsers.length, icon: '👨‍🎓', color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50' },
          { label: 'Submission', value: totalSubmissions, icon: '📊', color: 'from-orange-500 to-red-500', bgColor: 'bg-orange-50' },
          { label: 'Rata-rata Nilai', value: avgScore, icon: '⭐', color: 'from-yellow-500 to-orange-500', bgColor: 'bg-yellow-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all hover-lift">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <span className="text-xl">{stat.icon}</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Assignment Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-scaleIn">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">📝 Buat Tugas Essay Baru</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Judul Tugas</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Masukkan judul tugas"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mata Kuliah</label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Contoh: Teknologi Informasi"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Jelaskan instruksi tugas essay..."
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-sm resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nilai Maksimal</label>
                  <input
                    type="number"
                    value={newMaxScore}
                    onChange={(e) => setNewMaxScore(Number(e.target.value))}
                    min={1}
                    max={100}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Deadline</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all text-sm font-semibold shadow-lg shadow-indigo-200/50"
                >
                  Buat Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-gray-100 shadow-sm inline-flex gap-1">
        {[
          { id: 'overview', label: 'Overview', icon: '📈' },
          { id: 'students', label: 'Mahasiswa', icon: '👨‍🎓' },
          { id: 'assignments', label: 'Tugas', icon: '📋' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Recent Submissions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800">📥 Submission Terbaru</h3>
                <p className="text-sm text-gray-500 mt-0.5">5 submission terakhir</p>
              </div>
            </div>
            <div className="p-6">
              {results.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-3">📭</div>
                  <p className="text-gray-400 font-medium">Belum ada submission</p>
                  <p className="text-sm text-gray-300 mt-1">Mahasiswa belum mengumpulkan tugas</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {results.slice(-5).reverse().map((result) => {
                    const sub = submissions.find((s) => s.id === result.submissionId);
                    const assign = assignments.find((a) => a.id === sub?.assignmentId);
                    if (!sub || !assign) return null;
                    return (
                      <div
                        key={result.submissionId}
                        onClick={() => onViewSubmissionDetail(result)}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-all cursor-pointer border border-gray-100 hover:border-indigo-200 group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-sm">
                              {sub.studentName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">{sub.studentName}</p>
                            <p className="text-xs text-gray-500">{assign.title.substring(0, 45)}...</p>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <div>
                            <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${getGradeColor(result.grade)}`}>
                              {result.grade}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">{result.totalScore}/{result.maxScore}</p>
                          </div>
                          <svg className="w-5 h-5 text-gray-300 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Integrity Overview */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-5">🛡️ Integritas Akademik</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                <div className="text-3xl font-bold text-green-600">{avgIntegrity}%</div>
                <div className="text-xs text-green-600 mt-1 font-medium">Rata-rata Integritas</div>
              </div>
              <div className="text-center p-5 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border border-yellow-100">
                <div className="text-3xl font-bold text-yellow-600">
                  {results.filter((r) => r.integrityScore < 70).length}
                </div>
                <div className="text-xs text-yellow-600 mt-1 font-medium">Perlu Perhatian</div>
              </div>
              <div className="text-center p-5 bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl border border-red-100">
                <div className="text-3xl font-bold text-red-600">
                  {results.filter((r) => r.integrityScore < 40).length}
                </div>
                <div className="text-xs text-red-600 mt-1 font-medium">Dicurigai</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fadeIn">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">Daftar Mahasiswa</h3>
            <p className="text-sm text-gray-500 mt-1">{studentUsers.length} mahasiswa terdaftar</p>
          </div>
          <div className="p-6">
            {studentUsers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-3">👨‍🎓</div>
                <p className="text-gray-400 font-medium">Belum ada mahasiswa</p>
              </div>
            ) : (
              <div className="space-y-3">
                {studentUsers.map((student) => {
                  const studentSubmissions = submissions.filter((s) => s.studentId === student.nim);
                  const studentResults = results.filter((r) =>
                    studentSubmissions.some((s) => s.id === r.submissionId)
                  );
                  const studentAvg = studentResults.length > 0
                    ? Math.round(studentResults.reduce((sum, r) => sum + r.totalScore, 0) / studentResults.length)
                    : 0;

                  return (
                    <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-indigo-50/50 hover:border-indigo-200 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                          <span className="text-white font-bold text-sm">
                            {student.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{student.name}</p>
                          <p className="text-xs text-gray-500">NIM: {student.nim} • {student.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-800">{studentSubmissions.length} submission</p>
                        <p className="text-xs text-gray-500">
                          {studentResults.length > 0 ? `Rata-rata: ${studentAvg}` : 'Belum dinilai'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="grid gap-4">
            {assignments.map((assignment) => {
              const assignSubmissions = submissions.filter((s) => s.assignmentId === assignment.id);
              return (
                <div key={assignment.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-lg hover:border-indigo-200 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold">
                          {assignment.subject}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(assignment.dueDate).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-800 text-lg">{assignment.title}</h4>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{assignment.description}</p>
                    </div>
                    <div className="text-center flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200/50">
                        <div className="text-center">
                          <div className="text-xl font-bold text-white">{assignSubmissions.length}</div>
                          <div className="text-xs text-white/70">submit</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerDashboard;
