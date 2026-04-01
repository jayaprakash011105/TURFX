import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { SPORTS } from '../../data/mockData';
import { CheckCircle, XCircle, Edit, Trash2, Eye, Search, Filter, MapPin, Star, Plus, X } from 'lucide-react';

export default function AdminTurfManagement({ setActivePage }) {
  const { turfs, approveTurf, rejectTurf, deleteTurf, addToast } = useApp();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = turfs
    .filter(t => filter === 'all' || t.status === filter)
    .filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.location.toLowerCase().includes(search.toLowerCase()) || t.ownerName?.toLowerCase().includes(search.toLowerCase()));

  const tabs = [
    { id: 'all', label: 'All', count: turfs.length },
    { id: 'approved', label: 'Approved', count: turfs.filter(t => t.status === 'approved').length },
    { id: 'pending', label: 'Pending', count: turfs.filter(t => t.status === 'pending').length },
    { id: 'rejected', label: 'Rejected', count: turfs.filter(t => t.status === 'rejected').length },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Turf Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Approve, reject, and manage all turf listings</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--bg-secondary)', padding: 4, borderRadius: 12, marginBottom: 20, width: 'fit-content' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setFilter(t.id)}
            style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: filter === t.id ? 'var(--bg-card)' : 'transparent', color: filter === t.id ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: filter === t.id ? 600 : 400, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            {t.label}
            {t.count > 0 && <span style={{ background: filter === t.id ? 'var(--accent-green)' : 'var(--bg-glass)', borderRadius: 999, padding: '1px 7px', fontSize: 11, color: filter === t.id ? '#000' : 'var(--text-muted)' }}>{t.count}</span>}
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 380, marginBottom: 20 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input className="form-input" style={{ paddingLeft: 36 }} placeholder="Search turfs, owners..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="table-wrapper" style={{ marginBottom: 16 }}>
        <table>
          <thead>
            <tr><th>Turf Name</th><th>Owner</th><th>Location</th><th>Sports</th><th>Price</th><th>Rating</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.courts} courts · {t.openTime}–{t.closeTime}</div>
                </td>
                <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{t.ownerName}</td>
                <td style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 4, alignItems: 'center' }}><MapPin size={11} />{t.location}</td>
                <td>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {t.sportTypes?.slice(0,2).map(s => <span key={s} style={{ fontSize: 11 }}>{SPORTS.find(sp=>sp.id===s)?.icon}</span>)}
                  </div>
                </td>
                <td style={{ fontWeight: 700, color: 'var(--accent-green)' }}>₹{t.pricePerHour}/hr</td>
                <td>
                  {t.rating ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Star size={12} fill="var(--accent-yellow)" color="var(--accent-yellow)" /> {t.rating}
                    </div>
                  ) : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>New</span>}
                </td>
                <td><span className={`badge badge-${t.status === 'approved' ? 'green' : t.status === 'pending' ? 'yellow' : 'red'}`}>{t.status}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setSelected(t)}><Eye size={13} /></button>
                    {t.status === 'pending' && (
                      <>
                        <button className="btn btn-primary btn-sm" onClick={() => approveTurf(t.id)}><CheckCircle size={13} /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => rejectTurf(t.id)}><XCircle size={13} /></button>
                      </>
                    )}
                    {t.status === 'rejected' && (
                      <button className="btn btn-primary btn-sm" onClick={() => approveTurf(t.id)}>Approve</button>
                    )}
                    <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(t.id)}><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏟️</div>
          <div>No turfs found</div>
        </div>
      )}

      {/* Turf Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="modal" style={{ maxWidth: 540 }}>
            <div className="modal-header">
              <h2 style={{ fontSize: 17, fontWeight: 700 }}>{selected.name}</h2>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                {[
                  { l: 'Owner', v: selected.ownerName },
                  { l: 'Location', v: selected.location },
                  { l: 'Price/hr', v: `₹${selected.pricePerHour}` },
                  { l: 'Weekend', v: `₹${selected.weekendPrice || selected.pricePerHour}` },
                  { l: 'Courts', v: selected.courts },
                  { l: 'Hours', v: `${selected.openTime}–${selected.closeTime}` },
                  { l: 'Rating', v: selected.rating || 'New' },
                  { l: 'Reviews', v: selected.reviewCount || 0 },
                ].map(item => (
                  <div key={item.l} style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '12px' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{item.l}</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{item.v}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Sports</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {selected.sportTypes?.map(s => <span key={s} className="badge badge-blue">{SPORTS.find(sp=>sp.id===s)?.icon} {SPORTS.find(sp=>sp.id===s)?.label}</span>)}
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Amenities</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {selected.amenities?.map(a => <span key={a} style={{ background: 'var(--bg-secondary)', borderRadius: 6, padding: '4px 10px', fontSize: 12, color: 'var(--text-secondary)' }}>{a}</span>)}
                </div>
              </div>
              {selected.description && <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{selected.description}</p>}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setSelected(null)}>Close</button>
              {selected.status === 'pending' && (
                <>
                  <button className="btn btn-danger" onClick={() => { rejectTurf(selected.id); setSelected(null); }}><XCircle size={15} /> Reject</button>
                  <button className="btn btn-primary" onClick={() => { approveTurf(selected.id); setSelected(null); }}><CheckCircle size={15} /> Approve</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 360 }}>
            <div className="modal-body" style={{ textAlign: 'center', padding: '32px 24px' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Delete Turf?</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>This will permanently remove the turf and all associated data.</p>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => { deleteTurf(confirmDelete); setConfirmDelete(null); }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
