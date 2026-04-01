import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Calendar, MapPin, Clock, CheckCircle, XCircle, Search, Filter } from 'lucide-react';

export default function OwnerBookingsPage() {
  const { ownerBookings, cancelBooking } = useApp();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = ownerBookings
    .filter(b => filter === 'all' || b.status === filter)
    .filter(b => !search || b.turfName?.toLowerCase().includes(search.toLowerCase()) || b.userId?.includes(search))
    .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

  const STATUS = { confirmed: 'green', completed: 'blue', cancelled: 'red' };
  const tabs = ['all', 'confirmed', 'completed', 'cancelled'];

  return (
    <div className="container animate-fade" style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontWeight: 900, marginBottom: 4 }}>Booking Registry</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 500 }}>Tracking {ownerBookings.length} total operational sessions</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-mobile-1" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 12, marginBottom: 24, alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="form-input" style={{ paddingLeft: 36 }} placeholder="Search IDs, Turfs, or Athletes..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: 5, borderRadius: 14, gap: 4, overflowX: 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              style={{ 
                padding: '8px 16px', borderRadius: 11, border: 'none', 
                background: filter === t ? 'var(--bg-card)' : 'transparent', 
                color: filter === t ? 'var(--text-primary)' : 'var(--text-muted)', 
                fontWeight: filter === t ? 800 : 500, fontSize: 12, 
                cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize',
                whiteSpace: 'nowrap'
              }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Data View - Desktop Table, Mobile Cards */}
      <div className="table-wrapper hide-mobile animate-fade" style={{ background: 'var(--bg-secondary)', borderRadius: 20, overflow: 'hidden', marginBottom: 24 }}>
        <table style={{ margin: 0 }}>
          <thead style={{ background: 'rgba(255,255,255,0.02)' }}>
            <tr>
              <th style={{ padding: '16px 20px', fontSize: 11, fontWeight: 800 }}>TX_ID</th>
              <th style={{ padding: '16px 20px', fontSize: 11, fontWeight: 800 }}>ASSET_INTEL</th>
              <th style={{ padding: '16px 20px', fontSize: 11, fontWeight: 800 }}>ATHLETE</th>
              <th style={{ padding: '16px 20px', fontSize: 11, fontWeight: 800 }}>TIMESTAMP</th>
              <th style={{ padding: '16px 20px', fontSize: 11, fontWeight: 800 }}>YIELD</th>
              <th style={{ padding: '16px 20px', fontSize: 11, fontWeight: 800 }}>STATUS</th>
              <th style={{ padding: '16px 20px', fontSize: 11, fontWeight: 800 }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '16px 20px', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-muted)' }}>#{b.id.toUpperCase()}</td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ fontWeight: 800, fontSize: 13 }}>{b.turfName}</div>
                  <div style={{ fontSize: 10, color: 'var(--accent-blue)', fontWeight: 700 }}>FIELD_0{b.court}</div>
                </td>
                <td style={{ padding: '16px 20px', fontSize: 13, fontWeight: 600 }}>{b.userId}</td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{new Date(b.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{b.startTime}–{b.endTime}</div>
                </td>
                <td style={{ padding: '16px 20px' }}>
                   <div style={{ fontWeight: 900, fontSize: 15, color: 'var(--accent-green)' }}>₹{b.amount}</div>
                   <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 800 }}>{b.paymentStatus.toUpperCase()}</div>
                </td>
                <td style={{ padding: '16px 20px' }}>
                   <span className={`badge badge-${STATUS[b.status] || 'blue'}`} style={{ fontSize: 9 }}>{b.status.toUpperCase()}</span>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  {b.status === 'confirmed' && (
                    <button className="btn btn-danger btn-xs" style={{ padding: '6px 14px' }} onClick={() => cancelBooking(b.id)}>VOID</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="hide-desktop" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(b => (
           <div key={b.id} className="card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: b.status === 'confirmed' ? 'var(--accent-green)' : 'var(--text-muted)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                 <div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800, marginBottom: 4 }}>ID: {b.id.toUpperCase()}</div>
                    <div style={{ fontSize: 16, fontWeight: 900 }}>{b.turfName}</div>
                    <div style={{ fontSize: 11, color: 'var(--accent-blue)', fontWeight: 700 }}>Court {b.court}</div>
                 </div>
                 <div className={`badge badge-${STATUS[b.status] || 'blue'}`} style={{ fontSize: 9 }}>{b.status.toUpperCase()}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, background: 'var(--bg-secondary)', padding: '14px', borderRadius: 12, marginBottom: 16 }}>
                 <div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800 }}>TIMELINE</div>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{b.date}</div>
                    <div style={{ fontSize: 11, fontWeight: 600 }}>{b.startTime} - {b.endTime}</div>
                 </div>
                 <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800 }}>PAYMENT</div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--accent-green)' }}>₹{b.amount}</div>
                    <div style={{ fontSize: 10, fontWeight: 700 }}>{b.paymentStatus.toUpperCase()}</div>
                 </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ fontSize: 12, fontWeight: 700 }}>Athlete: <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{b.userId}</span></div>
                 {b.status === 'confirmed' && (
                    <button className="btn btn-danger btn-sm" onClick={() => cancelBooking(b.id)}>Void Session</button>
                 )}
              </div>
           </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card animate-fade" style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>📑</div>
          <h3 style={{ fontWeight: 900 }}>No Registry Matches</h3>
          <p style={{ fontSize: 14, fontWeight: 500 }}>No entries found for the selected filter or criteria.</p>
        </div>
      )}
    </div>
  );
}
