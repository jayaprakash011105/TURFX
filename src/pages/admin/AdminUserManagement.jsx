import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Search, UserCheck, UserX, Trash2, Eye, Shield, User, Building2, X } from 'lucide-react';

export default function AdminUserManagement({ roleType }) {
  const { users, updateUserStatus, deleteUser } = useApp();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // If roleType is provided (e.g. 'owner' or 'user'), restrict the entire view to just that role.
  const targetUsers = roleType ? users.filter(u => u.role === roleType) : users;

  const filtered = targetUsers
    .filter(u => filter === 'all' || u.role === filter)
    .filter(u => !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  const tabs = [
    { id: 'all', label: 'All', count: targetUsers.length },
    { id: 'user', label: 'Players', count: targetUsers.filter(u => u.role === 'user').length },
    { id: 'owner', label: 'Owners', count: targetUsers.filter(u => u.role === 'owner').length },
  ];

  const getRoleIcon = (role) => role === 'owner' ? <Building2 size={14} /> : role === 'admin' ? <Shield size={14} /> : <User size={14} />;
  const getRoleBadge = (role) => role === 'owner' ? 'badge-blue' : role === 'admin' ? 'badge-purple' : 'badge-green';

  const title = roleType === 'owner' ? 'Owner Management' : roleType === 'user' ? 'Player Management' : 'User Management';
  const subtitle = roleType === 'owner' ? 'Manage turf owners and partners' : roleType === 'user' ? 'Manage platform players and customers' : 'Manage all platform users';

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 950, marginBottom: 12, letterSpacing: '-0.03em', background: 'linear-gradient(to right, #fff, #9ca3af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{title}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 500 }}>{targetUsers.length} total platform entities registered</p>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--border)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div className="status-dot online" style={{ width: 6, height: 6 }} />
            <span style={{ color: 'var(--accent-green)', fontSize: 11, fontWeight: 800, letterSpacing: 1 }}>REALTIME_SYNC: ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Dynamic Stats Cards depending on role */}
      {/* Dynamic Stats Cards in Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${roleType === 'owner' ? 3 : 4}, 1fr)`, 
        gap: 16, 
        marginBottom: 24 
      }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>TOTAL {roleType === 'owner' ? 'OWNERS' : 'PLAYERS'}</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: roleType==='owner' ? 'var(--accent-blue)' : 'var(--accent-green)' }}>
            {targetUsers.length}
          </div>
          <div style={{ position: 'absolute', right: -10, bottom: -10, opacity: 0.05, transform: 'rotate(-10deg)' }}>
            {roleType === 'owner' ? <Building2 size={80} /> : <User size={80} />}
          </div>
        </div>
        
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>ACTIVE ACCOUNTS</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-primary)' }}>
            {targetUsers.filter(u => u.status === 'active').length}
          </div>
          <div style={{ position: 'absolute', right: -10, bottom: -10, opacity: 0.05, transform: 'rotate(-10deg)' }}>
            <UserCheck size={80} />
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>SUSPENDED</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--accent-red)' }}>
            {targetUsers.filter(u => u.status === 'suspended').length}
          </div>
          <div style={{ position: 'absolute', right: -10, bottom: -10, opacity: 0.05, transform: 'rotate(-10deg)' }}>
            <UserX size={80} />
          </div>
        </div>

        {roleType !== 'owner' && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>PREMIUM PLANS</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--accent-purple)' }}>
              {targetUsers.filter(u => u.subscription === 'premium').length}
            </div>
            <div style={{ position: 'absolute', right: -10, bottom: -10, opacity: 0.05, transform: 'rotate(-10deg)' }}>
              <Shield size={80} />
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="form-input" style={{ paddingLeft: 36 }} placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {/* Only show role toggle tabs if we are showing all users */}
        {!roleType && (
          <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: 4, borderRadius: 10, gap: 2 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setFilter(t.id)}
                style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: filter === t.id ? 'var(--bg-card)' : 'transparent', color: filter === t.id ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: filter === t.id ? 600 : 400, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                {t.label} <span style={{ background: 'var(--bg-glass)', borderRadius: 999, padding: '1px 6px', fontSize: 10 }}>{t.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>{roleType === 'owner' ? 'Owner Name' : 'Player Name'}</th>
              <th>Contact</th>
              {!roleType && <th>Role</th>}
              {roleType !== 'owner' && <th>Plan</th>}
              <th>{roleType === 'owner' ? 'Total Platform Bookings' : 'Bookings'}</th>
              <th>Joined Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: u.role === 'owner' ? 'linear-gradient(135deg,#5b8def,#8b5cf6)' : 'linear-gradient(135deg,var(--accent-green),var(--accent-blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#000', flexShrink: 0 }}>{u.name?.[0]}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{u.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{u.id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: 12 }}>{u.email}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{u.phone}</div>
                </td>
                {!roleType && (
                  <td><span className={`badge ${getRoleBadge(u.role)}`} style={{ display: 'flex', alignItems: 'center', gap: 4, width: 'fit-content' }}>{getRoleIcon(u.role)} {u.role}</span></td>
                )}
                {roleType !== 'owner' && (
                  <td><span className={`badge badge-${u.subscription === 'premium' ? 'purple' : 'blue'}`}>{u.subscription || 'free'}</span></td>
                )}
                <td style={{ fontWeight: 600 }}>{u.bookings || u.totalBookings || 0}</td>
                <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{u.joined || u.createdAt || '–'}</td>
                <td><span className={`badge badge-${u.status === 'active' ? 'green' : u.status === 'pending' ? 'yellow' : 'red'}`}>{u.status || 'active'}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setSelected(u)}><Eye size={12} /></button>
                    {u.status === 'active'
                      ? <button className="btn btn-danger btn-sm" onClick={() => updateUserStatus(u.id, 'suspended')}><UserX size={12} /></button>
                      : <button className="btn btn-primary btn-sm" onClick={() => updateUserStatus(u.id, 'active')}><UserCheck size={12} /></button>
                    }
                    <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(u.id)}><Trash2 size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="modal animate-fade" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <h2 style={{ fontSize: 17, fontWeight: 700 }}>{selected.role === 'owner' ? 'Owner Details' : 'Player Details'}</h2>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: selected.role === 'owner' ? 'linear-gradient(135deg,#5b8def,#8b5cf6)' : 'linear-gradient(135deg,var(--accent-green),var(--accent-blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: '#fff' }}>{selected.name?.[0]}</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{selected.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{selected.email}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className={`badge ${getRoleBadge(selected.role)}`}>{selected.role}</span>
                  <span className={`badge badge-${selected.status === 'active' ? 'green' : 'red'}`}>{selected.status || 'active'}</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { l: 'Phone', v: selected.phone },
                  { l: 'Joined', v: selected.joined || '–' },
                  { l: 'Total Bookings', v: selected.bookings || 0 },
                  { l: selected.role === 'owner' ? 'Active Turfs' : 'Subscription', v: selected.role === 'owner' ? '2' : selected.subscription || 'free' },
                ].map(item => (
                  <div key={item.l} style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '12px' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{item.l}</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{item.v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setSelected(null)}>Close</button>
              {selected.status === 'active'
                ? <button className="btn btn-danger" onClick={() => { updateUserStatus(selected.id, 'suspended'); setSelected(null); }}><UserX size={14} /> Suspend</button>
                : <button className="btn btn-primary" onClick={() => { updateUserStatus(selected.id, 'active'); setSelected(null); }}><UserCheck size={14} /> Activate</button>
              }
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal animate-fade" style={{ maxWidth: 360 }}>
            <div className="modal-body" style={{ textAlign: 'center', padding: '32px 24px' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Delete {roleType === 'owner' ? 'Owner' : 'User'}?</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>This action is permanent and cannot be undone.</p>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => { deleteUser(confirmDelete); setConfirmDelete(null); }}>Delete Permanently</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
