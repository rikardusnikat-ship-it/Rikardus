import React, { useRef, useState, useCallback, useEffect } from 'react';

interface AntiPasteTextareaProps {
  value: string;
  onChange: (value: string) => void;
  onPasteAttempt: () => void;
  placeholder?: string;
  disabled?: boolean;
}

const AntiPasteTextarea: React.FC<AntiPasteTextareaProps> = ({
  value,
  onChange,
  onPasteAttempt,
  placeholder,
  disabled,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [warning, setWarning] = useState<string>('');
  const [warningVisible, setWarningVisible] = useState(false);
  const lastInputTime = useRef<number>(Date.now());

  const showWarning = useCallback((msg: string) => {
    setWarning(msg);
    setWarningVisible(true);
    setTimeout(() => setWarningVisible(false), 3000);
  }, []);

  // Prevent paste
  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      onPasteAttempt();
      showWarning('⚠️ Copy-paste tidak diperbolehkan! Silakan ketik jawaban Anda sendiri.');
    },
    [onPasteAttempt, showWarning]
  );

  // Prevent drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      onPasteAttempt();
      showWarning('⚠️ Men-drag teks tidak diperbolehkan! Silakan ketik jawaban Anda sendiri.');
    },
    [onPasteAttempt, showWarning]
  );

  // Prevent context menu
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    showWarning('⚠️ Menu klik kanan dinonaktifkan untuk menjaga integritas jawaban.');
  }, [showWarning]);

  // Monitor input for suspicious behavior
  const handleInput = useCallback(
    (e: React.FormEvent<HTMLTextAreaElement>) => {
      const newValue = e.currentTarget.value;
      const now = Date.now();
      const timeDiff = now - lastInputTime.current;
      const charsAdded = newValue.length - value.length;

      // Detect if too many characters added at once
      if (charsAdded > 20 && timeDiff < 100) {
        onPasteAttempt();
        showWarning('⚠️ Terdeteksi input yang mencurigakan. Silakan ketik secara manual.');
        e.currentTarget.value = value;
        return;
      }

      lastInputTime.current = now;
      onChange(newValue);
    },
    [value, onChange, onPasteAttempt, showWarning]
  );

  // Keyboard shortcut prevention
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        const blockedKeys = ['v', 'c', 'x', 'a'];
        if (blockedKeys.includes(e.key.toLowerCase())) {
          e.preventDefault();
          onPasteAttempt();
          showWarning('⚠️ Shortcut keyboard dinonaktifkan. Silakan ketik jawaban Anda sendiri.');
        }
      }
      if (e.shiftKey && e.key === 'Insert') {
        e.preventDefault();
        onPasteAttempt();
        showWarning('⚠️ Shortcut keyboard dinonaktifkan. Silakan ketik jawaban Anda sendiri.');
      }
    };

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('keydown', handleKeyDown);
      return () => textarea.removeEventListener('keydown', handleKeyDown);
    }
  }, [onPasteAttempt, showWarning]);

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div className="relative">
      {/* Warning Banner */}
      <div
        className={`mb-3 transition-all duration-300 ${
          warningVisible ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm flex items-center gap-3 animate-scaleIn">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          {warning}
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 text-blue-700 text-sm flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <strong className="block mb-0.5">Mode Anti Copy-Paste Aktif</strong>
          <span className="text-blue-600/80 text-xs">Jawaban harus diketik manual. Sistem akan mendeteksi aktivitas copy-paste.</span>
        </div>
      </div>

      {/* Textarea */}
      <div className="relative group">
        <textarea
          ref={textareaRef}
          value={value}
          onInput={handleInput}
          onPaste={handlePaste}
          onDrop={handleDrop}
          onContextMenu={handleContextMenu}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full min-h-[300px] p-5 bg-gray-50 border-2 border-gray-200 rounded-2xl resize-y focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-200 text-gray-800 leading-relaxed disabled:bg-gray-100 disabled:cursor-not-allowed placeholder:text-gray-400"
          style={{ userSelect: 'text' }}
          spellCheck={true}
          autoComplete="off"
        />
        {/* Character & Word Count Badge */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-xs text-gray-500 border border-gray-200 shadow-sm group-focus-within:border-indigo-200 group-focus-within:bg-indigo-50 transition-all">
          <span className="font-semibold text-indigo-600">{wordCount}</span> kata • <span className="font-semibold">{value.length}</span> karakter
        </div>
      </div>

      {/* Integrity Indicator */}
      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
        <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-green-700 font-medium">Proteksi aktif</span>
        </div>
        <span className="text-gray-400">— Ketik jawaban Anda secara manual</span>
      </div>
    </div>
  );
};

export default AntiPasteTextarea;
