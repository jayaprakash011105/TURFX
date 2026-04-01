import React from 'react';
import { useApp } from '../store/AppContext';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const icons = {
  success: <CheckCircle size={18} color="var(--accent-green)" />,
  error: <XCircle size={18} color="var(--accent-red)" />,
  info: <Info size={18} color="var(--accent-blue)" />,
  warning: <AlertTriangle size={18} color="var(--accent-orange)" />,
};

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          {icons[t.type]}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{t.title}</div>
            {t.message && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{t.message}</div>}
          </div>
          <button onClick={() => removeToast(t.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 2 }}>
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
