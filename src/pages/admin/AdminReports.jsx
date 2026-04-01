import React, { useState, useMemo } from 'react';
import { useApp } from '../../store/AppContext';
import { 
  Building2, TrendingUp, DollarSign, Calendar, Users, Percent, Download, 
  MapPin, Activity, AlertCircle, Search, ChevronLeft, CreditCard, Clock, BarChart2,
  Tag, XOctagon, Star, Zap, MonitorPlay, Loader2
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PIE_COLORS = ['#00e676', '#eab308', '#ef4444', '#5b8def'];

export default function AdminReports() {
  const { turfs, bookings, payments, users, slots, coupons, addToast } = useApp();
  const [selectedTurfId, setSelectedTurfId] = useState(null);
  const [search, setSearch] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // MASTER TURF LIST (When no turf is selected)
  const turfSummary = useMemo(() => {
    return turfs.map(t => {
      const turfBookings = bookings.filter(b => b.turfId === t.id);
      const rev = turfBookings.filter(b => b.paymentStatus === 'paid').reduce((acc, curr) => acc + (curr.amount || 0), 0);
      return { ...t, totalBookings: turfBookings.length, totalRevenue: rev };
    }).sort((a,b) => b.totalRevenue - a.totalRevenue);
  }, [turfs, bookings]);

  const selectedTurf = useMemo(() => turfs.find(t => t.id === selectedTurfId), [turfs, selectedTurfId]);
  
  const reportData = useMemo(() => {
    if (!selectedTurf) return null;

    const tBookings = bookings.filter(b => b.turfId === selectedTurf.id);
    const completed = tBookings.filter(b => b.status === 'completed' || b.status === 'confirmed');
    const cancelled = tBookings.filter(b => b.status === 'cancelled');
    
    // Revenue & Payouts
    const totalRev = completed.reduce((sum, b) => sum + (b.amount || 0), 0);
    const platformComm = totalRev * 0.10;
    const ownerPayout = totalRev * 0.90;

    // Timeframe Booking Stats
    const todayStr = new Date().toISOString().split('T')[0];
    const todayBookings = tBookings.filter(b => b.date === todayStr).length;
    const weekBookings = Math.floor(tBookings.length * 0.3) + todayBookings; // Mock logic 
    const monthBookings = tBookings.length;
    const avgPerDay = monthBookings > 0 ? (monthBookings / 30).toFixed(1) : 0;
    
    // Failed Transactions
    const failedTxns = [
      { id: 'TXN-992', user: 'Vikas R.', amount: 1200, reason: 'Bank Server Timeout', date: todayStr },
      { id: 'TXN-984', user: 'Rahul M.', amount: 800, reason: 'Insufficient Funds', date: '2026-03-22' }
    ]; // Simulated for demo purposes based on User request 8

    // Slot Utilization approximation
    const tSlots = slots[selectedTurf.id] || [];
    const totalPossibleSlots = (tSlots.length || 10) * 30; // approx per month
    const bookedCount = completed.length;
    const utilizePct = totalPossibleSlots > 0 ? Math.min(Math.round((bookedCount / totalPossibleSlots) * 100), 100) : 0;

    // Fake daily activity for sparklines
    const activityTrend = [
      { day: 'Mon', bookings: Math.floor(Math.random() * 10) + 2 },
      { day: 'Tue', bookings: Math.floor(Math.random() * 10) + 3 },
      { day: 'Wed', bookings: Math.floor(Math.random() * 10) + 5 },
      { day: 'Thu', bookings: Math.floor(Math.random() * 15) + 5 },
      { day: 'Fri', bookings: Math.floor(Math.random() * 25) + 10 },
      { day: 'Sat', bookings: Math.floor(Math.random() * 35) + 20 },
      { day: 'Sun', bookings: Math.floor(Math.random() * 30) + 15 },
    ];

    const cancelReasons = [
      { name: 'User Cancelled', value: Math.max(1, Math.floor(cancelled.length * 0.6)) },
      { name: 'Weather', value: Math.max(1, Math.floor(cancelled.length * 0.3)) },
      { name: 'Owner Blocked', value: Math.floor(cancelled.length * 0.1) }
    ];
    const totalRefunded = cancelled.reduce((sum, b) => sum + (b.amount || 0), 0);

    // Offers & Coupons Impact
    const couponsUsedCount = completed.filter(b => b.amount < 1000).length; // Simulated usage
    const discountGiven = couponsUsedCount * 150; // Simulated 150rs off

    // Owner Performance mapping
    const ownerData = users.find(u => u.id === selectedTurf.ownerId) || { name: selectedTurf.ownerName || 'Unknown Owner', rating: 4.8, totalTurfs: 2 };

    return {
      tBookings, completed, cancelled, totalRev, platformComm, ownerPayout,
      todayBookings, weekBookings, monthBookings, avgPerDay,
      utilizePct, activityTrend, cancelReasons, totalRefunded,
      failedTxns, couponsUsedCount, discountGiven,
      ownerData,
      userCount: new Set(tBookings.map(b => b.userId)).size,
    };
  }, [selectedTurf, bookings, slots, users]);

  // PDF EXPORT HOOK
  const exportPDF = () => {
    setIsExporting(true);
    addToast('info', 'Generating PDF', 'Compiling text report...');
    
    try {
      const pdf = new jsPDF();
      
      pdf.setFontSize(22);
      pdf.text('TURF PERFORMANCE REPORT', 14, 20);
      
      pdf.setFontSize(16);
      pdf.setTextColor(100, 100, 100);
      pdf.text(selectedTurf.name, 14, 30);
      
      pdf.setFontSize(11);
      pdf.text(`Generated: ${new Date().toLocaleDateString()}  |  Status: ACTIVE`, 14, 38);
      
      pdf.setLineWidth(0.5);
      pdf.line(14, 42, 196, 42);

      // Section 1: Overview
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.text('1. Turf Overview & Demographics', 14, 55);
      
      pdf.setFontSize(11);
      pdf.setTextColor(50, 50, 50);
      pdf.text(`Owner Name: ${reportData.ownerData.name}`, 14, 65);
      pdf.text(`Location: ${selectedTurf.location}`, 14, 72);
      pdf.text(`Platform Rating: ${selectedTurf.rating || '4.8'} / 5.0`, 14, 79);
      pdf.text(`Total Active Courts: ${selectedTurf.courts}`, 14, 86);

      // Section 2: Financial
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.text('2. Financial & Payment Ledger', 14, 105);
      
      pdf.setFontSize(11);
      pdf.setTextColor(50, 50, 50);
      pdf.text(`Gross Turnover: Rs. ${reportData.totalRev.toLocaleString()}`, 14, 115);
      pdf.text(`Platform Commission (10%): Rs. ${reportData.platformComm.toLocaleString()}`, 14, 122);
      pdf.text(`Net Owner Payout: Rs. ${reportData.ownerPayout.toLocaleString()}`, 14, 129);

      // Section 3: Bookings
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.text('3. Booking Activity & Utilization', 14, 148);
      
      pdf.setFontSize(11);
      pdf.setTextColor(50, 50, 50);
      pdf.text(`Lifetime Total Bookings: ${reportData.monthBookings}`, 14, 158);
      pdf.text(`Bookings Today: ${reportData.todayBookings}`, 14, 165);
      pdf.text(`Current Slot Utilization Rate: ${reportData.utilizePct}% Filled`, 14, 172);
      pdf.text(`Average Daily Bookings: ${reportData.avgPerDay}`, 14, 179);

      // Section 4: Drops
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.text('4. Cancellations & Penalties', 14, 198);
      
      pdf.setFontSize(11);
      pdf.setTextColor(50, 50, 50);
      pdf.text(`Total Cancelled Bookings: ${reportData.cancelled.length} Drops`, 14, 208);
      pdf.text(`Total Refunded Revenue Lost: Rs. ${reportData.totalRefunded.toLocaleString()}`, 14, 215);

      // Section 5: Offers & reach
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.text('5. Market Reach & Offers Impact', 14, 234);
      
      pdf.setFontSize(11);
      pdf.setTextColor(50, 50, 50);
      pdf.text(`Unique Registered Players Reached: ${reportData.userCount} Players`, 14, 244);
      pdf.text(`Coupons Applied by Users: ${reportData.couponsUsedCount}`, 14, 251);
      pdf.text(`Total Discount Revenue Provided: Rs. ${reportData.discountGiven}`, 14, 258);
      
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text('TURFX Platform Generated Document - Confidential', 14, 285);

      pdf.save(`TURFX_Report_${selectedTurf.name.replace(/\s+/g, '_')}_Formal.pdf`);
      addToast('success', 'Report Exported', 'Formal text document generated.');
    } catch (error) {
      console.error('PDF Gen Error:', error);
      addToast('error', 'Export Failed', 'There was an issue creating the text document.');
    } finally {
      setIsExporting(false);
    }
  };

  // RENDER MASTER LIST
  if (!selectedTurfId) {
    const filteredTurfs = turfSummary.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.location.toLowerCase().includes(search.toLowerCase()));
    
    return (
      <div className="animate-fade">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Platform Reports Center</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Select a Turf to generate its complete real-time analytic dossier.</p>
          </div>
          <div style={{ position: 'relative', width: 300 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" style={{ paddingLeft: 38 }} placeholder="Search turfs by name or city..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filteredTurfs.map(t => (
            <div key={t.id} className="hover-lift" onClick={() => setSelectedTurfId(t.id)} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px', cursor: 'pointer', transition: 'var(--transition)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700 }}>{t.name}</h3>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12}/> {t.location}</div>
                  </div>
                </div>
                <span className={`badge badge-${t.status === 'approved' ? 'green' : 'yellow'}`}>{t.status}</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, background: 'var(--bg-secondary)', padding: '12px', borderRadius: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Total Revenue</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--accent-green)' }}>₹{t.totalRevenue.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>LT Bookings</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>{t.totalBookings}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // RENDER DETAILED REPORT DASHBOARD
  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 40 }}>
      {/* Header Utilities */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <button onClick={() => setSelectedTurfId(null)} className="btn btn-ghost hover-lift" style={{ padding: 12, borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <ChevronLeft size={20} /> Back to Directory
        </button>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary"><Clock size={16} /> Last 30 Days</button>
          <button className="btn btn-primary" onClick={exportPDF} disabled={isExporting} style={{ minWidth: 140, display: 'flex', justifyContent: 'center' }}>
            {isExporting ? <Loader2 size={16} className="animate-spin" /> : <><Download size={16} /> Export PDF</>}
          </button>
        </div>
      </div>

      <div id="report-content" style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 8, background: 'var(--bg-primary)' }}>
        
        {/* Core Identity & Live Tracker */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px', display: 'flex', justifyContent: 'space-between' }}>
             <div>
               <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                 <h1 style={{ fontSize: 28, fontWeight: 900 }}>{selectedTurf.name}</h1>
                 <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div className="status-dot online"/> WEBSOCKET LIVE</span>
               </div>
               <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
                 <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={14}/> {selectedTurf.location}</span>
                 <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Star size={14} color="var(--accent-yellow)"/> {selectedTurf.rating || '4.8'} Avg Rating</span>
                 <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Building2 size={14}/> {selectedTurf.courts} Courts</span>
               </div>
             </div>
             <div style={{ textAlign: 'right' }}>
               <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Owner Information</div>
               <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{reportData.ownerData.name}</div>
               <div style={{ fontSize: 12, color: 'var(--accent-blue)' }}>{reportData.ownerData.totalTurfs} Managed Properties</div>
             </div>
          </div>
          
          <div style={{ background: 'rgba(0,230,118,0.05)', border: '1px solid rgba(0,230,118,0.2)', borderRadius: 16, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
               <MonitorPlay size={18} color="var(--accent-green)" />
               <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent-green)' }}>Live Dashboard Status</h3>
             </div>
             <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>3 Players Active</div>
             <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Court A and B currently occupied.</div>
          </div>
        </div>

        {/* Payment & Revenue Report (Row 2) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { label: 'Total Platform Revenue', value: `₹${reportData.totalRev.toLocaleString()}`, color: 'var(--accent-yellow)', sub: 'Gross Turnover' },
            { label: 'Platform Commission', value: `₹${reportData.platformComm.toLocaleString()}`, color: 'var(--accent-orange)', sub: '10% Administrative Cut' },
            { label: 'Total Owner Payouts', value: `₹${reportData.ownerPayout.toLocaleString()}`, color: 'var(--accent-green)', sub: 'Net Earnings' },
            { label: 'Avg Bookings/Day', value: reportData.avgPerDay, color: 'var(--accent-blue)', sub: 'Based on 30 day window' },
          ].map((k,i) => (
            <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{k.label}</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: k.color, marginBottom: 4 }}>{k.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Booking & Slot Utilization Report (Row 3) */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><Calendar size={18} color="var(--accent-purple)"/> Booking History Report</h3>
              <div style={{ display: 'flex', gap: 16, fontSize: 12, fontWeight: 600 }}>
                <span style={{ color: 'var(--accent-green)' }}>Today: {reportData.todayBookings}</span>
                <span style={{ color: 'var(--accent-blue)' }}>This Week: {reportData.weekBookings}</span>
                <span style={{ color: 'var(--text-primary)' }}>Total: {reportData.monthBookings}</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={reportData.activityTrend}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-purple)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-purple)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Area type="monotone" dataKey="bookings" stroke="var(--accent-purple)" strokeWidth={3} fillOpacity={1} fill="url(#colorBookings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}><Activity size={18} color="var(--accent-blue)"/> Slot Utilization</h3>
            <div style={{ position: 'relative', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={[{value: reportData.utilizePct},{value: 100 - reportData.utilizePct}]} cx="50%" cy="50%" innerRadius={60} outerRadius={75} startAngle={90} endAngle={-270} dataKey="value" stroke="none">
                    <Cell fill="var(--accent-blue)" />
                    <Cell fill="var(--bg-secondary)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 900 }}>{reportData.utilizePct}%</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Inventory Filled</div>
              </div>
            </div>
            <div style={{ marginTop: 'auto', background: 'var(--bg-secondary)', padding: 12, borderRadius: 8, fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center' }}>
              Peak hours detected between <strong style={{ color: 'var(--text-primary)'}}>18:00 - 22:00</strong>
            </div>
          </div>
        </div>

        {/* Extra Reports Grid (Row 4) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          
          {/* User Activity */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}><Users size={16} color="var(--accent-green)"/> User Activity & Demographics</h3>
            <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 8 }}>{reportData.userCount} <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-muted)'}}>Unique Players</span></div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Most Active: <strong>Arjun Mehta</strong> (12 Bkgs)</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Region Demand: <strong>High</strong> (Local Area)</div>
          </div>

          {/* Cancellation & Refunds */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}><AlertCircle size={16} color="var(--accent-red)"/> Cancellation & Refund Log</h3>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{reportData.cancelled.length} Drops <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--accent-red)'}}>(₹{reportData.totalRefunded} Lost)</span></div>
            {reportData.cancelReasons.map((r, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 2 }}>
                  <span>{r.name}</span><span style={{ fontWeight: 700 }}>{r.value}</span>
                </div>
                <div style={{ width: '100%', height: 4, background: 'var(--bg-secondary)', borderRadius: 2 }}>
                  <div style={{ width: `${(r.value / Math.max(1, reportData.cancelled.length)) * 100}%`, height: '100%', background: PIE_COLORS[i] }} />
                </div>
              </div>
            ))}
          </div>

          {/* Offers & Coupons */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}><Tag size={16} color="var(--accent-orange)"/> Offers & Coupon Impact</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: 8 }}>
                 <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Coupons Applied</div>
                 <div style={{ fontSize: 18, fontWeight: 800 }}>{reportData.couponsUsedCount}</div>
              </div>
              <div style={{ background: 'rgba(249,115,22,0.1)', padding: '12px', borderRadius: 8, border: '1px solid rgba(249,115,22,0.2)' }}>
                 <div style={{ fontSize: 11, color: 'var(--accent-orange)' }}>Discount Revenue Eaten</div>
                 <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent-orange)' }}>₹{reportData.discountGiven}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Failed Transactions & Ledger Row (Row 5) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
          <div style={{ background: 'rgba(239,68,68,0.02)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px' }}>
             <h3 style={{ fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-red)', marginBottom: 16 }}><XOctagon size={16} /> Failed Transactions Log</h3>
             <div className="table-wrapper">
               <table style={{ background: 'transparent' }}>
                 <thead><tr><th>User</th><th>Amount</th><th>Status Reason</th></tr></thead>
                 <tbody>
                   {reportData.failedTxns.map(tx => (
                     <tr key={tx.id}>
                       <td style={{ fontSize: 12 }}>{tx.user}</td>
                       <td style={{ fontSize: 12, fontWeight: 600 }}>₹{tx.amount}</td>
                       <td style={{ fontSize: 11, color: 'var(--accent-red)' }}>{tx.reason}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><CreditCard size={16} color="var(--accent-blue)"/> Real-Time Master Booking Ledger</h3>
              <button className="btn btn-ghost btn-sm">Full Screen</button>
            </div>
            <div className="table-wrapper" style={{ maxHeight: 200, overflowY: 'auto' }}>
              <table style={{ background: 'transparent' }}>
                <thead>
                  <tr><th>Booking ID</th><th>Date & Slot</th><th>User ID</th><th>Amount</th><th>Ledger Status</th></tr>
                </thead>
                <tbody>
                  {reportData.tBookings.map(b => (
                    <tr key={b.id}>
                      <td style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--text-muted)' }}>#{b.id}</td>
                      <td style={{ fontSize: 12 }}>{b.date} <span style={{ color: 'var(--text-muted)' }}>({b.startTime})</span></td>
                      <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{b.userId}</td>
                      <td style={{ fontWeight: 600, color: 'var(--accent-green)', fontSize: 13 }}>₹{b.amount}</td>
                      <td><span className={`badge badge-${b.status === 'confirmed' ? 'green' : b.status === 'cancelled' ? 'red' : 'blue'}`}>{b.status}</span></td>
                    </tr>
                  ))}
                  {reportData.tBookings.length === 0 && (
                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>No ledger data available.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
