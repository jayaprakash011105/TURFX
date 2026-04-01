import React from 'react';
import { useApp } from '../../store/AppContext';
import { Building2, Calendar, DollarSign, TrendingUp, Clock, Star, ArrowUp, Users, Activity, Shield } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { analyticsData } from '../../data/mockData';

const KPICard = ({ icon, label, value, sub, color, trend }) => (
  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>{icon}</div>
      {trend && <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--accent-green)', fontWeight: 600 }}><ArrowUp size={12} />{trend}</div>}
    </div>
    <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 4 }}>{value}</div>
    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{sub}</div>}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', fontSize: 13 }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => <div key={i} style={{ color: p.color, fontWeight: 700 }}>₹{p.value?.toLocaleString()}</div>)}
    </div>
  );
};

export default function OwnerDashboard({ setActivePage }) {
  const { ownerStats, ownerBookings, ownerTurfs, currentUser } = useApp();

  const recentBookings = [...ownerBookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const { slots } = useApp();
  const todayStr = new Date().toISOString().split('T')[0];
  const curMonth = todayStr.substring(0, 7); // YYYY-MM

  const dashboardStats = React.useMemo(() => {
    // Basic Counts
    const approvedCount = ownerTurfs.filter(t => t.status === 'approved').length;
    const pendingCount = ownerTurfs.filter(t => t.status === 'pending').length;

    // Today
    const todayBookings = ownerBookings.filter(b => b.date === todayStr);
    const todayNet = Math.round(todayBookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + (b.amount || 0), 0) * 0.9);

    // Month
    const monthBookings = ownerBookings.filter(b => b.date.startsWith(curMonth));
    const monthNet = Math.round(monthBookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + (b.amount || 0), 0) * 0.9);

    // Overall
    const totalNet = Math.round(ownerStats.totalRevenue * 0.9);
    const totalPlatform = Math.round(ownerStats.totalRevenue * 0.1);

    // Real-time Court Info
    const totalCourts = ownerTurfs.reduce((acc, t) => acc + (t.courts || 0), 0);
    let bookedNowCount = 0;
    const nowHour = new Date().getHours();
    ownerTurfs.forEach(t => {
      const turfSlots = slots[t.id] || [];
      const activeSlots = turfSlots.filter(s => s.date === todayStr && parseInt(s.startTime) === nowHour && s.status === 'booked');
      bookedNowCount += activeSlots.length;
    });

    // Sports Density Today
    const sports = todayBookings.reduce((acc, b) => { acc[b.sport] = (acc[b.sport] || 0) + 1; return acc; }, {});
    const topSport = Object.entries(sports).sort((a,b) => b[1]-a[1])[0]?.[0] || '---';

    // Top Venue
    const topVenue = [...ownerTurfs].sort((a,b) => b.rating - a.rating)[0];

    // Upcoming
    const futureBookings = ownerBookings
      .filter(b => {
         const bDate = new Date(`${b.date}T${b.startTime}`);
         return bDate > new Date();
      })
      .sort((a, b) => new Date(`${a.date}T${a.startTime}`) - new Date(`${b.date}T${b.startTime}`));
    const upcoming = futureBookings[0] || null;

    return { 
      approvedCount, pendingCount,
      todayBookingsCount: todayBookings.length, todayNet,
      monthBookingsCount: monthBookings.length, monthNet,
      totalNet, totalPlatform,
      totalCourts, bookedNowCount,
      topSport, topVenue,
      upcoming
    };
  }, [ownerBookings, ownerStats, ownerTurfs, todayStr, curMonth, slots]);

  return (
    <div className="container animate-fade" style={{ paddingBottom: 80 }}>
      {/* Greeting */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontWeight: 900, marginBottom: 4 }}>Operations Hub</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 500 }}>Real-time performance metrics for {currentUser?.name?.split(' ')[0]}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
           <div style={{ padding: '8px 16px', background: 'var(--bg-secondary)', borderRadius: 12, border: '1px solid var(--border)', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-green)', boxShadow: '0 0 10px var(--accent-green)' }}></div>
              LIVE NOW
           </div>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-mobile-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20, marginBottom: 32 }}>
        {/* Card 1: Venue Status */}
        <div className="card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
           <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: 'var(--accent-blue)10', borderRadius: '0 0 0 80px' }}></div>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--accent-blue)15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-blue)' }}><Building2 size={20} strokeWidth={2.5} /></div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800, letterSpacing: 1 }}>VALUATION</div>
           </div>
           <div>
              <div style={{ fontSize: 32, fontWeight: 950 }}>{ownerStats.totalTurfs} <span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>Approved</span></div>
              <div style={{ fontSize: 12, color: 'var(--accent-blue)', fontWeight: 700, marginTop: 4 }}>{dashboardStats.pendingCount} Ongoing Setup</div>
           </div>
           <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }}></div>
           <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, marginBottom: 6, textTransform: 'uppercase' }}>Elite Performer</div>
              <div style={{ fontSize: 14, fontWeight: 800 }}>{dashboardStats.topVenue?.name || '---'}</div>
              <div style={{ fontSize: 11, color: 'var(--accent-yellow)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}><Star size={12} fill="var(--accent-yellow)" /> {dashboardStats.topVenue?.rating || 0} Average Score</div>
           </div>
        </div>

        {/* Card 2: Today's Sales */}
        <div className="card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
           <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: 'var(--accent-green)10', borderRadius: '0 0 0 80px' }}></div>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--accent-green)15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-green)' }}><Calendar size={20} strokeWidth={2.5} /></div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800, letterSpacing: 1 }}>DAILY FLOW</div>
           </div>
           <div>
              <div style={{ fontSize: 32, fontWeight: 950 }}>{dashboardStats.todayBookingsCount} <span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>Slots</span></div>
              <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--accent-green)', marginTop: 4 }}>₹{dashboardStats.todayNet.toLocaleString()} <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>NET TODAY</span></div>
           </div>
           <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }}></div>
           <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, marginBottom: 6, textTransform: 'uppercase' }}>Session Density</div>
              <div style={{ fontSize: 14, fontWeight: 800 }}>{dashboardStats.topSport}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>Peak utilization trending</div>
        </div>
</div>

        {/* Card 3: Monthly Audit */}
        <div className="card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
           <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: 'var(--accent-purple)10', borderRadius: '0 0 0 80px' }}></div>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--accent-purple)15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple)' }}><Activity size={20} strokeWidth={2.5} /></div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800, letterSpacing: 1 }}>MONTHLY AUDIT</div>
           </div>
           <div>
              <div style={{ fontSize: 32, fontWeight: 950 }}>{dashboardStats.monthBookingsCount} <span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>Games</span></div>
              <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--accent-purple)', marginTop: 4 }}>₹{dashboardStats.monthNet.toLocaleString()} <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>CLEARED</span></div>
           </div>
           <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }}></div>
           <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, marginBottom: 6, textTransform: 'uppercase' }}>Growth Metrics</div>
              <div style={{ fontSize: 14, fontWeight: 800 }}>₹{(dashboardStats.monthNet * 1.2).toLocaleString()}</div>
              <div style={{ fontSize: 11, color: 'var(--accent-green)', fontWeight: 600, marginTop: 2 }}>↑ +20% Projected Yield</div>
           </div>
        </div>

        {/* Card 4: Operational Status */}
        <div className="card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
           <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: 'var(--accent-orange)10', borderRadius: '0 0 0 80px' }}></div>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--accent-orange)15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-orange)' }}><Clock size={20} strokeWidth={2.5} /></div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800, letterSpacing: 1 }}>REAL-TIME STATUS</div>
           </div>
           <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, marginBottom: 4 }}>FIELD OCCUPANCY</div>
              <div style={{ fontSize: 26, fontWeight: 950 }}>{dashboardStats.bookedNowCount} <span style={{ fontSize: 16, color: 'var(--text-muted)', fontWeight: 500 }}>/ {dashboardStats.totalCourts} Active Fields</span></div>
           </div>
           <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }}></div>
           <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, marginBottom: 6, textTransform: 'uppercase' }}>Next Tactical Event</div>
              {dashboardStats.upcoming ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                   <div style={{ padding: '4px 8px', background: 'var(--accent-blue)15', borderRadius: 8, fontSize: 12, fontWeight: 900, color: 'var(--accent-blue)' }}>{dashboardStats.upcoming.startTime}</div>
                   <div style={{ fontSize: 13, fontWeight: 700 }}>Court {dashboardStats.upcoming.court}</div>
                </div>
              ) : <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Zero sessions in queue</div>}
           </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24, marginBottom: 32 }} className="grid-mobile-1">
        {/* Revenue Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 900 }}>Yield Velocity</h3>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Dynamic revenue mapping per month</div>
            </div>
            <div className="badge badge-green" style={{ fontSize: 10, fontWeight: 900 }}>+24% MOM GROWTH</div>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.revenue}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="var(--text-muted)" fontSize={11} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--accent-green)', strokeWidth: 1 }} />
                <Line type="monotone" dataKey="amount" stroke="var(--accent-green)" strokeWidth={4} dot={{ fill: 'var(--accent-green)', r: 6, strokeWidth: 0 }} activeDot={{ r: 8, boxShadow: '0 0 20px var(--accent-green)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings Flow */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 900 }}>Utilization Density</h3>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Weekly booking distribution matrix</div>
            </div>
            <Activity size={20} color="var(--accent-blue)" />
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.bookingsByDay}>
                <defs>
                  <linearGradient id="ownerBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity={1}/>
                    <stop offset="100%" stopColor="var(--accent-purple)" stopOpacity={0.4}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} stroke="var(--text-muted)" fontSize={12} dy={10} />
                <YAxis axisLine={false} tickLine={false} stroke="var(--text-muted)" fontSize={11} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 10 }} content={({ active, payload, label }) => active && payload?.length ? (
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 16px', boxShadow: 'var(--shadow-lg)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
                    <div style={{ color: '#fff', fontSize: 18, fontWeight: 950 }}>{payload[0].value} <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Games</span></div>
                  </div>
                ) : null} />
                <Bar dataKey="bookings" fill="url(#ownerBarGrad)" radius={[10,10,4,4]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Venues & Recent Activity Split */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 2fr', gap: 24 }} className="grid-mobile-1">
        {/* My Venues Quick View */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center' }}>
            <h3 style={{ fontSize: 16, fontWeight: 900 }}>Venues</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => setActivePage('myturfs')}>Manage →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {ownerTurfs.map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px', background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #1e2e1e, #0f1f2a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🏟️</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{t.courts} Fields · <span style={{ color: 'var(--accent-yellow)' }}>★ {t.rating}</span></div>
                </div>
                <div className={`badge badge-${t.status === 'approved' ? 'green' : 'yellow'}`} style={{ fontSize: 9 }}>{t.status.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings Matrix */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center' }}>
            <h3 style={{ fontSize: 16, fontWeight: 900 }}>Operational Log</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => setActivePage('bookings')}>Audit Full Registry →</button>
          </div>
          <div className="table-wrapper animate-fade" style={{ background: 'var(--bg-secondary)', borderRadius: 16, overflow: 'hidden' }}>
            <table style={{ margin: 0 }}>
              <thead style={{ background: 'rgba(255,255,255,0.02)' }}>
                <tr>
                  <th style={{ padding: '16px 20px', fontSize: 11, fontWeight: 800 }}>ATHLETE</th>
                  <th style={{ padding: '16px 20px', fontSize: 11, fontWeight: 800 }}>SESSION INTEL</th>
                  <th style={{ padding: '16px 20px', fontSize: 11, fontWeight: 800 }}>TIMESTAMP</th>
                  <th style={{ padding: '16px 20px', fontSize: 11, fontWeight: 800 }}>YIELD</th>
                  <th style={{ padding: '16px 20px', fontSize: 11, fontWeight: 800 }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(b => (
                  <tr key={b.id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 20px' }}>
                       <div style={{ fontWeight: 800, fontSize: 13 }}>{b.userId}</div>
                       <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700 }}>VERIFIED PLAYER</div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                       <div style={{ fontWeight: 700, fontSize: 13 }}>{b.turfName}</div>
                       <div style={{ fontSize: 10, color: 'var(--accent-blue)', fontWeight: 700 }}>FIELD {b.court}</div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                       <div style={{ fontSize: 13, fontWeight: 600 }}>{b.date}</div>
                       <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700 }}>{b.startTime}–{b.endTime}</div>
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
    </div>
  );
}
