import React from 'react';
import { useApp } from '../../store/AppContext';
import { DollarSign, TrendingUp, Calendar, CreditCard, ArrowUp, Shield, X, Building2, Check } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { analyticsData } from '../../data/mockData';
import Modal from '../../components/Modal';

export default function EarningsPage() {
  const { ownerStats, ownerBookings, currentUser, ownerTurfs } = useApp();
  const [filters, setFilters] = React.useState({ venue: 'all', status: 'all', range: 'all' });
  
  // ownerTurfs is reactive and already filtered for this owner
  const myTurfs = ownerTurfs || [];

  // Derived filtered data
  const filteredBookings = ownerBookings.filter(b => {
    const venueMatch = filters.venue === 'all' || b.turfId === filters.venue;
    const statusMatch = filters.status === 'all' || b.paymentStatus === filters.status;
    return venueMatch && statusMatch;
  });

  const [showAuditModal, setShowAuditModal] = React.useState(false);

  const stats = React.useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const paidOnly = filteredBookings.filter(b => b.paymentStatus === 'paid');
    
    const gross = paidOnly.reduce((acc, curr) => acc + curr.amount, 0);
    const totalSlots = paidOnly.length;
    
    const todayBookings = paidOnly.filter(b => b.date === todayStr);
    const todayRevenue = todayBookings.reduce((acc, curr) => acc + curr.amount, 0);
    const todaySlots = todayBookings.length;

    const platformFee = Math.round(gross * 0.1);
    const netPayout = gross - platformFee;
    const refunded = filteredBookings.filter(b => b.paymentStatus === 'refunded').reduce((acc, curr) => acc + curr.amount, 0);

    const todayPlatformFee = Math.round(todayRevenue * 0.1);
    const todayNetPayout = todayRevenue - todayPlatformFee;
    
    return { gross, platformFee, netPayout, refunded, todayRevenue, todaySlots, totalSlots, todayPlatformFee, todayNetPayout };
  }, [filteredBookings]);

  // Per-venue audit breakdown
  const auditBreakdown = React.useMemo(() => {
    return myTurfs.map(t => {
      const vBookings = filteredBookings.filter(b => b.turfId === t.id && b.paymentStatus === 'paid');
      const gross = vBookings.reduce((acc, curr) => acc + curr.amount, 0);
      const commission = Math.round(gross * 0.1);
      const net = gross - commission;
      return { name: t.name, gross, commission, net, count: vBookings.length };
    });
  }, [myTurfs, filteredBookings]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: 'rgba(22,22,30,0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: '16px', boxShadow: '0 12px 32px rgba(0,0,0,0.4)' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', fontWeight: 800, letterSpacing: 1, marginBottom: 8 }}>Revenue · {label}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <div style={{ color: 'var(--accent-green)', fontWeight: 900, fontSize: 22 }}>₹{payload[0].value?.toLocaleString()}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 8 }}>Financial Audit</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Comprehensive breakdown of revenue and platform settlements.</p>
        </div>
        <button className="btn btn-primary btn-sm" style={{ padding: '10px 16px' }} onClick={() => setShowAuditModal(true)}><ArrowUp size={14} style={{ transform: 'rotate(45deg)' }} /> Settlement History</button>
      </div>

      <Modal isOpen={showAuditModal} onClose={() => setShowAuditModal(false)}>
         <div style={{ width: 600, background: 'var(--bg-card)', borderRadius: 24, padding: 32, border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
               <div>
                  <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4 }}>Revenue Reconciliation</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Venue-specific payout audit for the current period.</p>
               </div>
               <button className="btn btn-ghost btn-icon" onClick={() => setShowAuditModal(false)}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
               {auditBreakdown.map(v => (
                 <div key={v.name} style={{ padding: '20px', borderRadius: 16, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                       <div style={{ fontWeight: 800, fontSize: 18 }}>{v.name}</div>
                       <div className="badge badge-blue">{v.count} Bookings</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                       <div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Gross Sales</div>
                          <div style={{ fontWeight: 700 }}>₹{v.gross.toLocaleString()}</div>
                       </div>
                       <div>
                          <div style={{ fontSize: 11, color: 'var(--accent-orange)', marginBottom: 4 }}>Platform (10%)</div>
                          <div style={{ fontWeight: 700, color: 'var(--accent-orange)' }}>- ₹{v.commission.toLocaleString()}</div>
                       </div>
                       <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 11, color: 'var(--accent-green)', marginBottom: 4 }}>Your Net</div>
                          <div style={{ fontWeight: 800, color: 'var(--accent-green)', fontSize: 18 }}>₹{v.net.toLocaleString()}</div>
                       </div>
                    </div>
                 </div>
               ))}
            </div>

            <div style={{ marginTop: 32, padding: '16px', borderRadius: 12, background: 'var(--bg-body)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total Net Reconciliation</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--accent-green)' }}>₹{stats.netPayout.toLocaleString()}</div>
               </div>
               <button className="btn btn-primary btn-sm" onClick={() => { setShowAuditModal(false); alert('Audit report generated in dashboard logs.'); }}>Confirm & Close</button>
            </div>
         </div>
      </Modal>

      {/* Financial Health Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
        {[
          { label: 'Daily Sales', value: `₹${stats.todayRevenue.toLocaleString()}`, icon: <Calendar size={20} />, color: '#8b5cf6', desc: `${stats.todaySlots} slots today` },
          { label: 'Gross Revenue', value: `₹${stats.gross.toLocaleString()}`, icon: <DollarSign size={20} />, color: '#00e676', desc: `${stats.totalSlots} total slots` },
          { label: 'Platform Fee (10%)', value: `₹${stats.platformFee.toLocaleString()}`, icon: <Shield size={20} />, color: '#f97316', desc: `Today: ₹${stats.todayPlatformFee.toLocaleString()}` },
          { label: 'Net Payout', value: `₹${stats.netPayout.toLocaleString()}`, icon: <TrendingUp size={20} />, color: '#5b8def', desc: `Today: ₹${stats.todayNetPayout.toLocaleString()}` },
          { label: 'Refunded', value: `₹${stats.refunded.toLocaleString()}`, icon: <X size={20} />, color: '#ef4444', desc: 'Processed returns' },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding: '24px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${k.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: k.color }}>{k.icon}</div>
                <div>
                   <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{k.label}</div>
                   <div style={{ fontSize: 11, color: k.color, fontWeight: 700 }}>{k.desc}</div>
                </div>
             </div>
             <div style={{ fontSize: 24, fontWeight: 900 }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="card" style={{ padding: '16px 24px', marginBottom: 24, display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
             <Building2 size={16} color="var(--text-muted)" />
             <select 
               className="form-input" 
               style={{ width: 220, padding: '8px 12px', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
               value={filters.venue}
               onChange={e => setFilters(p => ({ ...p, venue: e.target.value }))}
             >
               <option value="all" style={{ background: '#1a1f26', color: '#fff' }}>All Venues</option>
               {myTurfs.map(t => <option key={t.id} value={t.id} style={{ background: '#1a1f26', color: '#fff' }}>{t.name}</option>)}
             </select>
          </div>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
             <DollarSign size={16} color="var(--text-muted)" />
             <select 
               className="form-input" 
               style={{ width: 160, padding: '8px 12px', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
               value={filters.status}
               onChange={e => setFilters(p => ({ ...p, status: e.target.value }))}
             >
               <option value="all" style={{ background: '#1a1f26', color: '#fff' }}>All Status</option>
               <option value="paid" style={{ background: '#1a1f26', color: '#fff' }}>Paid</option>
               <option value="refunded" style={{ background: '#1a1f26', color: '#fff' }}>Refunded</option>
             </select>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
             <button className="btn btn-secondary btn-sm" onClick={() => setFilters({ venue: 'all', status: 'all', range: 'all' })}>Reset Filters</button>
          </div>
      </div>

      <div style={{ gridTemplateColumns: '1fr', display: 'grid', gap: 24 }}>
        {/* Transaction Ledger */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <h3 style={{ fontSize: 18, fontWeight: 800 }}>Transaction Ledger</h3>
             <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Showing {filteredBookings.length} records</div>
          </div>
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>Order Ref</th>
                  <th>Venue</th>
                  <th>Gross Amount</th>
                  <th>Comm. (10%)</th>
                  <th>Net Payout</th>
                  <th>Settled At</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[...filteredBookings].reverse().map(b => {
                  const comm = Math.round(b.amount * 0.1);
                  const net = b.amount - comm;
                  return (
                    <tr key={b.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>{b.transactionId || '---'}</td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{b.turfName}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.sport} · {b.startTime}</div>
                      </td>
                      <td style={{ fontWeight: 700 }}>₹{b.amount}</td>
                      <td style={{ color: 'var(--accent-orange)', fontSize: 13 }}>- ₹{comm}</td>
                      <td style={{ fontWeight: 800, color: 'var(--accent-green)', fontSize: 15 }}>₹{net}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{b.date}</td>
                      <td>
                         <span className={`badge ${b.paymentStatus === 'paid' ? 'badge-green' : 'badge-red'}`} style={{ textTransform: 'capitalize' }}>
                            {b.paymentStatus}
                         </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payout Forecast */}
      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24 }}>
          <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                 <h4 style={{ fontSize: 16, fontWeight: 800 }}>Payout Schedule</h4>
                 <div className="badge badge-blue">Next Batch: Mar 26</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                 <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                       <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Pending Settlement</div>
                       <div style={{ fontSize: 20, fontWeight: 900 }}>₹{(stats.netPayout * 0.4).toFixed(0)}</div>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={() => setShowAuditModal(true)}>Audit Details</button>
                 </div>
                 <div style={{ padding: '16px', background: 'var(--accent-green)05', borderRadius: 12, border: '1px dashed var(--accent-green)40', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                       <div style={{ fontSize: 12, color: 'var(--accent-green)' }}>Processed This Month</div>
                       <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--accent-green)' }}>₹{(stats.netPayout * 0.6).toFixed(0)}</div>
                    </div>
                    <Check color="var(--accent-green)" />
                 </div>
              </div>
          </div>

          <div className="card" style={{ padding: '24px', background: 'linear-gradient(135deg, #0d1117, #161b22)' }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 16 }}>Admin Payout Logic</h4>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: 16 }}>
                 All transactions are split at the source. The platform retains a <span style={{ color: 'var(--accent-orange)', fontWeight: 700 }}>10% service fee</span> for maintenance and marketing. Your earnings are settled every Wednesday.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, fontSize: 11 }}>
                 <Shield size={14} color="var(--accent-green)" />
                 <span>Automated by TURFX Payments</span>
              </div>
          </div>
      </div>
    </div>
  );
}
