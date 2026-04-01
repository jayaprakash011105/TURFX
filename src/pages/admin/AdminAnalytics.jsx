import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, AreaChart, Area } from 'recharts';
import { analyticsData } from '../../data/mockData';
import { TrendingUp, Clock, Activity, BarChart2 } from 'lucide-react';

const CustomTT = ({ active, payload, label }) => active && payload?.length ? (
  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
    <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
    {payload.map((p, i) => <div key={i} style={{ color: p.color, fontWeight: 700 }}>{p.value} {p.dataKey === 'amount' ? '' : 'bookings'}</div>)}
  </div>
) : null;

export default function AdminAnalytics() {
  const { adminStats, bookings } = useApp();
  const [period, setPeriod] = useState('monthly');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Analytics & Insights</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Platform performance metrics and trends</p>
        </div>
        <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: 4, borderRadius: 10, gap: 2 }}>
          {['daily','weekly','monthly'].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: period === p ? 'var(--bg-card)' : 'transparent', color: period === p ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: period === p ? 600 : 400, fontSize: 12, cursor: 'pointer', textTransform: 'capitalize' }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Revenue Area Chart */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>Revenue Overview</h3>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Monthly gross platform revenue</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--accent-green)' }}>₹1,10,000</div>
            <div style={{ fontSize: 12, color: 'var(--accent-green)' }}>↑ 18% this month</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={analyticsData.revenue}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-green)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--accent-green)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
            <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={v => `₹${v/1000}k`} />
            <Tooltip content={<CustomTT />} />
            <Area type="monotone" dataKey="amount" stroke="var(--accent-green)" fill="url(#revGrad)" strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Bookings by Day Analysis */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(91,141,239,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BarChart2 size={20} color="var(--accent-blue)" />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800 }}>Weekly Booking Distribution</h3>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Aggregate platform behavior</div>
              </div>
            </div>
            <div style={{ background: 'rgba(139,92,246,0.1)', padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(139,92,246,0.2)' }}>
              <div style={{ fontSize: 10, color: 'var(--accent-purple)', fontWeight: 800, textTransform: 'uppercase' }}>Most Active</div>
              <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--text-primary)' }}>{analyticsData.bookingsByDay.reduce((prev, current) => (prev.bookings > current.bookings) ? prev : current).day}</div>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analyticsData.bookingsByDay} barSize={28}>
              <defs>
                <linearGradient id="analyticsBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.7}/>
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                stroke="var(--text-muted)" 
                fontSize={12} 
                dy={8}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                stroke="var(--text-muted)" 
                fontSize={11} 
                dx={-4}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 8 }}
                content={<CustomTT />} 
              />
              <Bar 
                dataKey="bookings" 
                fill="url(#analyticsBarGrad)" 
                radius={[8,8,2,2]} 
                animationDuration={1500}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Peak Hours */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(249,115,22,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={18} color="var(--accent-orange)" />
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>Peak Hours</h3>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Booking heatmap by hour</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analyticsData.peakHours} barSize={10}>
              <XAxis dataKey="hour" stroke="var(--text-muted)" fontSize={9} interval={2} />
              <YAxis stroke="var(--text-muted)" fontSize={10} />
              <Tooltip content={<CustomTT />} />
              <Bar dataKey="bookings" fill="var(--accent-orange)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
        {[
          { label: 'Avg Daily Bookings', value: '34', trend: '↑ 12%', color: 'var(--accent-green)' },
          { label: 'Peak Day', value: 'Saturday', trend: '58 bookings', color: 'var(--accent-blue)' },
          { label: 'Peak Hour', value: '6:00 PM', trend: '62 bookings', color: 'var(--accent-orange)' },
          { label: 'Top Sport', value: 'Football', trend: '42% of bookings', color: 'var(--accent-purple)' },
          { label: 'Avg Booking Value', value: '₹880', trend: '↑ 5%', color: 'var(--accent-yellow)' },
          { label: 'Cancellation Rate', value: '8.3%', trend: '↓ 2%', color: 'var(--accent-red)' },
        ].map(m => (
          <div key={m.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: m.color, marginBottom: 4 }}>{m.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.label}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{m.trend}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
