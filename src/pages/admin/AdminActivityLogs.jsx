import React, { useState, useMemo } from 'react';
import { useApp } from '../../store/AppContext';
import { Activity, Shield, User, Building2, CreditCard, Search, Filter, Clock, CheckCircle, AlertCircle, X, ExternalLink } from 'lucide-react';
import Modal from '../../components/Modal';

export default function AdminActivityLogs() {
  const { addToast, activityLogs, setActivityLogs } = useApp();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState(null);

  const logs = activityLogs;
  const setLogs = setActivityLogs;

  const categories = [
    { id: 'all', label: 'All Logs', icon: <Activity size={14} /> },
    { id: 'security', label: 'Security', icon: <Shield size={14} /> },
    { id: 'management', label: 'Turf Management', icon: <Building2 size={14} /> },
    { id: 'user', label: 'User Actions', icon: <User size={14} /> },
    { id: 'financial', label: 'Financial', icon: <CreditCard size={14} /> },
  ];

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = log.action.toLowerCase().includes(search.toLowerCase()) || 
                            log.user.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = activeFilter === 'all' || log.category === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [logs, search, activeFilter]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'success': return 'var(--accent-green)';
      case 'warning': return 'var(--accent-yellow)';
      case 'danger': return 'var(--accent-red)';
      default: return 'var(--text-muted)';
    }
  };

  const clearLogs = () => {
    if (window.confirm('Are you sure you want to archive and clear all current activity logs?')) {
      setLogs([]);
      addToast('success', 'Logs Archived', 'Entire activity history has been cleared and stored in long-term archive.');
    }
  };

  return (
<div className="container animate-fade" style={{ paddingBottom: 80 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontWeight: 900, marginBottom: 0 }}>Audit Registry</h1>
            <div className="status-dot online animate-pulse" style={{ width: 8, height: 8, boxShadow: '0 0 10px var(--accent-green)' }} title="Live Intel Sync" />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}>Platform-wide mission-critical event stream</p>
        </div>
        <div style={{ display: 'flex', gap: 12, flex: 1, justifyContent: 'flex-end', minWidth: 300 }} className="grid-mobile-1">
          <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" style={{ paddingLeft: 42, height: 48, borderRadius: 14 }} placeholder="Search IDs, Actors, or Events..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-secondary" style={{ height: 48, borderRadius: 14, padding: '0 24px', fontWeight: 800, fontSize: 13 }} onClick={clearLogs}>ARCHIVE ALL</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 32, overflowX: 'auto', paddingBottom: 8, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        {categories.map(cat => (
          <button 
            key={cat.id} 
            onClick={() => setActiveFilter(cat.id)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: 10, padding: '12px 24px', borderRadius: 16, border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.2s', fontSize: 13, fontWeight: 800, whiteSpace: 'nowrap',
              background: activeFilter === cat.id ? 'var(--bg-card)' : 'var(--bg-secondary)',
              borderColor: activeFilter === cat.id ? 'var(--accent-blue)' : 'var(--border)',
              color: activeFilter === cat.id ? 'var(--accent-blue)' : 'var(--text-secondary)',
              boxShadow: activeFilter === cat.id ? '0 10px 20px -5px rgba(59,130,246,0.15)' : 'none'
            }}
          >
            {cat.icon} {cat.label.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border)' }}>
        <div className="table-wrapper animate-fade">
          <table style={{ margin: 0 }}>
            <thead style={{ background: 'rgba(255,255,255,0.02)' }}>
              <tr>
                <th style={{ padding: '18px 24px', fontSize: 11, fontWeight: 900 }}>EVENT_TYPE</th>
                <th style={{ padding: '18px 24px', fontSize: 11, fontWeight: 900 }}>CATEGORY</th>
                <th style={{ padding: '18px 24px', fontSize: 11, fontWeight: 900 }}>ACTOR_ID</th>
                <th style={{ padding: '18px 24px', fontSize: 11, fontWeight: 900 }}>TIMESTAMP</th>
                <th style={{ padding: '18px 24px', fontSize: 11, fontWeight: 900 }}>STATUS</th>
                <th style={{ padding: '18px 24px', textAlign: 'center', fontSize: 11, fontWeight: 900 }}>BRIEF</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '18px 24px' }}>
                    <div style={{ fontWeight: 800, fontSize: 13 }}>{log.action}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: 700 }}>#{log.id.toUpperCase()}</div>
                  </td>
                  <td style={{ padding: '18px 24px' }}>
                    <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, color: log.category === 'security' ? 'var(--accent-yellow)' : 'var(--text-muted)' }}>
                      {log.category.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '18px 24px', fontWeight: 800, fontSize: 13, color: 'var(--text-secondary)' }}>{log.user}</td>
                  <td style={{ padding: '18px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>
                      <Clock size={14} /> {log.time}
                    </div>
                  </td>
                  <td style={{ padding: '18px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: getStatusColor(log.status), boxShadow: `0 0 10px ${getStatusColor(log.status)}` }} />
                      <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: getStatusColor(log.status) }}>{log.status}</span>
                    </div>
                  </td>
                  <td style={{ padding: '18px 24px', textAlign: 'center' }}>
                    <button 
                      onClick={() => setSelectedLog(log)}
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer', width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)' }}
                      className="hover-lift"
                    >
                      <ExternalLink size={15} strokeWidth={2.5} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: 64, color: 'var(--text-muted)', fontWeight: 800 }}>NO AUDIT MATCHES DETECTED</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!selectedLog} onClose={() => setSelectedLog(null)}>
        {selectedLog && (
          <div className="animate-fade" style={{ width: '100%', maxWidth: 520, margin: '0 20px', background: 'var(--bg-card)', padding: 0, borderRadius: 32, overflow: 'hidden', border: `1px solid ${getStatusColor(selectedLog.status)}40`, boxShadow: `0 40px 100px -20px rgba(0,0,0,0.6)` }}>
            <div style={{ padding: '32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 54, height: 54, borderRadius: 18, background: `${getStatusColor(selectedLog.status)}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: getStatusColor(selectedLog.status) }}>
                  {selectedLog.category === 'security' ? <Shield size={28} strokeWidth={2.5} /> : selectedLog.category === 'management' ? <Building2 size={28} strokeWidth={2.5} /> : selectedLog.category === 'financial' ? <CreditCard size={28} strokeWidth={2.5} /> : <User size={28} strokeWidth={2.5} />}
                </div>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 2 }}>Incident Briefing</h3>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>TXN_HASH: {selectedLog.id.toUpperCase()}</div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLog(null)} 
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer', width: 38, height: 38, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                className="hover-lift"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>
            
            <div style={{ padding: '40px' }}>
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>Automated Event Trigger</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.25, letterSpacing: -0.5 }}>{selectedLog.action}</div>
              </div>

              <div className="grid grid-mobile-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
                <div style={{ padding: '18px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 20 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 900, marginBottom: 8, letterSpacing: 1 }}>Authorized User</div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>{selectedLog.user}</div>
                  <div style={{ fontSize: 10, color: 'var(--accent-blue)', fontWeight: 800, marginTop: 4 }}>VERIFIED_ADMIN</div>
                </div>
                <div style={{ padding: '18px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 20 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 900, marginBottom: 8, letterSpacing: 1 }}>System Time</div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>{selectedLog.time}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, marginTop: 4 }}>SYNCED_NTP</div>
                </div>
              </div>

              <div style={{ padding: '28px', background: `${getStatusColor(selectedLog.status)}06`, borderRadius: 24, border: `1px solid ${getStatusColor(selectedLog.status)}20`, marginBottom: 32, position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: 10, color: getStatusColor(selectedLog.status), textTransform: 'uppercase', fontWeight: 900, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10, letterSpacing: 1.2 }}>
                   <div style={{ width: 8, height: 8, borderRadius: '50%', background: getStatusColor(selectedLog.status) }} /> Security Intel
                </div>
                <div style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7, fontWeight: 600 }}>
                  {selectedLog.details}
                </div>
              </div>

              <button 
                className="btn btn-full" 
                style={{ 
                  height: 60, background: getStatusColor(selectedLog.status), color: selectedLog.status === 'warning' ? '#000' : '#fff', fontWeight: 900, fontSize: 16, borderRadius: 18, 
                  boxShadow: `0 15px 35px ${getStatusColor(selectedLog.status)}40`, border: 'none', letterSpacing: 1
                }}
                onClick={() => setSelectedLog(null)}
              >
                RETAIN & CLOSE AUDIT
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
