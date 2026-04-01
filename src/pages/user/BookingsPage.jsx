import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Calendar, MapPin, Clock, CheckCircle, XCircle, RotateCcw, Star, Filter, ChevronDown } from 'lucide-react';

const STATUS_COLORS = {
  confirmed: 'green', completed: 'blue', cancelled: 'red', pending: 'yellow',
};

export default function BookingsPage({ setActivePage, setSelectedTurf }) {
  const { userBookings, turfs, cancelBooking, addToast } = useApp();
  const [filter, setFilter] = useState('all');
  const [showRating, setShowRating] = useState(null);
  const [ratingVal, setRatingVal] = useState(5);

  const filtered = filter === 'all' ? userBookings : userBookings.filter(b => b.status === filter);
  const sorted = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleCancel = (b) => {
    if (b.status !== 'confirmed') { addToast('error', 'Cannot Cancel', 'Only confirmed bookings can be cancelled'); return; }
    cancelBooking(b.id);
  };

  const tabs = [
    { id: 'all', label: 'ALL_SESSIONS' },
    { id: 'confirmed', label: 'UPCOMING' },
    { id: 'completed', label: 'COMPLETED' },
    { id: 'cancelled', label: 'CANCELLED' },
  ];

  return (
    <div className="container animate-fade" style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontWeight: 900, marginBottom: 8, fontSize: 28, letterSpacing: -1 }}>Booking Registry</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 500 }}>Tracking {userBookings.length} total operational sessions</p>
      </div>

      {/* Tabs - Scrollable on Mobile */}
      <div style={{ 
        display: 'flex', gap: 8, background: 'var(--bg-secondary)', padding: 8, borderRadius: 18, 
        marginBottom: 32, overflowX: 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none', border: '1px solid var(--border)'
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setFilter(t.id)}
            style={{ 
              padding: '12px 24px', borderRadius: 12, border: 'none', 
              background: filter === t.id ? 'var(--bg-card)' : 'transparent', 
              color: filter === t.id ? 'var(--text-primary)' : 'var(--text-muted)', 
              fontWeight: filter === t.id ? 900 : 700, fontSize: 11, letterSpacing: 1,
              cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
              boxShadow: filter === t.id ? '0 4px 12px rgba(0,0,0,0.2)' : 'none'
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <div className="card animate-fade" style={{ textAlign: 'center', padding: '100px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🏟️</div>
          <h3 style={{ fontWeight: 900, color: 'var(--text-primary)' }}>Empty Registry</h3>
          <p style={{ fontSize: 14, marginBottom: 24, fontWeight: 500 }}>No operations matches current parameters.</p>
          <button className="btn btn-primary" style={{ padding: '0 24px', height: 48, borderRadius: 14, fontWeight: 800 }} onClick={() => setActivePage('turfs')}>EXPLORE_ARENAS</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {sorted.map(b => (
            <div key={b.id} className="card animate-fade" style={{ padding: window.innerWidth < 768 ? '24px 20px' : '32px', position: 'relative', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: 6, height: '100%', background: b.status === 'confirmed' ? 'var(--accent-green)' : b.status === 'completed' ? 'var(--accent-blue)' : b.status === 'cancelled' ? 'var(--accent-red)' : 'var(--accent-yellow)' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 0, letterSpacing: -0.5 }}>{b.turfName}</h3>
                    <div className={`badge badge-${STATUS_COLORS[b.status] || 'blue'}`} style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase' }}>{b.status}</div>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 900, letterSpacing: 1.5, textTransform: 'uppercase' }}>TID_{b.id.toUpperCase()}</div>
                </div>
                <div style={{ textAlign: window.innerWidth < 768 ? 'left' : 'right' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--accent-green)', letterSpacing: -1 }}>₹{b.amount}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>{b.paymentStatus}_EXECUTION</div>
                </div>
              </div>

              <div className="grid grid-mobile-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24, background: 'var(--bg-secondary)', padding: '20px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--text-secondary)' }}>
                  <Calendar size={20} color="var(--accent-blue)" />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 900, letterSpacing: 1 }}>TARGET_DATE</span>
                    <span style={{ fontWeight: 800 }}>{new Date(b.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--text-secondary)' }}>
                  <Clock size={20} color="var(--accent-green)" />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 900, letterSpacing: 1 }}>TIME_WINDOW</span>
                    <span style={{ fontWeight: 800 }}>{b.startTime}–{b.endTime}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--text-secondary)' }}>
                  <MapPin size={20} color="var(--accent-orange)" />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 900, letterSpacing: 1 }}>PHYSICAL_UNIT</span>
                    <span style={{ fontWeight: 800 }}>Field {b.court}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {b.status === 'confirmed' && (
                    <button className="btn btn-danger" style={{ height: 42, fontSize: 12, fontWeight: 800, padding: '0 16px', borderRadius: 12 }} onClick={() => handleCancel(b)}>
                      <XCircle size={16} strokeWidth={2.5} /> TERMINATE
                    </button>
                  )}
                  {b.status === 'completed' && !b.rating && (
                    <button className="btn btn-primary" style={{ height: 42, fontSize: 12, fontWeight: 800, padding: '0 16px', borderRadius: 12 }} onClick={() => setShowRating(b.id)}>
                      <Star size={16} strokeWidth={2.5} /> PUBLISH_MERIT
                    </button>
                  )}
                  {b.status === 'completed' && b.rating && (
                    <div style={{ display: 'flex', gap: 4, background: 'var(--bg-secondary)', padding: '8px 16px', borderRadius: 12 }}>
                      {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i <= b.rating ? 'var(--accent-yellow)' : 'transparent'} color="var(--accent-yellow)" />)}
                    </div>
                  )}
                </div>
                <button className="btn btn-ghost" style={{ height: 42, fontSize: 12, fontWeight: 900, padding: '0 16px', borderRadius: 12, border: '1px solid var(--border)' }} onClick={() => { const t = turfs.find(t => t.id === b.turfId); setSelectedTurf(t); setActivePage('turfdetail'); }}>
                   REBOOK_ASSET
                </button>
              </div>

              {showRating === b.id && (
                <div className="animate-fade" style={{ marginTop: 24, background: 'var(--bg-secondary)', borderRadius: 20, padding: '24px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 16, fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase' }}>TRANSMIT_OPERATIONAL_FEEDBACK</div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                    {[1,2,3,4,5].map(i => (
                      <button key={i} onClick={() => setRatingVal(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        <Star size={32} fill={i <= ratingVal ? 'var(--accent-yellow)' : 'transparent'} color="var(--accent-yellow)" strokeWidth={1.5} />
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn btn-primary" style={{ height: 44, padding: '0 24px', borderRadius: 12, fontWeight: 800 }} onClick={() => { addToast('success', 'Review Sent', 'Thank you for your feedback!'); setShowRating(null); }}>CONFIRM_RATING</button>
                    <button className="btn btn-ghost" style={{ height: 44, padding: '0 24px', borderRadius: 12, fontWeight: 800 }} onClick={() => setShowRating(null)}>ABORT</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
