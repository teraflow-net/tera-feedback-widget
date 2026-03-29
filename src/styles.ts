export const WIDGET_CSS = `
/* ===== Reset (Shadow DOM) ===== */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ===== Font ===== */
:host {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: #1e293b;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ===== Toggle Button ===== */
.tr-toggle {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 20px;
  border-radius: 14px;
  border: none;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.12);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  letter-spacing: -0.01em;
}
.tr-toggle--off {
  background: #0f172a;
  color: #fff;
}
.tr-toggle--off:hover {
  background: #1e293b;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1), 0 12px 40px rgba(0,0,0,0.18);
  transform: translateY(-1px);
}
.tr-toggle--on {
  background: #fff;
  color: #ef4444;
  border: 1px solid #fecaca;
}
.tr-toggle--on:hover {
  background: #fef2f2;
  transform: translateY(-1px);
}
.tr-toggle__badge {
  background: #2563eb;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 6px;
  min-width: 20px;
  text-align: center;
}

/* ===== Pin Layer (overlay) ===== */
.tr-pin-layer {
  position: fixed;
  inset: 0;
  z-index: 9990;
  cursor: crosshair;
}

/* ===== Top Bar ===== */
.tr-topbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 9998;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #fff;
  font-size: 13px;
  padding: 10px 20px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.tr-topbar span {
  color: rgba(255,255,255,0.7);
  font-size: 12px;
  letter-spacing: -0.01em;
}
.tr-topbar label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 12px;
  color: rgba(255,255,255,0.6);
  transition: color 0.15s;
}
.tr-topbar label:hover { color: rgba(255,255,255,0.9); }
.tr-topbar input[type="checkbox"] {
  accent-color: #2563eb;
  width: 14px;
  height: 14px;
}
.tr-topbar__btn {
  padding: 5px 14px;
  border-radius: 8px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.08);
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
  letter-spacing: -0.01em;
}
.tr-topbar__btn:hover {
  background: rgba(255,255,255,0.16);
  border-color: rgba(255,255,255,0.15);
}

/* ===== Pins ===== */
.tr-pin {
  position: absolute;
  width: 28px;
  height: 28px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  border: none;
}
.tr-pin:hover { transform: translate(-50%, -50%) scale(1.15); }
.tr-pin--open {
  background: #f97316;
  box-shadow: 0 0 0 3px rgba(249,115,22,0.2), 0 2px 8px rgba(249,115,22,0.3);
}
.tr-pin--in_progress {
  background: #2563eb;
  box-shadow: 0 0 0 3px rgba(37,99,235,0.2), 0 2px 8px rgba(37,99,235,0.3);
}
.tr-pin--resolved {
  background: #10b981;
  box-shadow: 0 0 0 3px rgba(16,185,129,0.2), 0 2px 8px rgba(16,185,129,0.3);
}
.tr-pin--new {
  background: #ef4444;
  box-shadow: 0 0 0 3px rgba(239,68,68,0.2), 0 2px 8px rgba(239,68,68,0.3);
  animation: tr-bounce 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes tr-bounce {
  0% { transform: translate(-50%, -50%) scale(0); }
  50% { transform: translate(-50%, -50%) scale(1.2); }
  100% { transform: translate(-50%, -50%) scale(1); }
}

/* ===== Comment Popover ===== */
.tr-popover-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10000;
}
.tr-popover {
  position: fixed;
  z-index: 10001;
  width: 320px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.04), 0 16px 40px rgba(0,0,0,0.12);
  border: 1px solid rgba(0,0,0,0.06);
  overflow: hidden;
}
.tr-popover__body { padding: 16px; }

.tr-popover input[type="text"],
.tr-popover textarea {
  width: 100%;
  font-size: 13px;
  padding: 9px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  outline: none;
  font-family: inherit;
  transition: all 0.15s;
  resize: none;
  background: #f8fafc;
  color: #0f172a;
}
.tr-popover input[type="text"]:focus,
.tr-popover textarea:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
  background: #fff;
}
.tr-popover input[type="text"] { margin-bottom: 8px; }
.tr-popover input[type="text"]::placeholder,
.tr-popover textarea::placeholder { color: #94a3b8; }

/* Drag & drop zone */
.tr-popover__dropzone {
  position: relative;
  margin-top: 2px;
}
.tr-popover__dropzone--dragover textarea {
  border-color: #2563eb;
  background: #eff6ff;
}
.tr-popover__drop-hint {
  display: none;
  position: absolute;
  inset: 0;
  background: rgba(37,99,235,0.06);
  border: 2px dashed #2563eb;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #2563eb;
  font-weight: 500;
  pointer-events: none;
  z-index: 1;
}
.tr-popover__dropzone--dragover .tr-popover__drop-hint { display: flex; }

/* Image preview */
.tr-popover__img-preview {
  position: relative;
  margin-top: 10px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}
.tr-popover__img-preview img {
  width: 100%;
  max-height: 140px;
  object-fit: cover;
  display: block;
}
.tr-popover__img-remove {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(4px);
  border-radius: 8px;
  border: none;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: background 0.15s;
}
.tr-popover__img-remove:hover { background: rgba(0,0,0,0.75); }

/* Footer buttons */
.tr-popover__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
}
.tr-popover__img-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 8px;
  border: none;
  background: none;
  color: #64748b;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}
.tr-popover__img-btn:hover { background: #f1f5f9; color: #334155; }
.tr-popover__submit {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #2563eb;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
  letter-spacing: -0.01em;
}
.tr-popover__submit:hover { background: #1d4ed8; }
.tr-popover__submit:disabled { opacity: 0.4; cursor: not-allowed; }

/* Existing comment view */
.tr-popover__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.tr-popover__author-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.tr-popover__avatar {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  background: #eff6ff;
  color: #2563eb;
}
.tr-popover__author {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}
.tr-popover__date {
  font-size: 11px;
  color: #94a3b8;
}
.tr-popover__status {
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 6px;
  font-weight: 600;
  letter-spacing: 0.02em;
}
.tr-popover__status--open { background: rgba(249,115,22,0.1); color: #ea580c; }
.tr-popover__status--in_progress { background: rgba(37,99,235,0.1); color: #2563eb; }
.tr-popover__status--resolved { background: rgba(16,185,129,0.1); color: #059669; }

.tr-popover__content {
  font-size: 13px;
  color: #475569;
  white-space: pre-wrap;
  margin-bottom: 10px;
  word-break: break-word;
  line-height: 1.6;
}
/* Image wrap with actions */
.tr-popover__img-wrap {
  position: relative;
  margin-bottom: 12px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}
.tr-popover__image {
  display: block;
  width: 100%;
  max-height: 180px;
  object-fit: cover;
  cursor: pointer;
  transition: opacity 0.15s;
}
.tr-popover__image:hover { opacity: 0.95; }
.tr-popover__img-actions {
  position: absolute;
  bottom: 6px;
  right: 6px;
  display: flex;
  gap: 4px;
}
.tr-popover__img-action {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(4px);
  border-radius: 8px;
  border: none;
  color: #fff;
  cursor: pointer;
  transition: background 0.15s;
}
.tr-popover__img-action:hover { background: rgba(0,0,0,0.75); }

.tr-popover__actions {
  display: flex;
  align-items: center;
  gap: 6px;
  border-top: 1px solid #f1f5f9;
  padding-top: 10px;
}
.tr-popover__action {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-weight: 500;
  transition: all 0.15s;
}
.tr-popover__action--progress { background: #eff6ff; color: #2563eb; }
.tr-popover__action--progress:hover { background: #dbeafe; }
.tr-popover__action--resolve { background: #ecfdf5; color: #059669; }
.tr-popover__action--resolve:hover { background: #d1fae5; }
.tr-popover__action--reopen { background: #fff7ed; color: #ea580c; }
.tr-popover__action--reopen:hover { background: #ffedd5; }
.tr-popover__action--delete {
  margin-left: auto;
  background: none;
  color: #cbd5e1;
}
.tr-popover__action--delete:hover { background: #fef2f2; color: #ef4444; }

/* ===== Review Panel (Sidebar) ===== */
.tr-panel {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 380px;
  background: #fff;
  border-left: 1px solid rgba(0,0,0,0.06);
  box-shadow: -8px 0 30px rgba(0,0,0,0.06);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.tr-panel--open { transform: translateX(0); }

.tr-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
}
.tr-panel__title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
}
.tr-panel__close {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  border-radius: 8px;
  cursor: pointer;
  color: #94a3b8;
  font-size: 18px;
  font-family: inherit;
  transition: all 0.15s;
}
.tr-panel__close:hover { background: #f1f5f9; color: #475569; }

/* Tabs */
.tr-panel__tabs {
  display: flex;
  padding: 0 20px;
  gap: 4px;
  border-bottom: 1px solid #f1f5f9;
}
.tr-panel__tab {
  flex: 1;
  padding: 11px 0;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  border: none;
  background: none;
  cursor: pointer;
  color: #94a3b8;
  border-bottom: 2px solid transparent;
  font-family: inherit;
  transition: all 0.15s;
  letter-spacing: -0.01em;
}
.tr-panel__tab:hover { color: #475569; }
.tr-panel__tab--active {
  color: #0f172a;
  border-bottom-color: #0f172a;
  font-weight: 600;
}

/* Comment list */
.tr-panel__list {
  flex: 1;
  overflow-y: auto;
}
.tr-panel__empty {
  padding: 48px 24px;
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
}
.tr-panel__group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #fafbfc;
  border-bottom: 1px solid #f1f5f9;
}
.tr-panel__group-icon { font-size: 12px; color: #94a3b8; }
.tr-panel__group-label { font-size: 12px; font-weight: 600; color: #334155; letter-spacing: -0.01em; }
.tr-panel__group-path { font-size: 11px; color: #cbd5e1; }
.tr-panel__group-count {
  margin-left: auto;
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  background: #f1f5f9;
  padding: 1px 8px;
  border-radius: 6px;
}

.tr-panel__item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  text-align: left;
  padding: 14px 20px;
  border: none;
  border-bottom: 1px solid #f8fafc;
  background: none;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
}
.tr-panel__item:hover { background: #fafbfc; }

.tr-panel__item-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.tr-panel__item-icon--open { background: #f97316; }
.tr-panel__item-icon--in_progress { background: #2563eb; }
.tr-panel__item-icon--resolved { background: #10b981; }

.tr-panel__item-body { min-width: 0; flex: 1; }
.tr-panel__item-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.tr-panel__item-author { font-size: 13px; font-weight: 600; color: #0f172a; letter-spacing: -0.01em; }
.tr-panel__item-date { font-size: 11px; color: #cbd5e1; }
.tr-panel__item-text {
  font-size: 12px;
  color: #64748b;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}
.tr-panel__item-attachment {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 6px;
  font-size: 11px;
  color: #2563eb;
  font-weight: 500;
}
.tr-panel__item-thumb {
  margin-top: 8px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #f1f5f9;
}
.tr-panel__item-thumb img {
  display: block;
  width: 100%;
  max-height: 80px;
  object-fit: cover;
}

/* Footer */
.tr-panel__footer {
  padding: 12px 20px;
  border-top: 1px solid #f1f5f9;
  background: #fafbfc;
  font-size: 12px;
  color: #94a3b8;
  letter-spacing: -0.01em;
}

/* ===== Top Bar Author ===== */
.tr-topbar__author {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #fff;
  font-weight: 600;
  font-size: 12px;
}
.tr-topbar__avatar {
  width: 22px;
  height: 22px;
  border-radius: 7px;
  background: #2563eb;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.tr-topbar__change {
  border: none;
  background: none;
  color: rgba(255,255,255,0.4);
  font-size: 11px;
  cursor: pointer;
  font-family: inherit;
  padding: 0;
  margin-left: 2px;
  transition: color 0.15s;
}
.tr-topbar__change:hover { color: rgba(255,255,255,0.8); }
.tr-topbar__sep {
  width: 1px;
  height: 14px;
  background: rgba(255,255,255,0.12);
}

/* ===== Author Modal ===== */
.tr-author-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10100;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(4px);
}
.tr-author-modal {
  position: fixed;
  z-index: 10101;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 340px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 16px 48px rgba(0,0,0,0.16);
  padding: 32px 28px 24px;
  text-align: center;
  animation: tr-modal-in 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes tr-modal-in {
  from { opacity: 0; transform: translate(-50%, -48%); }
  to { opacity: 1; transform: translate(-50%, -50%); }
}
.tr-author-modal__icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}
.tr-author-modal__title {
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 6px;
  letter-spacing: -0.02em;
}
.tr-author-modal__desc {
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 20px;
}
.tr-author-modal__input {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  text-align: center;
  background: #f8fafc;
  color: #0f172a;
  transition: all 0.15s;
  margin-bottom: 14px;
}
.tr-author-modal__input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
  background: #fff;
}
.tr-author-modal__input::placeholder { color: #cbd5e1; }
.tr-author-modal__btn {
  width: 100%;
  padding: 11px 0;
  border: none;
  border-radius: 12px;
  background: #0f172a;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
  letter-spacing: -0.01em;
}
.tr-author-modal__btn:hover { background: #1e293b; }
.tr-author-modal__btn:disabled { opacity: 0.3; cursor: not-allowed; }
`
