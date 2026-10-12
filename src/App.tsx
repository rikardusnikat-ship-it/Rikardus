import React, { useState } from 'react';
import { Assignment, Submission, GradingResult, AppView } from './types';
import { assignments } from './data';
import { gradeEssay } from './aiGrader';
import Dashboard from './components/Dashboard';
import EssaySubmission from './components/EssaySubmission';
import GradingResultView from './components/GradingResultView';
import ResultsList from './components/ResultsList';

function App() {
  const [view, setView] = useState<AppView>('dashboard');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [results, setResults] = useState<GradingResult[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [selectedResult, setSelectedResult] = useState<GradingResult | null>(null);

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
    if (!selectedAssignment) return;

    const wordCount = answer.trim().split(/\s+/).filter(w => w.length > 0).length;

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

    // Grade the essay
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

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return (
          <Dashboard
            assignments={assignments}
            submissions={submissions}
            results={results}
            onStartSubmit={handleStartSubmit}
            onViewResults={handleViewResults}
          />
        );
      case 'submit':
        if (!selectedAssignment) return null;
        return (
          <EssaySubmission
            assignment={selectedAssignment}
            onSubmit={handleSubmit}
            onBack={handleBack}
          />
        );
      case 'results':
        return (
          <ResultsList
            results={results}
            assignments={assignments}
            submissions={submissions}
            onViewDetail={handleViewDetail}
            onBack={handleBack}
          />
        );
      case 'detail':
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
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={handleBack}>
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🎓</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800 leading-tight">AI Essay Grader</h1>
                <p className="text-xs text-gray-400 leading-tight">Sistem Penilaian Tugas Mahasiswa</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  view === 'dashboard' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                🏠 Dashboard
              </button>
              {results.length > 0 && (
                <button
                  onClick={handleViewResults}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    view === 'results' || view === 'detail' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  📊 Hasil ({results.length})
                </button>
              )}
              <div className="hidden sm:flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-700 font-medium">AI Online</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>

      {/* Footer */}
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
    </div>
  );
}

export default App;
