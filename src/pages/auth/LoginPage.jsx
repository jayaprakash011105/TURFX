import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Eye, EyeOff, Zap, Shield, Building2, User, Mail, Lock, Phone } from 'lucide-react';

export default function LoginPage({ overrideRole }) {
  const { loginWithSupabase, register } = useApp();
  const [mode, setMode] = useState('login'); // login | register
  const [role, setRole] = useState(overrideRole || 'user');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });

  const roles = [
    { id: 'user', label: 'Player', icon: User, color: 'var(--accent-green)', desc: 'Discover & book turfs' },
    { id: 'owner', label: 'Owner', icon: Building2, color: '#5b8def', desc: 'Manage your turfs' },
    { id: 'admin', label: 'Admin', icon: Shield, color: '#8b5cf6', desc: 'Platform control' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        const result = await loginWithSupabase(form.email, form.password, role);
        if (result?.error) setLoading(false);
      } else {
        const result = await register(form.email, form.password, form.name, form.phone, role);
        if (result?.error) { setLoading(false); }
        else { setLoading(false); setMode('login'); }
      }
    } catch (err) {
      console.error('[Login] Unexpected form error:', err);
      setLoading(false);
    }
  };

  const activeRole = roles.find(r => r.id === role);
  const ActiveIcon = activeRole.icon;

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)',
      backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(0,230,118,0.05) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(91,141,239,0.05) 0%, transparent 50%)',
      padding: 20,
    }}>
      {/* Background grid */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg, var(--accent-green), #00a854)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900, color: '#000', boxShadow: '0 0 30px rgba(0,230,118,0.3)' }}>T</div>
            <div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 32, letterSpacing: -1, lineHeight: 1 }}>TURF<span style={{ color: 'var(--accent-green)' }}>X</span></div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 2 }}>SPORTS PLATFORM</div>
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Book premium sports turfs near you</p>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
          {/* Role Selector or Override Heading */}
          {!overrideRole ? (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1 }}>Sign in as</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {roles.map(r => {
                  const Icon = r.icon;
                  return (
                    <button key={r.id} onClick={() => setRole(r.id)}
                      style={{
                        padding: '12px 8px', borderRadius: 12, border: `2px solid ${role === r.id ? r.color : 'var(--border)'}`,
                        background: role === r.id ? `${r.color}15` : 'transparent',
                        color: role === r.id ? r.color : 'var(--text-secondary)',
                        cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                      }}>
                      <Icon size={20} />
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${activeRole.color}20`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: activeRole.color, marginBottom: 12 }}>
                <ActiveIcon size={24} />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>{activeRole.label} Portal</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Sign in to access your {activeRole.label.toLowerCase()} dashboard</p>
            </div>
          )}

          {/* Mode Toggle */}
          <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: 10, padding: 4, marginBottom: 24 }}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => setMode(m)}
                style={{
                  flex: 1, padding: '8px', borderRadius: 8, border: 'none',
                  background: mode === m ? activeRole.color : 'transparent',
                  color: mode === m ? '#000' : 'var(--text-secondary)',
                  fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s',
                  textTransform: 'capitalize',
                }}>
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input className="form-input" style={{ paddingLeft: 36 }} placeholder="Your full name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                </div>
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="form-input" type="email" style={{ paddingLeft: 36 }} placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              </div>
            </div>
            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input className="form-input" style={{ paddingLeft: 36 }} placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                </div>
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="form-input" type={showPass ? 'text' : 'password'} style={{ paddingLeft: 36, paddingRight: 40 }} placeholder="••••••••" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-full" style={{ background: activeRole.color, color: role === 'user' ? '#000' : '#fff', marginTop: 4 }}>
              {loading ? 'Verifying Identity...' : mode === 'login' ? 'Continue Access' : 'Register Securely'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 20 }}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
