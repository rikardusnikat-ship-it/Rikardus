import React, { useState } from 'react';
import { User } from '../types';

interface AuthPageProps {
  users: User[];
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ users, onLogin, onRegister }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'student' | 'lecturer'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regNim, setRegNim] = useState('');
  const [regNip, setRegNip] = useState('');
  const [regDepartment, setRegDepartment] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const user = users.find(
        (u) => u.email.toLowerCase() === loginEmail.toLowerCase() && u.password === loginPassword
      );
      if (user) {
        onLogin(user);
      } else {
        setError('Email atau password salah. Silakan coba lagi.');
      }
      setIsLoading(false);
    }, 800);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (regPassword.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError('Password dan konfirmasi tidak cocok.');
      return;
    }
    if (users.some((u) => u.email.toLowerCase() === regEmail.toLowerCase())) {
      setError('Email sudah terdaftar.');
      return;
    }
    if (role === 'student' && !regNim.trim()) {
      setError('NIM wajib diisi.');
      return;
    }
    if (role === 'lecturer' && !regNip.trim()) {
      setError('NIP wajib diisi.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: regName,
        email: regEmail,
        password: regPassword,
        role,
        nim: role === 'student' ? regNim : undefined,
        nip: role === 'lecturer' ? regNip : undefined,
        department: regDepartment,
        createdAt: new Date().toISOString(),
      };
      onRegister(newUser);
      setIsLoading(false);
    }, 800);
  };

  const fillDemo = (type: 'student' | 'lecturer') => {
    if (type === 'lecturer') {
      setLoginEmail('ahmad.wijaya@university.ac.id');
      setLoginPassword('dosen123');
    } else {
      setLoginEmail('budi.santoso@student.university.ac.id');
      setLoginPassword('mhs123');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-300/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo */}
          <div className="animate-fadeInLeft">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                <span className="text-2xl">🎓</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">AI Essay Grader</h2>
                <p className="text-white/70 text-xs">Sistem Penilaian Cerdas</p>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="space-y-8 animate-fadeInLeft animation-delay-300">
            <div>
              <h1 className="text-5xl font-bold leading-tight mb-4">
                Nilai Esai<br />
                <span className="text-white/90">dengan Kecerdasan</span><br />
                <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                  Buatan
                </span>
              </h1>
              <p className="text-lg text-white/80 max-w-md">
                Platform penilaian tugas esai berbasis AI yang modern, aman, dan efisien untuk dunia pendidikan.
              </p>
            </div>

            {/* Feature cards */}
            <div className="space-y-3">
              <div className="glass-dark rounded-xl p-4 flex items-center gap-4 hover:bg-white/10 transition-all">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🚫</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Anti Copy-Paste</h3>
                  <p className="text-white/60 text-xs">Proteksi integritas jawaban mahasiswa</p>
                </div>
              </div>
              <div className="glass-dark rounded-xl p-4 flex items-center gap-4 hover:bg-white/10 transition-all">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🤖</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">AI-Powered Grading</h3>
                  <p className="text-white/60 text-xs">Penilaian otomatis dengan feedback detail</p>
                </div>
              </div>
              <div className="glass-dark rounded-xl p-4 flex items-center gap-4 hover:bg-white/10 transition-all">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">📊</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Analisis Real-time</h3>
                  <p className="text-white/60 text-xs">Dashboard lengkap untuk dosen & mahasiswa</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="animate-fadeInLeft animation-delay-500">
            <p className="text-white/50 text-sm">
              © 2026 AI Essay Grader. Trusted by 10,000+ students & lecturers.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 mesh-gradient">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8 animate-fadeIn">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <span className="text-2xl">🎓</span>
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold text-gray-800">AI Essay Grader</h2>
                <p className="text-xs text-gray-500">Sistem Penilaian Cerdas</p>
              </div>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center justify-center mb-8 animate-fadeInUp">
            <div className="bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 flex gap-1">
              <button
                onClick={() => { setMode('login'); setError(''); }}
                className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  mode === 'login'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Masuk
              </button>
              <button
                onClick={() => { setMode('register'); setError(''); }}
                className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  mode === 'register'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Daftar
              </button>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8 animate-fadeInUp animation-delay-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {mode === 'login' ? 'Selamat Datang!' : 'Buat Akun Baru'}
            </h2>
            <p className="text-gray-500">
              {mode === 'login'
                ? 'Masuk untuk mengakses sistem penilaian'
                : 'Daftar sebagai dosen atau mahasiswa'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm flex items-center gap-3 animate-scaleIn">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              {error}
            </div>
          )}

          {/* Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5 animate-fadeInUp animation-delay-300">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="nama@email.com"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-sm input-modern"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Masukkan password"
                    required
                    className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-sm input-modern"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 btn-shine"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    Masuk
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>

              {/* Demo Accounts */}
              <div className="pt-4">
                <p className="text-center text-xs text-gray-400 mb-3">Atau gunakan akun demo:</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => fillDemo('lecturer')}
                    className="p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-left group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">👨‍🏫</span>
                      <span className="text-xs font-semibold text-gray-700 group-hover:text-indigo-700">Dosen</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">ahmad.wijaya@...</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemo('student')}
                    className="p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-left group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">👨‍🎓</span>
                      <span className="text-xs font-semibold text-gray-700 group-hover:text-indigo-700">Mahasiswa</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">budi.santoso@...</p>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Register Form */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4 animate-fadeInUp animation-delay-300">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daftar sebagai</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`p-4 rounded-xl border-2 transition-all text-center hover-lift ${
                      role === 'student'
                        ? 'border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">👨‍🎓</div>
                    <div className="text-sm font-semibold text-gray-800">Mahasiswa</div>
                    <div className="text-xs text-gray-500 mt-0.5">Kerjakan tugas</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('lecturer')}
                    className={`p-4 rounded-xl border-2 transition-all text-center hover-lift ${
                      role === 'lecturer'
                        ? 'border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">👨‍🏫</div>
                    <div className="text-sm font-semibold text-gray-800">Dosen</div>
                    <div className="text-xs text-gray-500 mt-0.5">Buat & nilai tugas</div>
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder={role === 'student' ? 'Contoh: Budi Santoso' : 'Contoh: Dr. Ahmad Wijaya'}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-sm input-modern"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="nama@email.com"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-sm input-modern"
                />
              </div>

              {/* NIM/NIP + Department */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {role === 'student' ? 'NIM' : 'NIP'}
                  </label>
                  <input
                    type="text"
                    value={role === 'student' ? regNim : regNip}
                    onChange={(e) => role === 'student' ? setRegNim(e.target.value) : setRegNip(e.target.value)}
                    placeholder={role === 'student' ? '2021010001' : '198501012010'}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-sm input-modern"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Jurusan</label>
                  <input
                    type="text"
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    placeholder="Teknik Informatika"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-sm input-modern"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min. 6 karakter"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-sm input-modern"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Konfirmasi</label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Ulangi password"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-sm input-modern"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 btn-shine mt-6"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Mendaftar...
                  </>
                ) : (
                  <>
                    Daftar Sekarang
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer link */}
          <p className="text-center text-sm text-gray-500 mt-8">
            {mode === 'login' ? (
              <>
                Belum punya akun?{' '}
                <button
                  onClick={() => { setMode('register'); setError(''); }}
                  className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                >
                  Daftar di sini
                </button>
              </>
            ) : (
              <>
                Sudah punya akun?{' '}
                <button
                  onClick={() => { setMode('login'); setError(''); }}
                  className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                >
                  Masuk di sini
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
