import React from 'react';
import { useApp } from '../../store/AppContext';
import { Users, Building2, Calendar, DollarSign, TrendingUp, ArrowUp, Activity, Bell, UserCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { analyticsData } from '../../data/mockData';

const PIE_COLORS = ['#00e676','#5b8def','#f97316','#eab308','#8b5cf6','#ef4444'];

const KPICard = ({ label, value, icon, color, trend, sub }) => (
  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>{icon}</div>
      {trend && <div style={{ fontSize: 12, color: 'var(--accent-green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}><ArrowUp size={11} />{trend}</div>}
    </div>
    <div style={{ fontSize: 26, fontWeight: 900, marginBottom: 4 }}>{value}</div>
    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{sub}</div>}
  </div>
);

const CustomTT = ({ active, payload, label }) => active && payload?.length ? (
  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
    <div style={{ color: 'var(--text-muted)' }}>{label}</div>
    {payload.map((p, i) => <div key={i} style={{ color: p.color, fontWeight: 700 }}>{typeof p.value === 'number' && p.dataKey === 'amount' ? `₹${p.value.toLocaleString()}` : p.value}</div>)}
  </div>
) : null;

export default function AdminDashboard({ setActivePage }) {
  const { adminStats, turfs, bookings, users } = useApp();
  const recentBookings = [...bookings].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0,5);
  const pendingTurfs = turfs.filter(t => t.status === 'pending');

  return (
    <div className="container animate-fade" style={{ paddingBottom: 80 }}>
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontWeight: 900, marginBottom: 4 }}>Platform Pulse</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="status-dot online" style={{ width: 8, height: 8, boxShadow: '0 0 10px var(--accent-green)' }} />
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Active Control · System Healthy</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
           <div style={{ padding: '8px 16px', background: 'var(--bg-secondary)', borderRadius: 12, border: '1px solid var(--border)', fontSize: 11, fontWeight: 800, color: 'var(--text-secondary)' }}>
              NODE_ID: TX_REGION_SOUTH
           </div>
        </div>
      </div>

      {/* KPIs Grid - Flagship Row */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: 16, 
        marginBottom: 32 
      }}>
        <KPICard label="Scale Efficiency" value={adminStats.totalUsers} icon={<Users size={22} strokeWidth={2.5} />} color="var(--accent-green)" trend="+12.4%" sub="Total platform athletes" />
        <KPICard label="Asset Density" value={adminStats.activeTurfs} icon={<Building2 size={22} strokeWidth={2.5} />} color="var(--accent-blue)" sub={`${adminStats.pendingTurfs} pending review`} />
        <KPICard label="Transaction Flow" value={`₹${adminStats.totalRevenue.toLocaleString()}`} icon={<DollarSign size={22} strokeWidth={2.5} />} color="var(--accent-yellow)" trend="+18.2%" sub="Gross platform yield" />
        <KPICard label="System Intake" value={`₹${adminStats.commission.toLocaleString()}`} icon={<Activity size={22} strokeWidth={2.5} />} color="var(--accent-purple)" sub="10% Net platform fee" />
      </div>

      {/* Charts Row */}
      {/* Charts Row - Professional 2-Column Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', 
        gap: 24, 
        marginBottom: 32 
      }}>
        {/* Revenue Trend */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 900 }}>Yield Velocity</h3>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Platform-wide revenue accumulation</div>
            </div>
            <div className="badge badge-green" style={{ fontSize: 10, fontWeight: 900 }}>STEADY CLIMB</div>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.revenue}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="var(--text-muted)" fontSize={11} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
                <Tooltip content={<CustomTT />} cursor={{ stroke: 'var(--accent-green)', strokeWidth: 1 }} />
                <Line type="monotone" dataKey="amount" stroke="var(--accent-green)" strokeWidth={4} dot={{ fill: 'var(--accent-green)', r: 6, strokeWidth: 0 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sport Distribution */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '24px' }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 24 }}>Category Reach</h3>
          <div style={{ display: 'flex', alignItems: 'center', height: 260 }}>
            <div style={{ flex: 1, height: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={analyticsData.sportDistribution} dataKey="value" nameKey="sport" cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} stroke="none">
                    {analyticsData.sportDistribution.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ width: 140, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {analyticsData.sportDistribution.map((s, i) => (
                <div key={s.sport} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: PIE_COLORS[i] }} />
                  {s.sport}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: 24, marginBottom: 32 }}>
        {/* Activity Patterns */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 900 }}>Operational Density</h3>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Weekly platform activity distribution matrix</div>
            </div>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.bookingsByDay}>
                <defs>
                   <linearGradient id="adminBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} stroke="var(--text-muted)" fontSize={12} dy={10} />
                <YAxis axisLine={false} tickLine={false} stroke="var(--text-muted)" fontSize={11} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 10 }} content={<CustomTT />} />
                <Bar dataKey="bookings" fill="url(#adminBarGrad)" radius={[10,10,4,4]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Approvals Alert Queue */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
            <h3 style={{ fontSize: 18, fontWeight: 900 }}>Validation Queue</h3>
            <div className="badge badge-yellow" style={{ fontSize: 10, fontWeight: 900 }}>{pendingTurfs.length} ACTION REQUIRED</div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 260, overflowY: 'auto', paddingRight: 8 }}>
            {pendingTurfs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                 <div style={{ fontSize: 32, marginBottom: 12 }}>🛡️</div>
                 <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>Security audit complete.</div>
                 <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>No venues currently awaiting induction.</div>
              </div>
            ) : pendingTurfs.map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px', background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(234,179,8,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>📋</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>By {t.owners?.name || t.ownerName || 'Unknown'} · {t.location}</div>
                </div>
                <button className="btn btn-ghost btn-xs" style={{ color: 'var(--accent-yellow)', fontSize: 10, border: '1px solid rgba(234,179,8,0.2)' }} onClick={() => setActivePage('turfs')}>PROCESS</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Platform Activity */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
           <div>
              <h3 style={{ fontSize: 18, fontWeight: 900 }}>Platform Ledger</h3>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Real-time transaction stream across all regions</div>
           </div>
           <button className="btn btn-ghost btn-sm" onClick={() => setActivePage('bookings')}>Registry View →</button>
        </div>
        <div className="table-wrapper animate-fade" style={{ background: 'var(--bg-secondary)', borderRadius: 16, overflow: 'hidden' }}>
          <table style={{ margin: 0 }}>
            <thead style={{ background: 'rgba(255,255,255,0.02)' }}>
              <tr>
                <th style={{ padding: '16px 20px', fontSize: 11, fontWeight: 800 }}>TX_ID</th>
                <th style={{ padding: '16px 20px', fontSize: 11, fontWeight: 800 }}>ASSET_INTEL</th>
                <th style={{ padding: '16px 20px', fontSize: 11, fontWeight: 800 }}>USER_AUTH</th>
                <th style={{ padding: '16px 20px', fontSize: 11, fontWeight: 800 }}>YIELD</th>
                <th style={{ padding: '16px 20px', fontSize: 11, fontWeight: 800 }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map(b => (
                <tr key={b.id} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px 20px', fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>#{b.id}</td>
                  <td style={{ padding: '16px 20px' }}>
                     <div style={{ fontWeight: 800, fontSize: 13 }}>{b.turfName}</div>
                     <div style={{ fontSize: 10, color: 'var(--accent-blue)', fontWeight: 700 }}>FIELD_0{b.court}</div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                     <div style={{ fontWeight: 700, fontSize: 13 }}>{b.userId}</div>
                     <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700 }}>VERIFIED_PLAYER</div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                     <div style={{ fontWeight: 900, fontSize: 15, color: 'var(--accent-green)' }}>₹{b.amount}</div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                     <span className={`badge badge-${b.status === 'confirmed' ? 'green' : b.status === 'completed' ? 'blue' : 'red'}`} style={{ fontSize: 9 }}>{b.status.toUpperCase()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
