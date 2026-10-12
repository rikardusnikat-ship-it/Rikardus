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

  // New assignment form state
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
    if (grade === 'A') return 'bg-green-100 text-green-700';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-700';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <span className="text-2xl">👨‍🏫</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Selamat Datang, {user.name.split(',')[0]}</h1>
              <p className="text-white/80 text-sm">{user.department} • NIP: {user.nip}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">📝</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{assignments.length}</div>
              <div className="text-xs text-gray-500">Tugas Dibuat</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">👨‍🎓</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{studentUsers.length}</div>
              <div className="text-xs text-gray-500">Mahasiswa Terdaftar</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">📊</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{totalSubmissions}</div>
              <div className="text-xs text-gray-500">Total Submission</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">⭐</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{avgScore}</div>
              <div className="text-xs text-gray-500">Rata-rata Nilai</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'overview' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          📈 Overview
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'students' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          👨‍🎓 Mahasiswa
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'assignments' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          📋 Tugas
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Recent Submissions */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">📥 Submission Terbaru</h3>
            </div>
            <div className="p-6">
              {results.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-3xl mb-2">📭</div>
                  <p>Belum ada submission dari mahasiswa</p>
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
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors cursor-pointer border border-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-sm">👨‍🎓</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 text-sm">{sub.studentName}</p>
                            <p className="text-xs text-gray-500">{assign.title.substring(0, 40)}...</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${getGradeColor(result.grade)}`}>
                            {result.grade}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{result.totalScore}/{result.maxScore}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Integrity Overview */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🛡️ Integritas Akademik</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="text-2xl font-bold text-green-600">{avgIntegrity}%</div>
                <div className="text-xs text-green-600 mt-1">Rata-rata Integritas</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                <div className="text-2xl font-bold text-yellow-600">
                  {results.filter((r) => r.integrityScore < 70).length}
                </div>
                <div className="text-xs text-yellow-600 mt-1">Perlu Perhatian</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-xl border border-red-100">
                <div className="text-2xl font-bold text-red-600">
                  {results.filter((r) => r.integrityScore < 40).length}
                </div>
                <div className="text-xs text-red-600 mt-1">Dicurigai</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Daftar Mahasiswa</h3>
            <p className="text-sm text-gray-500 mt-1">{studentUsers.length} mahasiswa terdaftar</p>
          </div>
          <div className="p-6">
            {studentUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <div className="text-3xl mb-2">👨‍🎓</div>
                <p>Belum ada mahasiswa terdaftar</p>
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
                    <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-indigo-600">
                            {student.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{student.name}</p>
                          <p className="text-xs text-gray-500">NIM: {student.nim} • {student.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-800">{studentSubmissions.length} submission</p>
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
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Buat Tugas Baru
            </button>
          </div>

          {/* Create Assignment Form */}
          {showCreateForm && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 animate-fadeIn">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📝 Buat Tugas Essay Baru</h3>
              <form onSubmit={handleCreateAssignment} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Judul Tugas</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Masukkan judul tugas"
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mata Kuliah</label>
                    <input
                      type="text"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      placeholder="Contoh: Teknologi Informasi"
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Tugas</label>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Jelaskan instruksi tugas essay..."
                    required
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm resize-none"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nilai Maksimal</label>
                    <input
                      type="number"
                      value={newMaxScore}
                      onChange={(e) => setNewMaxScore(Number(e.target.value))}
                      min={1}
                      max={100}
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                    <input
                      type="date"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium"
                  >
                    Buat Tugas
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Assignment List */}
          <div className="space-y-3">
            {assignments.map((assignment) => {
              const assignSubmissions = submissions.filter((s) => s.assignmentId === assignment.id);
              return (
                <div key={assignment.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                          {assignment.subject}
                        </span>
                        <span className="text-xs text-gray-400">
                          Deadline: {new Date(assignment.dueDate).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-800">{assignment.title}</h4>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{assignment.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <div className="text-lg font-bold text-indigo-600">{assignSubmissions.length}</div>
                      <div className="text-xs text-gray-500">submission</div>
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
