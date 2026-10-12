import React, { useState } from 'react';
import { Assignment, Submission, GradingResult, User, AppView } from './types';
import { assignments as initialAssignments, initialUsers } from './data';
import { gradeEssay } from './aiGrader';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import LecturerDashboard from './components/LecturerDashboard';
import StudentDashboard from './components/StudentDashboard';
import EssaySubmission from './components/EssaySubmission';
import GradingResultView from './components/GradingResultView';
import ResultsList from './components/ResultsList';

function App() {
  const [view, setView] = useState<AppView>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [results, setResults] = useState<GradingResult[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [selectedResult, setSelectedResult] = useState<GradingResult | null>(null);

  // Auth handlers
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setView('dashboard');
  };

  const handleRegister = (user: User) => {
    setUsers((prev) => [...prev, user]);
    setCurrentUser(user);
    setView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('login');
    setSelectedAssignment(null);
    setSelectedResult(null);
  };

  // Navigation handlers
  const handleStartSubmit = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setView('submit');
  };

  const handleSubmit = (
    answer: string,
    studentName: string,
    studentId: string,
    typingTime: number,
    pasteAttempts: number
  ) => {
    if (!selectedAssignment || !currentUser) return;

    const wordCount = answer.trim().split(/\s+/).filter((w) => w.length > 0).length;

    const submission: Submission = {
      id: `sub-${Date.now()}`,
      assignmentId: selectedAssignment.id,
      studentName,
      studentId,
      answer,
      submittedAt: new Date().toISOString(),
      wordCount,
      typingTime,
      pasteAttempts,
    };

    setSubmissions((prev) => [...prev, submission]);

    const gradingResult = gradeEssay(answer, selectedAssignment, typingTime, pasteAttempts);
    gradingResult.submissionId = submission.id;

    setResults((prev) => [...prev, gradingResult]);
    setSelectedResult(gradingResult);
    setView('results');
  };

  const handleViewResults = () => {
    setView('results');
  };

  const handleViewDetail = (result: GradingResult) => {
    setSelectedResult(result);
    setView('detail');
  };

  const handleBack = () => {
    setView('dashboard');
    setSelectedAssignment(null);
    setSelectedResult(null);
  };

  const handleCreateAssignment = (assignmentData: Omit<Assignment, 'id' | 'createdBy'>) => {
    const newAssignment: Assignment = {
      ...assignmentData,
      id: `assign-${Date.now()}`,
      createdBy: currentUser?.id || '',
    };
    setAssignments((prev) => [...prev, newAssignment]);
  };

  // Render based on view and role
  const renderView = () => {
    // Auth views
    if (view === 'login') {
      return (
        <LoginPage
          users={users}
          onLogin={handleLogin}
          onGoToRegister={() => setView('register')}
        />
      );
    }

    if (view === 'register') {
      return (
        <RegisterPage
          users={users}
          onRegister={handleRegister}
          onGoToLogin={() => setView('login')}
        />
      );
    }

    // Must be logged in for other views
    if (!currentUser) {
      setView('login');
      return null;
    }

    // Dashboard based on role
    if (view === 'dashboard') {
      if (currentUser.role === 'lecturer') {
        return (
          <LecturerDashboard
            user={currentUser}
            assignments={assignments}
            submissions={submissions}
            results={results}
            users={users}
            onCreateAssignment={handleCreateAssignment}
            onViewSubmissionDetail={handleViewDetail}
          />
        );
      } else {
        return (
          <StudentDashboard
            user={currentUser}
            assignments={assignments}
            submissions={submissions}
            results={results}
            onStartSubmit={handleStartSubmit}
            onViewResults={handleViewResults}
          />
        );
      }
    }

    // Submit view (student only)
    if (view === 'submit') {
      if (!selectedAssignment) return null;
      return (
        <EssaySubmission
          assignment={selectedAssignment}
          currentUser={currentUser}
          onSubmit={handleSubmit}
          onBack={handleBack}
        />
      );
    }

    // Results list
    if (view === 'results') {
      // Filter results based on role
      const filteredResults = currentUser.role === 'lecturer'
        ? results
        : results.filter((r) =>
            submissions.some(
              (s) => s.id === r.submissionId && s.studentId === currentUser.nim
            )
          );
      const filteredSubmissions = currentUser.role === 'lecturer'
        ? submissions
        : submissions.filter((s) => s.studentId === currentUser.nim);

      return (
        <ResultsList
          results={filteredResults}
          assignments={assignments}
          submissions={filteredSubmissions}
          currentUser={currentUser}
          onViewDetail={handleViewDetail}
          onBack={handleBack}
        />
      );
    }

    // Detail view
    if (view === 'detail') {
      if (!selectedResult) return null;
      const submission = submissions.find((s) => s.id === selectedResult.submissionId);
      const assignment = assignments.find((a) => a.id === submission?.assignmentId);
      if (!submission || !assignment) return null;
      return (
        <GradingResultView
          result={selectedResult}
          assignment={assignment}
          submission={submission}
          onBack={handleBack}
        />
      );
    }

    return null;
  };

  // Show navigation only when logged in and not on auth pages
  const showNav = currentUser && view !== 'login' && view !== 'register';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      {/* Navigation */}
      {showNav && (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3 cursor-pointer" onClick={handleBack}>
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">🎓</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-800 leading-tight">AI Essay Grader</h1>
                  <p className="text-xs text-gray-400 leading-tight">
                    {currentUser.role === 'lecturer' ? 'Panel Dosen' : 'Panel Mahasiswa'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBack}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    view === 'dashboard' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  🏠 Dashboard
                </button>
                <button
                  onClick={handleViewResults}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    view === 'results' || view === 'detail'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  📊 {currentUser.role === 'lecturer' ? 'Semua Nilai' : 'Nilai Saya'}
                </button>
                <div className="hidden sm:flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-700 font-medium">AI Online</span>
                </div>
                {/* User Profile & Logout */}
                <div className="flex items-center gap-2 ml-2 pl-3 border-l border-gray-200">
                  <div className="hidden md:flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      currentUser.role === 'lecturer' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {currentUser.name.charAt(0)}
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-gray-700 leading-tight max-w-[120px] truncate">
                        {currentUser.name.split(',')[0]}
                      </p>
                      <p className="text-xs text-gray-400 leading-tight">
                        {currentUser.role === 'lecturer' ? 'Dosen' : 'Mahasiswa'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Keluar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className={`${showNav ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' : ''}`}>
        {renderView()}
      </main>

      {/* Footer */}
      {showNav && (
        <footer className="border-t border-gray-200 bg-white/50 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                © 2026 AI Essay Grader — Sistem Penilaian Tugas Mahasiswa Berbasis AI
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>🔒 Anti Copy-Paste</span>
                <span>•</span>
                <span>🤖 AI-Powered Grading</span>
                <span>•</span>
                <span>📊 Real-time Analysis</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
