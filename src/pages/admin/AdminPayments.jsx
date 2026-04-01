import React, { useState, useMemo } from 'react';
import { useApp } from '../../store/AppContext';
import { CreditCard, Wallet, ArrowDownRight, ArrowUpRight, Search, FileText, X } from 'lucide-react';
import Modal from '../../components/Modal';

export default function AdminPayments() {
  const { payments, setPayments, turfs, users, bookings, addToast } = useApp();
  const [activeTab, setActiveTab] = useState('inflows'); // 'inflows' | 'outflows'
  const [search, setSearch] = useState('');
  const [settleModal, setSettleModal] = useState(null);

  // INFLOWS: User Payments -> Platform (100% of booking amount)
  const inflows = useMemo(() => {
    return payments.map(p => {
      const b = bookings.find(b => b.id === p.bookingId);
      const t = turfs.find(t => t.id === p.turfId);
      return { ...p, turfName: t?.name, userName: b?.userId || p.userId };
    }).filter(p => !search || p.transactionId.toLowerCase().includes(search.toLowerCase()) || p.userName?.toLowerCase().includes(search.toLowerCase()));
  }, [payments, bookings, turfs, search]);

  const totalInflow = inflows.filter(p => p.status === 'success').reduce((s, p) => s + p.amount, 0);

  // OUTFLOWS: Platform -> Owners (90% of revenue)
  const outflows = useMemo(() => {
    const ownerBalances = {};

    payments.filter(p => p.status === 'success' && p.payoutStatus !== 'settled').forEach(p => {
      const turf = turfs.find(t => t.id === p.turfId);
      if (turf) {
        if (!ownerBalances[turf.ownerId]) {
          const owner = users.find(u => u.id === turf.ownerId);
          ownerBalances[turf.ownerId] = {
            id: `payout-${turf.ownerId}`,
            ownerId: turf.ownerId,
            ownerName: owner?.name || 'Unknown Owner',
            totalRevenue: 0,
            transactionCount: 0,
            status: 'pending' // simulated payout status
          };
        }
        ownerBalances[turf.ownerId].totalRevenue += p.amount;
        ownerBalances[turf.ownerId].transactionCount += 1;
      }
    });

    return Object.values(ownerBalances).map(b => ({
      ...b,
      netPayout: b.totalRevenue * 0.90,
      adminCommission: b.totalRevenue * 0.10,
    })).filter(o => !search || o.ownerName.toLowerCase().includes(search.toLowerCase()));
  }, [payments, turfs, users, search]);

  const totalOutflowPending = outflows.filter(o => o.status === 'pending').reduce((s, o) => s + o.netPayout, 0);
  const totalCommissionEarned = outflows.reduce((s, o) => s + o.adminCommission, 0);

  const handleSettleOwner = () => {
    if (!settleModal) return;
    
    setPayments(prev => prev.map(p => {
      const turf = turfs.find(t => t.id === p.turfId);
      if (turf && turf.ownerId === settleModal.ownerId && p.status === 'success' && p.payoutStatus !== 'settled') {
        return { ...p, payoutStatus: 'settled', settledAt: new Date().toISOString() };
      }
      return p;
    }));
    
    addToast('success', 'Funds Transferred', `Successfully settled ₹${settleModal.netPayout.toLocaleString()} with ${settleModal.ownerName}.`);
    setSettleModal(null);
  };

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}>Ledger & Payments Center</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Separate tracking for User Booking Inflows and Turf Owner Payouts.</p>
        </div>
        <div style={{ position: 'relative', width: 280 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="form-input" style={{ paddingLeft: 38 }} placeholder="Search transactions or users..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
        <button 
          onClick={() => setActiveTab('inflows')}
          className="hover-lift"
          style={{ 
            padding: 24, borderRadius: 20, border: '1px solid var(--border)', textAlign: 'left', cursor: 'pointer', transition: 'var(--transition)',
            background: activeTab === 'inflows' ? 'rgba(0,230,118,0.06)' : 'var(--bg-card)', 
            borderColor: activeTab === 'inflows' ? 'rgba(0,230,118,0.3)' : 'var(--border)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, var(--accent-green), var(--accent-blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <ArrowDownRight size={24} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: 0.5 }}>USER TRANSACTIONS</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)' }}>₹{totalInflow.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>GROSS_INFLOW</div>
            </div>
          </div>
        </button>

        <button 
          onClick={() => setActiveTab('outflows')}
          className="hover-lift"
          style={{ 
            padding: 24, borderRadius: 20, border: '1px solid var(--border)', textAlign: 'left', cursor: 'pointer', transition: 'var(--transition)',
            background: activeTab === 'outflows' ? 'rgba(139,92,246,0.06)' : 'var(--bg-card)', 
            borderColor: activeTab === 'outflows' ? 'rgba(139,92,246,0.3)' : 'var(--border)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-red))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <ArrowUpRight size={24} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: 0.5 }}>OWNER PAYOUTS</span>
            </div>
            <div style={{ textAlign: 'right' }}>
               <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)' }}>₹{totalOutflowPending.toLocaleString()}</div>
               <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>PENDING_SETTLEMENT</div>
            </div>
          </div>
        </button>
        
        <div style={{ padding: 24, borderRadius: 20, background: 'var(--bg-secondary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(234,179,8,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-yellow)' }}><Wallet size={24} /></div>
            <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: 0.5 }}>PLATFORM COMMISSION</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--accent-yellow)' }}>₹{totalCommissionEarned.toLocaleString()}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>LOCKED_REVENUE</div>
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <FileText size={18} color="var(--accent-blue)" /> 
          {activeTab === 'inflows' ? 'User Booking Inbound Ledger' : 'Turf Owner Settlement Outbound Ledger'}
        </h3>
        
        <div className="table-wrapper">
          {activeTab === 'inflows' ? (
            <table>
              <thead>
                <tr><th>TXN Tag</th><th>Date</th><th>Origin User</th><th>Gateway / Turf</th><th>Status</th><th style={{ textAlign: 'right' }}>Amount</th></tr>
              </thead>
              <tbody>
                {inflows.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-muted)' }}>{p.transactionId}</td>
                    <td style={{ fontSize: 12 }}>{p.createdAt}</td>
                    <td style={{ fontSize: 13, fontWeight: 600 }}>{p.userName}</td>
                    <td>
                      <div style={{ fontSize: 12 }}>{p.method}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{p.turfName}</div>
                    </td>
                    <td><span className={`badge badge-${p.status === 'success' ? 'green' : p.status === 'refunded' ? 'orange' : 'red'}`}>{p.status}</span></td>
                    <td style={{ fontWeight: 800, color: 'var(--accent-green)', textAlign: 'right' }}>+ ₹{p.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table>
              <thead>
                <tr><th>Payout ID</th><th>Partner / Owner</th><th>TXN Volume</th><th>Our Commission</th><th>Payout Status</th><th style={{ textAlign: 'right' }}>Net Payable Amount</th></tr>
              </thead>
              <tbody>
                {outflows.map(o => (
                  <tr key={o.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-muted)' }}>{o.id}</td>
                    <td style={{ fontSize: 14, fontWeight: 700 }}>{o.ownerName}</td>
                    <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{o.transactionCount} bookings (₹{o.totalRevenue})</td>
                    <td style={{ fontWeight: 700, color: 'var(--accent-yellow)' }}>₹{o.adminCommission}</td>
                    <td>
                      <button 
                        className="badge badge-yellow hover-lift" 
                        style={{ cursor: 'pointer', border: 'none' }}
                        onClick={() => setSettleModal(o)}
                      >
                        Settle Now
                      </button>
                    </td>
                    <td style={{ fontWeight: 900, color: 'var(--accent-purple)', textAlign: 'right' }}>- ₹{o.netPayout.toLocaleString()}</td>
                  </tr>
                ))}
                {outflows.length === 0 && (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>No outflow ledger data.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal isOpen={!!settleModal} onClose={() => setSettleModal(null)}>
        {settleModal && (
          <div className="animate-fade" style={{ maxWidth: 440, background: 'var(--bg-card)', borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: 18, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}><ArrowUpRight size={20} color="var(--accent-purple)"/> Confirm Settlement</h3>
              <button onClick={() => setSettleModal(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
                You are about to clear the pending balance and officially log a payout transfer to the turf owner.
              </p>
              
              <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 12, padding: 20, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Beneficiary:</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{settleModal.ownerName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Transactions Included:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{settleModal.transactionCount} bookings</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Platform Commission Withheld:</span>
                  <span style={{ fontWeight: 600, color: 'var(--accent-yellow)' }}>₹{settleModal.adminCommission.toLocaleString()}</span>
                </div>
                <div style={{ borderTop: '1px dashed var(--border)', margin: '12px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Net Transfer Amount:</span>
                  <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--accent-green)' }}>₹{settleModal.netPayout.toLocaleString()}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setSettleModal(null)}>Cancel</button>
                <button className="btn btn-primary" style={{ flex: 2, background: 'var(--accent-purple)', color: '#fff' }} onClick={handleSettleOwner}>
                  Confirm & Transfer Funds
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
