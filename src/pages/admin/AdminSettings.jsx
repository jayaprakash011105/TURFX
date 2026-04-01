import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { 
  Shield, Lock, Mail, User, Phone, 
  Smartphone, Activity, Key, CheckCircle2,
  Eye, EyeOff, Save, X, Unlock
} from 'lucide-react';
import Modal from '../../components/Modal';

export default function AdminSettings() {
  const { currentUser, notificationEmail, setNotificationEmail } = useApp();
  
  // Fake state for toggles
  const [prefs, setPrefs] = useState({
    emailAlerts: true,
    smsAlerts: false,
    newTurfAlerts: true,
    suspiciousActivity: true,
    twoFactor: true
  });

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    email: currentUser?.email || "admin@turfx.com",
    newPassword: '',
  });

  const [showPass, setShowPass] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [verificationPass, setVerificationPass] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const togglePref = (key) => setPrefs(prev => ({ ...prev, [key]: !prev[key] }));

  // Flow step 1: Request unlock
  const handleRequestEdit = () => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsVerifyModalOpen(true);
    setVerificationPass('');
  };

  // Flow step 2: Verify passcode to unlock editing
  const handleVerifyPasscode = () => {
    if (verificationPass === 'turfx@123') {
      setIsVerifyModalOpen(false);
      setIsEditable(true);
      setVerificationPass(''); // Clear for security
      setSuccessMsg('Editing unlocked. You may now update your credentials.');
    } else {
      setErrorMsg('Invalid 2-Step Verification Code.');
      setVerificationPass(''); // Reset on failure too
    }
  };

  // Flow step 3: Save changes and lock again
  const handleSaveCredentials = () => {
    setIsEditable(false); // Lock editing again
    setSuccessMsg('Core credentials successfully updated & re-locked!');
    // Real app: dispatch API call to save to backend here
  };

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}>Account & Security Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Manage your Super Admin profile, session security, and global notification preferences.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24, maxWidth: 800 }}>
        
        {successMsg && (
          <div className="animate-fade" style={{ background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.3)', padding: 16, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12, color: 'var(--accent-green)', fontWeight: 600 }}>
            <CheckCircle2 size={20} />
            {successMsg}
          </div>
        )}

        {/* Core Profile Card */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(139,92,246,0.05)' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #8b5cf6, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Shield size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Super Admin Profile</h2>
              <p style={{ fontSize: 12, color: 'var(--accent-purple)' }}>Global Platform Authority</p>
            </div>
            {/* Lock Status Badge */}
            <div style={{ marginLeft: 'auto' }}>
              {isEditable ? (
                <span className="badge badge-green" style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Unlock size={12} /> Unlocked</span>
              ) : (
                <span className="badge badge-red" style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Lock size={12} /> Locked</span>
              )}
            </div>
          </div>
          
          <div style={{ padding: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><User size={14} /> Full Name</label>
                <input type="text" className="form-input" value={currentUser?.name || "TURFX Super Admin"} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>Name change requires database migration.</div>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Key size={14} /> Authority Level</label>
                <input type="text" className="form-input" value="Root / Super Administrator" disabled style={{ opacity: 0.6, cursor: 'not-allowed', color: 'var(--accent-red)', fontWeight: 700 }} />
              </div>
              
              {/* Login Credentials - Conditionally editable */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Mail size={14} /> Login Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={profileForm.email} 
                  onChange={(e) => setProfileForm(p => ({ ...p, email: e.target.value }))}
                  disabled={!isEditable}
                  style={{ opacity: !isEditable ? 0.6 : 1, transition: 'all 0.3s' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Lock size={14} /> New Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPass ? "text" : "password"} 
                    className="form-input" 
                    placeholder={!isEditable ? "••••••••" : "Enter new password (optional)"}
                    style={{ paddingRight: 40, opacity: !isEditable ? 0.6 : 1, transition: 'all 0.3s' }}
                    value={profileForm.newPassword} 
                    onChange={(e) => setProfileForm(p => ({ ...p, newPassword: e.target.value }))}
                    disabled={!isEditable}
                  />
                  {isEditable && (
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: 20 }}>
              {!isEditable ? (
                <button onClick={handleRequestEdit} className="btn btn-secondary">
                  <Unlock size={16} color="var(--accent-green)" /> Authenticate to Edit
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => { setIsEditable(false); setSuccessMsg(''); setErrorMsg(''); }} className="btn btn-ghost">Cancel</button>
                  <button onClick={handleSaveCredentials} className="btn btn-primary" style={{ background: 'var(--accent-purple)', color: '#fff' }}>
                    <Save size={16} /> Save Admin Credentials
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Security & Access Card */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16 }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(91,141,239,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5b8def' }}>
              <Lock size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Security & Sessions</h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Manage your active authentications.</p>
            </div>
          </div>
          
          <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px dashed var(--border)', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  Two-Factor Authentication (2FA) <span className="badge badge-green">Enabled</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Require a cryptographic token during login.</div>
              </div>
              <button className="btn btn-secondary btn-sm" disabled style={{ cursor: 'not-allowed', opacity: 0.5 }}>Manage 2FA</button>
            </div>

            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Active Sessions</div>
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Smartphone size={24} color="var(--text-secondary)" />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      Windows 11 • Chrome 
                      <CheckCircle2 size={14} color="var(--accent-green)" />
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Delhi, India • IP: 103.24.xx.xx • Current Session</div>
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm">Revoke</button>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Sync Gateway Card */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16 }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(0,230,118,0.02)' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(0,230,118,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-green)' }}>
              <Mail size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>System Notification Gateway</h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Configure where platform-wide email alerts are dispatched.</p>
            </div>
          </div>
          <div style={{ padding: 24 }}>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                Primary Alert Email ID
                <span style={{ fontSize: 11, color: 'var(--accent-green)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Activity size={10} className="animate-pulse" /> Live Real-time Sync
                </span>
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="email" 
                  className="form-input" 
                  value={notificationEmail} 
                  onChange={(e) => setNotificationEmail(e.target.value)}
                  disabled={!isEditable}
                  placeholder="e.g. alerts@turfx.com"
                  style={{ opacity: !isEditable ? 0.6 : 1, transition: 'all 0.3s', paddingRight: 100 }}
                />
                {!isEditable && (
                  <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>
                    LOCKED
                  </div>
                )}
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}> All critical notifications including bookings, settlements, and security alerts will be mirrored to this address instantly.</p>
            </div>
            
            <button 
              className="btn btn-secondary btn-sm" 
              style={{ width: '100%', height: 40, borderStyle: 'dashed' }}
              disabled={!isEditable}
              onClick={() => {
                alert(`Test Alert Dispatched to ${notificationEmail}! Check the activity logs.`);
              }}
            >
              Dispatch Test Alert to Gateway
            </button>
          </div>
        </div>

        {/* Global Notifications Card */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16 }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(0,230,118,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00e676' }}>
              <Activity size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>System Alert Preferences</h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Configure what platform events notify you.</p>
            </div>
          </div>
          
          <div style={{ padding: 24 }}>
            {[
              { id: 'emailAlerts', title: 'Daily Report Emails', desc: 'Receive a midnight email containing platform revenue and bookings.' },
              { id: 'newTurfAlerts', title: 'New Turf Approvals', desc: 'Push notifications when a new turf applies for platform entry.' },
              { id: 'suspiciousActivity', title: 'Suspicious Activity Alerts', desc: 'Immediate alerts regarding fraud detection or mass cancellations.', color: 'var(--accent-red)' },
            ].map(setting => (
              <div key={setting.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: setting.color || 'var(--text-primary)' }}>{setting.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{setting.desc}</div>
                </div>
                <div 
                  onClick={() => togglePref(setting.id)}
                  style={{ 
                    width: 44, height: 24, borderRadius: 12, cursor: 'pointer', position: 'relative', transition: 'var(--transition)',
                    background: prefs[setting.id] ? 'var(--accent-green)' : 'var(--bg-glass-border)'
                  }}
                >
                  <div style={{ 
                    position: 'absolute', top: 2, left: prefs[setting.id] ? 22 : 2,
                    width: 20, height: 20, borderRadius: '50%', background: '#fff',
                    transition: 'var(--transition)', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <Modal isOpen={isVerifyModalOpen} onClose={() => setIsVerifyModalOpen(false)}>
        <div className="animate-fade" style={{ maxWidth: 400, background: 'var(--bg-card)', borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)' }}>
          <div className="modal-header">
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Security Verification</h3>
            <button 
              onClick={() => setIsVerifyModalOpen(false)} 
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>
          <div className="modal-body">
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
              You must enter the top-secret 2-step verification pass to unlock the core credential input fields.
            </p>
            
            {errorMsg && (
              <div className="animate-fade" style={{ color: 'var(--accent-red)', fontSize: 13, marginBottom: 12, background: 'rgba(239,68,68,0.1)', padding: '8px 12px', borderRadius: 8 }}>
                {errorMsg}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Master Passcode</label>
              <input 
                type="password" 
                className="form-input" 
                autoFocus
                placeholder="Enter passcode to unlock..."
                value={verificationPass}
                onChange={(e) => setVerificationPass(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleVerifyPasscode()}
              />
            </div>
          </div>
          <div className="modal-footer" style={{ borderTop: '1px solid var(--border)', padding: 24, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost" onClick={() => setIsVerifyModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleVerifyPasscode}>Verify & Unlock</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
