import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { User, Mail, Phone, Camera, Save, Zap, Star, Calendar, CreditCard } from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, userBookings, addToast } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
  });

  const handleSave = () => {
    setEditing(false);
    addToast('success', 'Profile Updated', 'Your changes have been saved');
  };

  const stats = [
    { label: 'Total Deployments', value: userBookings.length, icon: <Calendar size={18} />, color: 'var(--accent-green)' },
    { label: 'Past Executions', value: userBookings.filter(b => b.status === 'completed').length, icon: <Star size={18} />, color: 'var(--accent-blue)' },
    { label: 'Capital Invested', value: `₹${userBookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + b.amount, 0).toLocaleString()}`, icon: <CreditCard size={18} />, color: 'var(--accent-purple)' },
  ];

  return (
    <div className="container animate-fade" style={{ paddingBottom: 100 }}>
      {/* Header */}
      <h1 style={{ fontWeight: 900, marginBottom: 32, fontSize: window.innerWidth < 768 ? 28 : 32, letterSpacing: -1 }}>Athletic Identity</h1>

      {/* Profile Header Card */}
      <div className="card" style={{ padding: window.innerWidth < 768 ? '24px' : '32px', marginBottom: 24, display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap', position: 'relative', overflow: 'hidden', border: '1px solid var(--border)' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 250, height: 250, background: 'var(--accent-green-glow)', borderRadius: '0 0 0 250px', opacity: 0.15, zIndex: 0 }}></div>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ width: window.innerWidth < 768 ? 80 : 100, height: window.innerWidth < 768 ? 80 : 100, borderRadius: 24, background: 'linear-gradient(135deg, var(--accent-green), var(--accent-blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: window.innerWidth < 768 ? 32 : 40, fontWeight: 900, color: '#000', boxShadow: '0 10px 40px rgba(0,230,118,0.3)' }}>{currentUser?.name?.[0]}</div>
          <button style={{ position: 'absolute', bottom: -8, right: -8, width: 32, height: 32, borderRadius: 10, background: 'var(--accent-green)', border: '4px solid var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-lg)' }}>
            <Camera size={14} color="#000" strokeWidth={3} />
          </button>
        </div>
        
        <div style={{ flex: 1, minWidth: 200, zIndex: 1 }}>
          <h2 style={{ fontSize: window.innerWidth < 768 ? 24 : 28, fontWeight: 900, marginBottom: 8, letterSpacing: -0.5 }}>{currentUser?.name}</h2>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}><Mail size={14} /> {currentUser?.email}</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className={`badge ${currentUser?.subscription === 'premium' ? 'badge-green' : 'badge-blue'}`} style={{ fontWeight: 900, fontSize: 10, letterSpacing: 1 }}>
              <Zap size={10} fill="currentColor" /> {currentUser?.subscription === 'premium' ? 'PREMIUM' : 'BASE'} PROTOCOL
            </span>
          </div>
        </div>

        <button className="btn btn-secondary" onClick={() => setEditing(!editing)} style={{ zIndex: 1, width: window.innerWidth < 768 ? '100%' : 'auto', height: 44, borderRadius: 12, fontWeight: 800 }}>
          {editing ? 'ABORT_MODIFICATION' : 'MODIFY_MANIFEST'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-mobile-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {stats.map(s => (
          <div key={s.label} className="card" style={{ padding: '24px 20px', textAlign: 'center', border: `1px solid ${s.color}20`, background: 'var(--bg-secondary)' }}>
            <div style={{ color: s.color, marginBottom: 16, display: 'flex', justifyContent: 'center', opacity: 0.9 }}>{s.icon}</div>
            <div style={{ fontSize: window.innerWidth < 768 ? 24 : 32, fontWeight: 900, color: s.color, letterSpacing: -1 }}>{s.value}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 8 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-mobile-1" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 32, alignItems: 'start' }}>
        {/* Profile Info Form */}
        <div className="card" style={{ padding: window.innerWidth < 768 ? '24px 20px' : '32px' }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10, letterSpacing: -0.5 }}><User size={20} color="var(--accent-green)" /> Personal Manifest</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {[
              { label: 'OPERATOR_NAME', key: 'name', icon: <User size={16} />, type: 'text' },
              { label: 'COMMUNICATION_RELAY', key: 'email', icon: <Mail size={16} />, type: 'email' },
              { label: 'VOICE_CHANNEL', key: 'phone', icon: <Phone size={16} />, type: 'tel' },
            ].map(f => (
              <div key={f.key} className="form-group">
                <label className="form-label" style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase' }}>{f.label}</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>{f.icon}</div>
                  <input className="form-input" style={{ paddingLeft: 44, height: 48, borderRadius: 14, background: editing ? 'rgba(255,255,255,0.03)' : 'var(--bg-secondary)', fontWeight: 700, fontSize: 14, color: editing ? 'var(--text-primary)' : 'var(--text-secondary)' }} type={f.type}
                    value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} disabled={!editing} />
                </div>
              </div>
            ))}
            {editing && (
              <button className="btn btn-primary btn-full animate-glow" onClick={handleSave} style={{ height: 52, borderRadius: 16, fontWeight: 900, fontSize: 14, letterSpacing: 1 }}>
                <Save size={18} strokeWidth={2.5} /> COMMIT_CHANGES
              </button>
            )}
          </div>
        </div>

        {/* Preferences */}
        <div className="card" style={{ padding: window.innerWidth < 768 ? '24px 20px' : '32px' }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 24, letterSpacing: -0.5 }}>System Preferences</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Deployment Alerts', desc: 'Confirmations & transaction receipts', checked: true },
              { label: 'Window Reminders', desc: '1 hour prior to operational kickoff', checked: true },
              { label: 'Marketing Signals', desc: 'Exclusive partner campaigns', checked: false },
            ].map(pref => (
              <div key={pref.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800 }}>{pref.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>{pref.desc}</div>
                </div>
                <div style={{ width: 44, height: 24, borderRadius: 12, background: pref.checked ? 'var(--accent-green)' : 'var(--bg-secondary)', cursor: 'pointer', position: 'relative', transition: 'all 0.3s', border: `1px solid ${pref.checked ? 'var(--accent-green)' : 'var(--border)'}` }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: pref.checked ? 22 : 2, transition: 'all 0.3s', boxShadow: 'var(--shadow-sm)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
