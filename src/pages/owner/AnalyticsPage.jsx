import React from 'react';
import { useApp } from '../../store/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Activity, Target, PieChart as PieIcon, BarChart as BarIcon, Shield, Clock } from 'lucide-react';
import { analyticsData } from '../../data/mockData';

export default function AnalyticsPage() {
  const { ownerStats, ownerTurfs } = useApp();
  
  const COLORS = ['#5b8def', '#00e676', '#f97316', '#8b5cf6', '#ef4444'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: 'rgba(22,22,30,0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: '16px', boxShadow: '0 12px 32px rgba(0,0,0,0.4)' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', fontWeight: 800, letterSpacing: 1, marginBottom: 8 }}>Metric · {label}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <div style={{ color: 'var(--accent-green)', fontWeight: 900, fontSize: 22 }}>₹{payload[0].value?.toLocaleString()}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4 }}>Deep Analytics Hub</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Advanced data visualization for your venue performance.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
         {[
           { label: 'Booking Retention', value: '78%', icon: <Target size={20} />, color: '#00e676', desc: 'Repeat customers' },
           { label: 'Avg. Lead Time', value: '3.4 Days', icon: <Clock size={20} />, color: '#5b8def', desc: 'Advance bookings' },
           { label: 'Platform ROI', value: '4.2x', icon: <TrendingUp size={20} />, color: '#8b5cf6', desc: 'Revenue per search' },
           { label: 'Safety Index', value: '98%', icon: <Shield size={20} />, color: '#f97316', desc: 'Refund rate low' }
         ].map(stat => (
           <div key={stat.label} className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>{stat.icon}</div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{stat.label}</div>
                  <div style={{ fontSize: 11, color: stat.color, fontWeight: 700 }}>{stat.desc}</div>
                </div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 900 }}>{stat.value}</div>
           </div>
         ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 24 }}>
         {/* Monthly Revenue Area Chart */}
         <div className="card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
               <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800 }}>Revenue Growth Index</h3>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Last 6 months combined performance</div>
               </div>
               <div className="badge badge-green">↑ 14% Growth YoY</div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
               <AreaChart data={analyticsData.revenue}>
                  <defs>
                     <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00e676" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00e676" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="amount" stroke="#00e676" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
               </AreaChart>
            </ResponsiveContainer>
         </div>

         {/* Sport Popularity Pie */}
         <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 24 }}>Sport Category Share</h3>
            <ResponsiveContainer width="100%" height={220}>
               <PieChart>
                  <Pie
                    data={[
                      { name: 'Football', value: 45 },
                      { name: 'Cricket', value: 30 },
                      { name: 'Badminton', value: 15 },
                      { name: 'Others', value: 10 },
                    ]}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {[0,1,2,3].map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
               </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
               {['Football', 'Cricket', 'Badminton', 'Others'].map((s, i) => (
                 <div key={s} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                       <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i] }}></div> {s}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{45 - i * 12}%</div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Hourly Occupancy Heatmap (Simulated with Bar) */}
      <div className="card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
             <div>
                <h3 style={{ fontSize: 16, fontWeight: 800 }}>Peak Hour Density</h3>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Average court occupancy by time of day</div>
             </div>
             <BarIcon size={20} color="var(--text-muted)" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
             <BarChart data={[
               { time: '06 AM', load: 20 }, { time: '08 AM', load: 35 }, { time: '10 AM', load: 45 },
               { time: '12 PM', load: 30 }, { time: '02 PM', load: 25 }, { time: '04 PM', load: 55 },
               { time: '06 PM', load: 85 }, { time: '08 PM', load: 95 }, { time: '10 PM', load: 80 },
               { time: '12 AM', load: 40 },
             ]} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={11} axisLine={false} tickLine={false} dy={10} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="load" radius={[8, 8, 0, 0]}>
                   {[0,1,2,3,4,5,6,7,8,9].map((e, index) => (
                     <Cell key={`cell-${index}`} fill={index > 5 ? 'var(--accent-blue)' : 'var(--text-muted)'} opacity={index > 5 ? 0.8 : 0.3} />
                   ))}
                </Bar>
             </BarChart>
          </ResponsiveContainer>
      </div>
    </div>
  );
}
