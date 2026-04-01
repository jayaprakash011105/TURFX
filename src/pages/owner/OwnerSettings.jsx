import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { User, Mail, Shield, Bell, Lock, Key, ChevronRight, Check, X, Eye, EyeOff, Building2, BellOff, Phone, Activity } from 'lucide-react';
import Modal from '../../components/Modal';

export default function OwnerSettings() {
  const { currentUser, updateToast, addToast } = useApp();
  
  // Security State
  const [isEditable, setIsEditable] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [verificationPass, setVerificationPass] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || 'Vikram Shetty',
    email: currentUser?.email || 'vikram@turfpro.com',
    phone: currentUser?.phone || '+91 90000 11111',
    businessName: 'TurfPro Facilities Pvt Ltd',
    password: '••••••••',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    newBookings: true,
    paymentSuccess: true,
    turfApproval: true,
    marketing: false,
  });

  const handleRequestEdit = () => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsVerifyModalOpen(true);
    setVerificationPass('');
  };

  const handleVerifyPasscode = () => {
    // Shared platform security pass: turfx@123
    if (verificationPass === 'turfx@123') {
      setIsVerifyModalOpen(false);
      setIsEditable(true);
      setVerificationPass('');
      setSuccessMsg('Identity verified. You can now modify your business credentials.');
      addToast('success', 'Unlocked', 'Account settings are now editable');
    } else {
      setErrorMsg('Invalid Master Security Passcode. Access Denied.');
      setVerificationPass('');
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsEditable(false);
    setSuccessMsg('Changes saved successfully! Your profile has been updated.');
    addToast('success', 'Profile Updated', 'Your settings have been saved permanently.');
  };

  const toggleNotif = (key) => {
    setNotifications(p => ({ ...p, [key]: !p[key] }));
  };

  return (
    <div style={{ maxWidth: 850, margin: '0 auto', animateFade: 'fadeIn 0.4s ease' }}>
      
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Account Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>Manage your business profile, security, and notification preferences.</p>
      </div>

      {successMsg && (
        <div style={{ background: 'rgba(0,230,118,0.1)', border: '1px solid var(--accent-green)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, color: 'var(--accent-green)' }}>
          <Check size={18} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--accent-green)', cursor: 'pointer' }}><X size={16} /></button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: 32 }}>
        
        {/* Left Column: Forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          
          {/* Profile Details Card */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(91,141,239,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-blue)' }}>
                  <Building2 size={20} />
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>Business Profile</h2>
              </div>
              {!isEditable && (
                <button onClick={handleRequestEdit} className="btn btn-primary btn-sm" style={{ padding: '8px 16px' }}>
                  <Lock size={14} /> Authenticate to Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSaveProfile} style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={profileForm.name} disabled={!isEditable} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} style={{ opacity: isEditable ? 1 : 0.6 }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Business Email</label>
                  <input className="form-input" value={profileForm.email} disabled={!isEditable} onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))} style={{ opacity: isEditable ? 1 : 0.6 }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" value={profileForm.phone} disabled={!isEditable} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} style={{ opacity: isEditable ? 1 : 0.6 }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Registered Business Name</label>
                  <input className="form-input" value={profileForm.businessName} disabled={!isEditable} onChange={e => setProfileForm(p => ({ ...p, businessName: e.target.value }))} style={{ opacity: isEditable ? 1 : 0.6 }} />
                </div>
              </div>

              {isEditable && (
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px dashed var(--border)', marginBottom: 24 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Key size={14} /> Update Security Pass</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <input className="form-input" type="password" placeholder="Min 8 characters" value={profileForm.newPassword} onChange={e => setProfileForm(p => ({ ...p, newPassword: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Confirm Passphrase</label>
                      <input className="form-input" type="password" value={profileForm.confirmPassword} onChange={e => setProfileForm(p => ({ ...p, confirmPassword: e.target.value }))} />
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" className="btn btn-primary" disabled={!isEditable} style={{ width: 140 }}>Save Changes</button>
                {isEditable && <button type="button" className="btn btn-ghost" onClick={() => setIsEditable(false)}>Cancel</button>}
              </div>
            </form>
          </div>

          {/* Preferences Card */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20 }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(249,115,22,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-orange)' }}>
                <Bell size={20} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Alert Preferences</h2>
            </div>
            <div style={{ padding: '12px 24px' }}>
              {[
                { id: 'newBookings', label: 'Real-time Booking Alerts', desc: 'Get notified as soon as a customer books your turf' },
                { id: 'paymentSuccess', label: 'Payment Confirmations', desc: 'Receive instant alerts for successful transactions' },
                { id: 'turfApproval', label: 'Platform Status Updates', desc: 'Alerts regarding your turf listings approval/rejection' },
                { id: 'marketing', label: 'Growth & Promotions', desc: 'Periodic tips and insights to grow your sport business' },
              ].map(item => (
                <div key={item.id} style={{ padding: '16px 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.desc}</div>
                  </div>
                  <button 
                    onClick={() => toggleNotif(item.id)}
                    style={{ 
                      width: 44, height: 24, borderRadius: 20, border: 'none', 
                      background: notifications[item.id] ? 'var(--accent-green)' : 'var(--border)', 
                      position: 'relative', cursor: 'pointer', transition: 'all 0.3s' 
                    }}
                  >
                    <div style={{ 
                      width: 18, height: 18, borderRadius: '50%', background: '#fff', 
                      position: 'absolute', top: 3, left: notifications[item.id] ? 23 : 3, 
                      transition: 'all 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' 
                    }} />
                  </button>
                </div>
              ))}
            </div>
            <div style={{ padding: '24px', textAlign: 'center' }}>
               <button className="btn btn-secondary btn-full" style={{ borderStyle: 'dashed' }}>
                 Configure Secondary Notification Email
               </button>
            </div>
          </div>
        </div>

        {/* Right Column: Info & Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 24, textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #5b8def, #8b5cf6)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 900, color: '#fff', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}>V</div>
            <h3 style={{ fontSize: 18, fontWeight: 800 }}>{currentUser?.name}</h3>
            <p style={{ color: 'var(--accent-blue)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>Platform Partner</p>
            <div style={{ display: 'flex', borderTop: '1px solid var(--border)', paddingTop: 20, marginTop: 4 }}>
              <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid var(--border)' }}>
                <div style={{ fontSize: 18, fontWeight: 900 }}>3</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>TURFS</div>
              </div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 900 }}>4.8</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>RATING</div>
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(0,230,118,0.05)', border: '1px solid rgba(0,230,118,0.2)', borderRadius: 20, padding: 20 }}>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-green)', textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Activity size={12} className="animate-pulse" /> Live Status
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                 <span style={{ color: 'var(--text-muted)' }}>Email Sync</span>
                 <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>Connected</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                 <span style={{ color: 'var(--text-muted)' }}>Auth Method</span>
                 <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>2-Step Verified</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                 <span style={{ color: 'var(--text-muted)' }}>Last Audit</span>
                 <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Today, 09:42 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      <Modal 
        isOpen={isVerifyModalOpen} 
        onClose={() => setIsVerifyModalOpen(false)} 
        title="Security Verification"
      >
          <div style={{ padding: '0 8px 8px' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(139,92,246,0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6', marginBottom: 16 }}>
                <Shield size={28} />
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.5 }}>You must enter the top-secret 2-step verification pass to unlock your business credentials.</p>
            </div>

            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label">Master Security Passcode</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  className="form-input" 
                  style={{ paddingLeft: 40, border: errorMsg ? '1px solid var(--accent-red)' : '1px solid var(--border)' }}
                  placeholder="Enter Passcode..." 
                  value={verificationPass}
                  onChange={(e) => { setVerificationPass(e.target.value); setErrorMsg(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleVerifyPasscode()}
                  autoFocus
                />
              </div>
              {errorMsg && <p style={{ fontSize: 11, color: 'var(--accent-red)', marginTop: 6, fontWeight: 500 }}>{errorMsg}</p>}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-ghost btn-full" onClick={() => setIsVerifyModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary btn-full" onClick={handleVerifyPasscode}>Verify & Unlock</button>
            </div>
          </div>
        </Modal>
      </div>
  );
}
