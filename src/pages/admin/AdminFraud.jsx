import React, { useState, useMemo } from 'react';
import { useApp } from '../../store/AppContext';
import { ShieldAlert, AlertTriangle, ShieldCheck, Search, Activity, Trash2, Eye } from 'lucide-react';

export default function AdminFraud() {
  const { users, bookings, payments, updateUserStatus, addToast } = useApp();
  const [search, setSearch] = useState('');

  // FRAUD DETECTION ALGORITHM (Live Mocking)
  // Flags a user if they have multiple cancelled bookings or many failed transactions
  const flaggedUsers = useMemo(() => {
    const flags = [];
    
    users.filter(u => u.role === 'user').forEach(user => {
      const userBookings = bookings.filter(b => b.userId === user.id);
      const userPayments = payments.filter(p => p.userId === user.id);

      const cancelCount = userBookings.filter(b => b.status === 'cancelled').length;
      const failedPayCount = userPayments.filter(p => p.status === 'failed' || p.status === 'refunded').length;

      let riskScore = 0;
      let reasons = [];

      if (cancelCount >= 2) {
        riskScore += 45;
        reasons.push(`High Cancellation Rate (${cancelCount} drops)`);
      }
      if (failedPayCount >= 2) {
        riskScore += 55;
        reasons.push(`Frequent Failing Transactions (${failedPayCount} fails)`);
      }

      // If risk score > 0, they are flagged
      if (riskScore > 0) {
        flags.push({
          ...user,
          riskScore: Math.min(riskScore, 100),
          reasons,
          totalBookings: userBookings.length
        });
      }
    });

    return flags.sort((a,b) => b.riskScore - a.riskScore)
                .filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()));
  }, [users, bookings, payments, search]);

  const handleBanUser = (userId, name) => {
    updateUserStatus(userId, 'suspended');
    addToast('error', 'User Suspended', `${name} has been banned for fraudulent activity.`);
  };

  const handleClearFlags = (userId, name) => {
    // In a real app, this would delete fraud flags from the database.
    // Here we can just simulate it with a toast.
    addToast('success', 'Flags Cleared', `${name} is marked as safe.`);
  };

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: 'var(--accent-red)' }}>Fraud Detection & System Alerts</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Real-time automated scanning for malicious platform behavior.</p>
        </div>
        <div style={{ position: 'relative', width: 280 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="form-input" style={{ paddingLeft: 38 }} placeholder="Search flagged identities..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--accent-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><ShieldAlert size={20} /></div>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent-red)' }}>Severe Risk Flags</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-primary)' }}>{flaggedUsers.filter(u => u.riskScore >= 75).length}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Immediate attention required</div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(234,179,8,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-yellow)' }}><AlertTriangle size={20} /></div>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent-yellow)' }}>Monitored Accounts</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-primary)' }}>{flaggedUsers.filter(u => u.riskScore < 75).length}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Suspicious behavioral patterns</div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(0,230,118,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-green)' }}><Activity size={20} /></div>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent-green)' }}>System Health Status</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--accent-green)' }}>99%</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Platform integrity secure</div>
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Automated Risk Ledger</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Flagged Entity</th><th>Contact</th><th>Risk Score</th><th>Detected Patterns</th><th>Status</th><th>Security Action</th></tr>
            </thead>
            <tbody>
              {flaggedUsers.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-red), var(--accent-orange))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#000' }}>{u.name?.[0]}</div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{u.name}</div>
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td>
                    <span style={{ fontWeight: 900, color: u.riskScore >= 75 ? 'var(--accent-red)' : 'var(--accent-yellow)' }}>{u.riskScore}%</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {u.reasons.map((r, i) => <div key={i} style={{ fontSize: 11, color: 'var(--text-muted)' }}>• {r}</div>)}
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${u.status === 'suspended' ? 'red' : 'yellow'}`}>{u.status === 'suspended' ? 'Banned' : 'Monitoring'}</span>
                  </td>
                  <td>
                    {u.status !== 'suspended' ? (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleClearFlags(u.id, u.name)} style={{ padding: '6px 10px' }}><ShieldCheck size={14}/></button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleBanUser(u.id, u.name)} style={{ padding: '6px 10px' }}>Ban Identity</button>
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Security Triggered</span>
                    )}
                  </td>
                </tr>
              ))}
              {flaggedUsers.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: 24, color: 'var(--accent-green)' }}><ShieldCheck size={48} style={{ opacity: 0.5, marginBottom: 12 }} /><br/>No fraudulent activity detected.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
