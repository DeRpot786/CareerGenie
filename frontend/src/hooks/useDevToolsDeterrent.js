import { useEffect } from 'react';

/**
 * useDevToolsDeterrent
 *
 * Mounts once at the app root and intercepts common DevTools keyboard shortcuts
 * and the right-click context menu. This is a deterrent only — it does NOT provide
 * real security. Never store secrets or sensitive logic in frontend code.
 *
 * Shortcuts blocked:
 *  - F12
 *  - Ctrl+Shift+I  (DevTools)
 *  - Ctrl+Shift+J  (Console)
 *  - Ctrl+Shift+C  (Inspector)
 *  - Ctrl+U        (View Source)
 *  - Right-click context menu
 *
 * Explicitly NOT blocked (to preserve UX):
 *  - Ctrl+C / Ctrl+V / Ctrl+X  (copy / paste / cut)
 *  - Ctrl+A (select all)
 *  - Ctrl+Z / Ctrl+Y (undo / redo)
 *  - Ctrl+F (find in page)
 *  - Ctrl+R / F5 (refresh)
 *  - Ctrl+T / Ctrl+W (new tab / close tab — browser-owned)
 *  - Alt+F4, etc.
 *  - Any key while focus is inside <input>, <textarea>, <select>
 */
export function useDevToolsDeterrent() {
  useEffect(() => {
    // Tags that should still receive all keyboard events normally
    const INPUT_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

    const isInputFocused = () => {
      const el = document.activeElement;
      return el && (INPUT_TAGS.has(el.tagName) || el.isContentEditable);
    };

    // ── Keyboard handler ────────────────────────────────────────────────────
    const handleKeyDown = (e) => {
      // Always allow normal typing in form fields
      if (isInputFocused()) return;

      const key = e.key;
      const ctrl = e.ctrlKey || e.metaKey; // support macOS Cmd
      const shift = e.shiftKey;

      const blocked =
        key === 'F12' ||                          // DevTools toggle
        (ctrl && shift && key === 'I') ||         // Inspect panel
        (ctrl && shift && key === 'J') ||         // Console
        (ctrl && shift && key === 'C') ||         // Element picker
        (ctrl && key === 'U');                    // View Source

      if (blocked) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // ── Context menu handler ─────────────────────────────────────────────────
    const handleContextMenu = (e) => {
      // Allow context menu inside input / textarea so users can paste normally
      const el = e.target;
      if (el && (INPUT_TAGS.has(el.tagName) || el.isContentEditable)) return;
      e.preventDefault();
    };

    // Attach at the document level (capture phase so it fires before React handlers)
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('contextmenu', handleContextMenu, true);

    // Cleanup on unmount (won't happen in practice since App is never unmounted,
    // but included to avoid memory leaks in tests / strict mode double-invocation)
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('contextmenu', handleContextMenu, true);
    };
  }, []); // run once
}
