import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Scale, MessageCircle, CheckCircle2, Ticket, Search, User, Building2 } from 'lucide-react';

export default function AdminDisputes() {
  const { addToast } = useApp();
  const [search, setSearch] = useState('');

  // Initializing mock disputes since they aren't directly in the standard AppContext yet
  const [disputes, setDisputes] = useState([
    { id: 'DSP-1002', type: 'Refund Request', title: 'Turf was closed upon arrival', entityType: 'user', entityName: 'Arjun Mehta', against: 'The Greens Turf Club', status: 'open', priority: 'high', date: '2026-03-24' },
    { id: 'DSP-1011', type: 'Property Damage', title: 'Players broke net fencing', entityType: 'owner', entityName: 'Vikram Shetty', against: 'Rahul M.', status: 'open', priority: 'medium', date: '2026-03-23' },
    { id: 'DSP-0994', type: 'Payment Dispute', title: 'Double charged for booking', entityType: 'user', entityName: 'Sneha P.', against: 'Platform', status: 'resolved', priority: 'low', date: '2026-03-20' },
  ]);

  const handleResolve = (id) => {
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: 'resolved' } : d));
    addToast('success', 'Dispute Resolved', `Ticket ${id} has been formally closed and archived.`);
  };

  const filtered = disputes.filter(d => !search || d.title.toLowerCase().includes(search.toLowerCase()) || d.entityName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}>Disputes & Support Desk</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Triable center for conflicts between platform players and turf owners.</p>
        </div>
        <div style={{ position: 'relative', width: 280 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="form-input" style={{ paddingLeft: 38 }} placeholder="Search tickets..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(249,115,22,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-orange)' }}><Ticket size={24} /></div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent-orange)', letterSpacing: 0.5 }}>OPEN TICKETS</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>PENDING_RESOLUTIONS</div>
            </div>
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-primary)' }}>{disputes.filter(d => d.status === 'open').length}</div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-red)' }}><Scale size={24} /></div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent-red)', letterSpacing: 0.5 }}>HIGH PRIORITY</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>URGENT_AUDIT_REQUIRED</div>
            </div>
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-primary)' }}>{disputes.filter(d => d.status === 'open' && d.priority === 'high').length}</div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(0,230,118,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-green)' }}><CheckCircle2 size={24} /></div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent-green)', letterSpacing: 0.5 }}>RESOLVED CASES</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>SUCCESSFULLY_ARBITRATED</div>
            </div>
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-primary)' }}>{disputes.filter(d => d.status === 'resolved').length}</div>
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Dispute Ledger</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Ticket ID</th><th>Complainant</th><th>Issue Class</th><th>Details</th><th>Status</th><th>Arbitration Action</th></tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-muted)' }}>{d.id}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {d.entityType === 'owner' ? <Building2 size={14} color="var(--accent-blue)"/> : <User size={14} color="var(--accent-green)"/>}
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{d.entityName}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${d.priority === 'high' ? 'red' : d.priority === 'medium' ? 'yellow' : 'blue'}`}>{d.type}</span>
                  </td>
                  <td>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{d.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Against: {d.against} • {d.date}</div>
                  </td>
                  <td>
                    <span className={`badge badge-${d.status === 'resolved' ? 'green' : 'orange'}`}>{d.status}</span>
                  </td>
                  <td>
                    {d.status === 'open' ? (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MessageCircle size={14}/> Contact</button>
                        <button className="btn btn-primary btn-sm" onClick={() => handleResolve(d.id)} style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Scale size={14}/> Resolve</button>
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Case Closed</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>No disputes found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
