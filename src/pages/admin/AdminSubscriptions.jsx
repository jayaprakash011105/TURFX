import React from 'react';
import { useApp } from '../../store/AppContext';
import { Shield, Zap, User, Search, Filter, MoreVertical, CreditCard, TrendingUp, CheckCircle2, AlertCircle, Plus, Info, Activity } from 'lucide-react';

export default function AdminSubscriptions() {
  const { users, setUsers, ownerTurfs, addToast } = useApp();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeOwner, setActiveOwner] = React.useState(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleUpdate = (type, value) => {
    setIsProcessing(true);
    setTimeout(() => {
      setUsers(prev => prev.map(u => {
        if (u.id === activeOwner.id) {
          return type === 'tier' ? { ...u, subscription: value } : { ...u, status: value };
        }
        return u;
      }));
      setIsProcessing(false);
      setActiveOwner(null);
      addToast('success', 'Registry Updated', `${activeOwner.name}'s partnership status has been successfully modified.`);
    }, 1500);
  };

  // Derived Owner Subscription Ledger: Fully Synchronized with Live Data
  const owners = React.useMemo(() => {
    return users
      .filter(u => u.role === 'owner')
      .map(o => {
        // Map plan titles based on the subscription key in the live user object
        const planMap = {
          'premium-elite': { title: 'Premium Elite', cost: 4999 },
          'star-pro': { title: 'Star Pro', cost: 1999 },
          'standard': { title: 'Standard', cost: 999 }
        };
        const p = planMap[o.subscription] || planMap['standard'];
        
        return {
          ...o,
          plan: p.title,
          revenue: p.cost,
          venues: ownerTurfs.filter(t => t.ownerId === o.id).length || 1, // Count actual venues linked to this owner
          renewal: '2026-05-12' // Simulating for billing cycle
        };
      })
      .filter(o => o.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, users, ownerTurfs]);

  const totalRevenue = owners.reduce((s, o) => s + o.revenue, 0);

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4 }}>Partner Subscriptions</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Audit and manage corporate tiers for Turf Owners & Venue Partners.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
           <button className="btn btn-secondary btn-sm"><TrendingUp size={14} /> Revenue Report</button>
           <button className="btn btn-primary"><Zap size={18} /> Upgrade Partner</button>
        </div>
      </div>

      {/* Corporate Financials Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
         {[
           { label: 'Platform Partners', value: owners.length, icon: <User size={20} />, color: '#5b8def', sub: 'Verified Owners' },
           { label: 'Partner ARR', value: `₹${totalRevenue.toLocaleString()}`, icon: <TrendingUp size={20} />, color: '#00e676', sub: 'Subscription Revenue' },
           { label: 'Market Visibility', value: '40%', icon: <Zap size={20} />, color: '#f97316', sub: 'Premium Tiers' },
           { label: 'Retention Health', value: '98%', icon: <CheckCircle2 size={20} />, color: '#8b5cf6', sub: 'Owner Renewals' }
         ].map(stat => (
           <div key={stat.label} className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>{stat.icon}</div>
                <div>
                   <div style={{ fontSize: 13, fontWeight: 800 }}>{stat.label}</div>
                   <div style={{ fontSize: 11, color: stat.color, fontWeight: 700 }}>{stat.sub}</div>
                </div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 900 }}>{stat.value}</div>
           </div>
         ))}
      </div>

      <div className="card" style={{ padding: '20px', marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
             <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
             <input type="text" className="form-input" placeholder="Search by partner name or business email..." style={{ paddingLeft: 40, width: '100%' }} value={searchTerm} onChange={r => setSearchTerm(r.target.value)} />
          </div>
          <button className="btn btn-secondary btn-icon"><Filter size={16} /></button>
      </div>

      {/* Multi-Tier Partner Ledger */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 20 }}>
         {owners.map(owner => (
           <div key={owner.id} className="card hover-scale" style={{ padding: 0, overflow: 'hidden', border: owner.plan.includes('Elite') ? '1px solid rgba(0,230,118,0.3)' : '1px solid var(--border)' }}>
              {owner.plan.includes('Elite') && (
                <div style={{ background: 'linear-gradient(90deg, #00e676, #00c853)', color: '#000', fontSize: 10, padding: '4px 12px', fontWeight: 900, textAlign: 'center', letterSpacing: 1, textTransform: 'uppercase' }}>⭐ Premium Platform Partner ⭐</div>
              )}
              <div style={{ padding: '24px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                       <div style={{ width: 56, height: 56, borderRadius: 16, background: owner.plan.includes('Elite') ? '#00e67610' : 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900, color: owner.plan.includes('Elite') ? '#00e676' : 'var(--text-muted)' }}>{owner.name.charAt(0)}</div>
                       <div>
                          <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 2 }}>{owner.name}</h3>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}><CreditCard size={10} /> {owner.email}</div>
                       </div>
                    </div>
                    <button className="btn btn-ghost btn-icon" onClick={() => setActiveOwner(owner)}><MoreVertical size={16} /></button>
                 </div>

                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                    <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid var(--border)' }}>
                       <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800, marginBottom: 4 }}>CURRENT PLAN</div>
                       <div style={{ fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                          {owner.plan.includes('Elite') ? <Zap size={14} color="#00e676" /> : <Shield size={14} color="#5b8def" />} {owner.plan}
                       </div>
                    </div>
                    <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid var(--border)' }}>
                       <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800, marginBottom: 4 }}>MANAGED ASSETS</div>
                       <div style={{ fontSize: 16, fontWeight: 900 }}>{owner.venues} Venues</div>
                    </div>
                 </div>

                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div>
                       <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800 }}>SUBSCRIPTION REVENUE</div>
                       <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--accent-green)' }}>₹{owner.revenue.toLocaleString()}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800 }}>PARTNER STATUS</div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: owner.status === 'active' || owner.status === 'Active' ? '#00e676' : '#ef4444', fontSize: 13, fontWeight: 800 }}>
                          {(owner.status === 'active' || owner.status === 'Active') ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />} {owner.status.toUpperCase()}
                       </div>
                    </div>
                 </div>

                 <div style={{ height: 1, background: 'var(--border)', marginBottom: 20 }}></div>

                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}><Info size={12} /> Renewal: <strong>{owner.renewal}</strong></div>
                    <button className="btn btn-secondary btn-sm" style={{ padding: '6px 12px', fontSize: 11 }} onClick={() => setActiveOwner(owner)}>Modify Access</button>
                 </div>
              </div>
           </div>
         ))}
      </div>

      {activeOwner && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
           <div className="card animate-fade" style={{ width: 450, padding: 32, borderRadius: 24, border: '1px solid var(--border)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                 <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: '#00e67615', border: '1px solid #00e67630', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00e676', fontSize: 24, fontWeight: 900 }}>{activeOwner.name.charAt(0)}</div>
                    <div>
                       <h2 style={{ fontSize: 20, fontWeight: 900 }}>{activeOwner.name}</h2>
                       <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{activeOwner.plan} Partnership</p>
                    </div>
                 </div>
                 <button className="btn btn-ghost" onClick={() => setActiveOwner(null)}>&times;</button>
              </div>

              {isProcessing ? (
                <div style={{ padding: '40px 0', textAlign: 'center' }}>
                   <div style={{ marginBottom: 16 }} className="animate-spin"><Activity size={32} color="var(--accent-blue)" /></div>
                   <div style={{ fontWeight: 800, fontSize: 18 }}>Syncing with Registry...</div>
                   <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>Updating partner tier and platform visibility.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                   <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleUpdate('tier', 'premium-elite')}>Upgrade to Premium Elite</button>
                   <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleUpdate('tier', 'star-pro')}>Set as Star Pro Partner</button>
                   <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', color: activeOwner.status === 'Active' || activeOwner.status === 'active' ? '#ef4444' : '#00e676' }} onClick={() => handleUpdate('status', (activeOwner.status === 'Active' || activeOwner.status === 'active') ? 'suspended' : 'Active')}>
                      {(activeOwner.status === 'Active' || activeOwner.status === 'active') ? 'Suspend Partner Access' : 'Restore Partner Access'}
                   </button>
                   <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }} onClick={() => setActiveOwner(null)}>Close Management Tab</button>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}
