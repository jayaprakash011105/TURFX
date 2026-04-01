import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Lock, Unlock, CheckCircle, XCircle, Calendar, Building2, ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const fmt = (d) => d.toISOString().split('T')[0];

export default function SlotManagementPage() {
  const { ownerTurfs, slots, blockSlot, unblockSlot, addToast } = useApp();
  const [selectedTurf, setSelectedTurf] = useState(ownerTurfs[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState(fmt(new Date()));
  const [selectedCourt, setSelectedCourt] = useState(1);
  const [view, setView] = useState('grid'); // 'grid' | 'list'

  const turf = ownerTurfs.find(t => t.id === selectedTurf);
  const turfSlots = slots[selectedTurf] || [];
  const filtered = turfSlots.filter(s => s.date === selectedDate && s.court === selectedCourt);

  const dates = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d; });

  const counts = {
    available: filtered.filter(s => s.status === 'available').length,
    booked: filtered.filter(s => s.status === 'booked').length,
    blocked: filtered.filter(s => s.status === 'blocked').length,
  };

  const handleToggle = (slot) => {
    if (slot.status === 'booked') { addToast('error', 'Cannot Modify', 'This slot is already booked by a customer'); return; }
    if (slot.status === 'past') { addToast('error', 'Expired Slot', 'Cannot modify past slots'); return; }
    if (slot.status === 'blocked') unblockSlot(selectedTurf, slot.id);
    else if (slot.status === 'available') blockSlot(selectedTurf, slot.id);
  };

  const bulkBlockAll = () => {
    filtered.filter(s => s.status === 'available').forEach(s => blockSlot(selectedTurf, s.id));
    addToast('success', 'All Available Slots Blocked', `${counts.available} slots blocked for court ${selectedCourt}`);
  };
  const bulkUnblockAll = () => {
    filtered.filter(s => s.status === 'blocked').forEach(s => unblockSlot(selectedTurf, s.id));
    addToast('success', 'All Blocked Slots Opened', `${counts.blocked} slots made available`);
  };

  const getSlotStyle = (slot) => {
    if (slot.status === 'booked') return { bg: 'rgba(91,141,239,0.1)', border: 'rgba(91,141,239,0.3)', color: '#5b8def', label: 'Booked', cursor: 'not-allowed' };
    if (slot.status === 'blocked') return { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.3)', color: 'var(--accent-red)', label: 'Blocked', cursor: 'pointer' };
    if (slot.status === 'past') return { bg: 'transparent', border: 'var(--border)', color: 'var(--text-muted)', label: 'Past', cursor: 'not-allowed' };
    return { bg: 'rgba(0,230,118,0.06)', border: 'rgba(0,230,118,0.3)', color: 'var(--accent-green)', label: 'Open', cursor: 'pointer' };
  };

  if (ownerTurfs.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🏟️</div>
        <div style={{ fontSize: 16, fontWeight: 600 }}>No turfs found</div>
        <div style={{ fontSize: 13, marginTop: 4 }}>Add a turf first to manage slots</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Slot Management</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Block, unblock, and monitor slot availability in real-time</p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <select className="form-input form-select" style={{ width: 220 }} value={selectedTurf} onChange={e => setSelectedTurf(e.target.value)}>
          {ownerTurfs.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {/* Date Picker */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 16 }}>
        {dates.map(d => {
          const ds = fmt(d);
          const isSelected = selectedDate === ds;
          return (
            <button key={ds} onClick={() => setSelectedDate(ds)}
              style={{ flexShrink: 0, width: 60, padding: '10px 8px', borderRadius: 12, border: `2px solid ${isSelected ? 'var(--accent-blue)' : 'var(--border)'}`, background: isSelected ? 'rgba(91,141,239,0.12)' : 'var(--bg-secondary)', color: isSelected ? 'var(--accent-blue)' : 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}>
              <div style={{ fontSize: 10, marginBottom: 4 }}>{DAYS[d.getDay()]}</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{d.getDate()}</div>
            </button>
          );
        })}
      </div>

      {/* Court Selector + Stats + Actions */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {Array.from({ length: turf?.courts || 1 }, (_, i) => i + 1).map(c => (
            <button key={c} onClick={() => setSelectedCourt(c)}
              style={{ padding: '8px 18px', borderRadius: 10, border: `2px solid ${selectedCourt === c ? 'var(--accent-blue)' : 'var(--border)'}`, background: selectedCourt === c ? 'rgba(91,141,239,0.12)' : 'transparent', color: selectedCourt === c ? 'var(--accent-blue)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              Court {c}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, marginLeft: 'auto' }}>
          {[
            { label: 'Available', count: counts.available, color: 'var(--accent-green)' },
            { label: 'Booked', count: counts.booked, color: 'var(--accent-blue)' },
            { label: 'Blocked', count: counts.blocked, color: 'var(--accent-red)' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} />
              <span style={{ color: 'var(--text-muted)' }}>{s.label}:</span>
              <span style={{ fontWeight: 700 }}>{s.count}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-danger btn-sm" onClick={bulkBlockAll} disabled={counts.available === 0}>
            <Lock size={13} /> Block All
          </button>
          <button className="btn btn-secondary btn-sm" onClick={bulkUnblockAll} disabled={counts.blocked === 0}>
            <Unlock size={13} /> Unblock All
          </button>
        </div>
      </div>

      {/* Slot Grid */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px' }}>
        <div style={{ marginBottom: 16, fontSize: 14, fontWeight: 600 }}>
          {turf?.name} · Court {selectedCourt} · {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 10 }}>
          {filtered.map(slot => {
            const style = getSlotStyle(slot);
            return (
              <button key={slot.id} onClick={() => handleToggle(slot)}
                style={{ padding: '12px 8px', borderRadius: 12, border: `2px solid ${style.border}`, background: style.bg, color: style.color, cursor: style.cursor, fontSize: 12, fontWeight: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, transition: 'all 0.15s', opacity: slot.status === 'past' ? 0.4 : 1 }}>
                <span style={{ fontSize: 14 }}>{slot.startTime}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {slot.status === 'available' ? <Unlock size={9} /> : slot.status === 'blocked' ? <Lock size={9} /> : <CheckCircle size={9} />}
                  {style.label}
                </div>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: 14 }}>
            No slots for this date. Slots are generated for the next 7 days.
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 20, marginTop: 16, padding: '14px 18px', background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)', flexWrap: 'wrap' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>Legend:</div>
        {[
          { color: 'var(--accent-green)', label: 'Available — Click to block' },
          { color: 'var(--accent-red)', label: 'Blocked — Click to unblock' },
          { color: 'var(--accent-blue)', label: 'Booked — Customer booking' },
          { color: 'var(--text-muted)', label: 'Past — Expired slot' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}
