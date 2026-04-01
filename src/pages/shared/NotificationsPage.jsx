import React from 'react';
import { useApp } from '../../store/AppContext';
import { Bell, Check, CheckCheck, Calendar, DollarSign, Tag, Clock } from 'lucide-react';

const typeIcons = {
  booking: <Calendar size={16} />,
  payment: <DollarSign size={16} />,
  offer: <Tag size={16} />,
  reminder: <Clock size={16} />,
};
const typeColors = {
  booking: 'var(--accent-green)',
  payment: 'var(--accent-blue)',
  offer: 'var(--accent-orange)',
  reminder: 'var(--accent-purple)',
};

export default function NotificationsPage() {
  const { notifications, markNotifRead, markAllRead } = useApp();
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Notifications</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{unread} unread notifications</p>
        </div>
        {unread > 0 && (
          <button className="btn btn-secondary btn-sm" onClick={markAllRead}><CheckCheck size={14} /> Mark All Read</button>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {notifications.map(n => (
          <div key={n.id} onClick={() => markNotifRead(n.id)}
            style={{ background: n.read ? 'var(--bg-card)' : 'var(--bg-card-hover)', border: `1px solid ${n.read ? 'var(--border)' : typeColors[n.type] + '30'}`, borderRadius: 14, padding: '16px', cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'flex-start', transition: 'all 0.2s', position: 'relative' }}>
            {!n.read && <div style={{ position: 'absolute', top: 14, right: 14, width: 8, height: 8, borderRadius: '50%', background: typeColors[n.type] }} />}
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `${typeColors[n.type]}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: typeColors[n.type], flexShrink: 0 }}>
              {typeIcons[n.type]}
            </div>
            <div>
              <div style={{ fontWeight: n.read ? 500 : 700, fontSize: 14, marginBottom: 4 }}>{n.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{n.message}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>{n.time}</div>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔔</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>No notifications</div>
          </div>
        )}
      </div>
    </div>
  );
}
