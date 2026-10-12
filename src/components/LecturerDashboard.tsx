import React, { useState } from 'react';
import { Assignment, Submission, GradingResult, User } from '../types';

interface LecturerDashboardProps {
  user: User;
  assignments: Assignment[];
  submissions: Submission[];
  results: GradingResult[];
  users: User[];
  onCreateAssignment: (assignment: Omit<Assignment, 'id' | 'createdBy'>) => void;
  onUpdateAssignment: (id: string, assignment: Omit<Assignment, 'id' | 'createdBy'>) => void;
  onDeleteAssignment: (id: string) => void;
  onViewSubmissionDetail: (result: GradingResult) => void;
}

const LecturerDashboard: React.FC<LecturerDashboardProps> = ({
  user,
  assignments,
  submissions,
  results,
  users,
  onCreateAssignment,
  onUpdateAssignment,
  onDeleteAssignment,
  onViewSubmissionDetail,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'assignments'>('overview');

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formMaxScore, setFormMaxScore] = useState(100);
  const [formDueDate, setFormDueDate] = useState('');

  const studentUsers = users.filter((u) => u.role === 'student');
  const totalSubmissions = submissions.length;
  const avgScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.totalScore, 0) / results.length)
    : 0;
  const avgIntegrity = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.integrityScore, 0) / results.length)
    : 0;

  const resetForm = () => {
    setFormTitle('');
    setFormDescription('');
    setFormSubject('');
    setFormMaxScore(100);
    setFormDueDate('');
  };

  const openCreateForm = () => {
    resetForm();
    setShowCreateForm(true);
  };

  const openEditForm = (assignment: Assignment) => {
    setFormTitle(assignment.title);
    setFormDescription(assignment.description);
    setFormSubject(assignment.subject);
    setFormMaxScore(assignment.maxScore);
    setFormDueDate(assignment.dueDate);
    setEditingAssignment(assignment);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateAssignment({
      title: formTitle,
      description: formDescription,
      subject: formSubject,
      maxScore: formMaxScore,
      dueDate: formDueDate,
      rubric: [
        { criteria: 'Kedalaman Analisis', maxScore: 30, weight: 0.3 },
        { criteria: 'Struktur & Koherensi', maxScore: 25, weight: 0.25 },
        { criteria: 'Penggunaan Contoh & Bukti', maxScore: 20, weight: 0.2 },
        { criteria: 'Orisinalitas & Kreativitas', maxScore: 15, weight: 0.15 },
        { criteria: 'Tata Bahasa & Ejaan', maxScore: 10, weight: 0.1 },
      ],
    });
    resetForm();
    setShowCreateForm(false);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAssignment) return;
    onUpdateAssignment(editingAssignment.id, {
      title: formTitle,
      description: formDescription,
      subject: formSubject,
      maxScore: formMaxScore,
      dueDate: formDueDate,
      rubric: editingAssignment.rubric,
    });
    resetForm();
    setEditingAssignment(null);
  };

  const handleDelete = () => {
    if (!deletingId) return;
    onDeleteAssignment(deletingId);
    setDeletingId(null);
  };

  const getGradeColor = (grade: string): string => {
    if (grade === 'A') return 'bg-green-100 text-green-700 border-green-200';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-900 p-8 text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <span className="text-2xl">👨‍🏫</span>
            </div>
            <div>
              <p className="text-white/60 text-sm">Panel Dosen</p>
              <h1 className="text-2xl font-bold">{user.name.split(',')[0]}</h1>
              <p className="text-white/60 text-sm">{user.department}</p>
            </div>
          </div>

          <button
            onClick={openCreateForm}
            className="px-5 py-2.5 bg-white text-slate-900 rounded-lg font-semibold hover:bg-white/90 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Buat Soal Baru
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Soal Dibuat', value: assignments.length, icon: '📝', bg: 'bg-blue-50' },
          { label: 'Mahasiswa', value: studentUsers.length, icon: '👨‍🎓', bg: 'bg-green-50' },
          { label: 'Submission', value: totalSubmissions, icon: '📊', bg: 'bg-purple-50' },
          { label: 'Rata-rata Nilai', value: avgScore, icon: '⭐', bg: 'bg-yellow-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center`}>
                <span className="text-lg">{stat.icon}</span>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-6">
          {[
            { id: 'overview', label: 'Overview', icon: '📈' },
            { id: 'students', label: 'Mahasiswa', icon: '👨‍🎓' },
            { id: 'assignments', label: 'Bank Soal', icon: '📋' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Recent Submissions */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-5 border-b border-gray-200">
              <h3 className="font-bold text-gray-800">📥 Submission Terbaru</h3>
            </div>
            <div className="p-5">
              {results.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <div className="text-4xl mb-2">📭</div>
                  <p className="text-sm">Belum ada submission</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {results.slice(-5).reverse().map((result) => {
                    const sub = submissions.find((s) => s.id === result.submissionId);
                    const assign = assignments.find((a) => a.id === sub?.assignmentId);
                    if (!sub || !assign) return null;
                    return (
                      <div
                        key={result.submissionId}
                        onClick={() => onViewSubmissionDetail(result)}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-600">{sub.studentName.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-medium text-sm text-gray-800">{sub.studentName}</p>
                            <p className="text-xs text-gray-500">{assign.title.substring(0, 40)}...</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold border ${getGradeColor(result.grade)}`}>
                            {result.grade}
                          </span>
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
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-800 mb-4">🛡️ Integritas Akademik</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="text-2xl font-bold text-green-600">{avgIntegrity}%</div>
                <div className="text-xs text-green-600 mt-1">Rata-rata Integritas</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <div className="text-2xl font-bold text-yellow-600">
                  {results.filter((r) => r.integrityScore < 70).length}
                </div>
                <div className="text-xs text-yellow-600 mt-1">Perlu Perhatian</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
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
        <div className="bg-white rounded-xl border border-gray-200 animate-fadeIn">
          <div className="p-5 border-b border-gray-200">
            <h3 className="font-bold text-gray-800">Daftar Mahasiswa ({studentUsers.length})</h3>
          </div>
          <div className="p-5">
            {studentUsers.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <div className="text-4xl mb-2">👨‍🎓</div>
                <p className="text-sm">Belum ada mahasiswa</p>
              </div>
            ) : (
              <div className="space-y-2">
                {studentUsers.map((student) => {
                  const studentSubmissions = submissions.filter((s) => s.studentId === student.nim);
                  const studentResults = results.filter((r) =>
                    studentSubmissions.some((s) => s.id === r.submissionId)
                  );
                  const studentAvg = studentResults.length > 0
                    ? Math.round(studentResults.reduce((sum, r) => sum + r.totalScore, 0) / studentResults.length)
                    : 0;

                  return (
                    <div key={student.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">{student.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-800">{student.name}</p>
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
        <div className="animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{assignments.length} soal tersedia</p>
            <button
              onClick={openCreateForm}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Soal
            </button>
          </div>

          <div className="space-y-3">
            {assignments.map((assignment, index) => {
              const assignSubmissions = submissions.filter((s) => s.assignmentId === assignment.id);
              return (
                <div key={assignment.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                          Soal #{index + 1}
                        </span>
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                          {assignment.subject}
                        </span>
                        <span className="text-xs text-gray-400">
                          Deadline: {new Date(assignment.dueDate).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-800 mb-1">{assignment.title}</h4>
                      <p className="text-sm text-gray-500 line-clamp-2">{assignment.description}</p>
                      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                        <span>📝 {assignSubmissions.length} submission</span>
                        <span>⭐ {assignment.maxScore} poin</span>
                        <span>📋 {assignment.rubric.length} kriteria</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => openEditForm(assignment)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit soal"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeletingId(assignment.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus soal"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateForm || editingAssignment) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-gray-800">
                {editingAssignment ? '✏️ Edit Soal' : '➕ Buat Soal Baru'}
              </h3>
              <button
                onClick={() => { setShowCreateForm(false); setEditingAssignment(null); resetForm(); }}
                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={editingAssignment ? handleUpdate : handleCreate} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Soal *</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Masukkan judul soal"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mata Kuliah *</label>
                <input
                  type="text"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  placeholder="Contoh: Teknologi Informasi"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Soal *</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Jelaskan instruksi soal essay..."
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nilai Maksimal</label>
                  <input
                    type="number"
                    value={formMaxScore}
                    onChange={(e) => setFormMaxScore(Number(e.target.value))}
                    min={1}
                    max={100}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline *</label>
                  <input
                    type="date"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => { setShowCreateForm(false); setEditingAssignment(null); resetForm(); }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold"
                >
                  {editingAssignment ? 'Simpan Perubahan' : 'Buat Soal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Hapus Soal?</h3>
              <p className="text-sm text-gray-500 mb-1">
                Soal ini akan dihapus secara permanen.
              </p>
              <p className="text-sm text-red-600 font-medium">
                Semua submission terkait juga akan ikut terhapus.
              </p>
            </div>
            <div className="p-4 border-t border-gray-200 flex gap-3 bg-gray-50">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-white text-sm font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-semibold"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerDashboard;
