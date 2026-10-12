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
  const charCount = useRef<number>(0);

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

      // Detect if too many characters added at once (possible paste via browser extension)
      if (charsAdded > 20 && timeDiff < 100) {
        onPasteAttempt();
        showWarning('⚠️ Terdeteksi input yang mencurigakan. Silakan ketik secara manual.');
        // Revert to previous value
        e.currentTarget.value = value;
        return;
      }

      lastInputTime.current = now;
      charCount.current = charsAdded;
      onChange(newValue);
    },
    [value, onChange, onPasteAttempt, showWarning]
  );

  // Keyboard shortcut prevention
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+V, Ctrl+C, Ctrl+X, Ctrl+A (select all)
      if (e.ctrlKey || e.metaKey) {
        const blockedKeys = ['v', 'c', 'x', 'a'];
        if (blockedKeys.includes(e.key.toLowerCase())) {
          e.preventDefault();
          onPasteAttempt();
          showWarning('⚠️ Shortcut keyboard dinonaktifkan. Silakan ketik jawaban Anda sendiri.');
        }
      }
      // Prevent Shift+Insert (another paste shortcut)
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
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {warning}
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-3 bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-700 text-sm flex items-center gap-2">
        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <span>
          <strong>Mode Anti Copy-Paste Aktif:</strong> Jawaban harus diketik manual. Sistem akan
          mendeteksi aktivitas copy-paste dan mempengaruhi skor integritas.
        </span>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onInput={handleInput}
          onPaste={handlePaste}
          onDrop={handleDrop}
          onContextMenu={handleContextMenu}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full min-h-[300px] p-4 border-2 border-gray-200 rounded-xl resize-y focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-gray-800 leading-relaxed disabled:bg-gray-50 disabled:cursor-not-allowed"
          style={{ userSelect: 'text' }}
          spellCheck={true}
          autoComplete="off"
        />
        {/* Character & Word Count */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-gray-500 border border-gray-200 shadow-sm">
          {wordCount} kata | {value.length} karakter
        </div>
      </div>

      {/* Integrity Indicator */}
      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span>Proteksi aktif - Ketik jawaban Anda secara manual</span>
        </div>
      </div>
    </div>
  );
};

export default AntiPasteTextarea;
