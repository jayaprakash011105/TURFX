import React from 'react';
import { useApp } from '../../store/AppContext';
import { Search, User, Zap, Calendar, TrendingUp, Clock, Filter, MoreVertical, CreditCard, ShieldCheck, CheckCircle2, Activity, Plus } from 'lucide-react';

export default function SubscriptionsPage() {
  const { ownerBookings, ownerTurfs, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sportFilter, setSportFilter] = React.useState('all');
  const [activeSub, setActiveSub] = React.useState(null);
  const [actionView, setActionView] = React.useState('home'); // home, tier, schedule, terminate, revenue, processing, success
  const [localOverrides, setLocalOverrides] = React.useState({});
  const [manualMembers, setManualMembers] = React.useState([]);
  const [showAddModal, setShowAddModal] = React.useState(false);

  const handleAction = (sub) => {
    setActiveSub(sub);
    setActionView('home');
  };

  const handleConfirmUpdate = (type, value) => {
    setActionView('processing');
    
    // Determine the values to override
    const memberId = activeSub.id;
    let updateData = {};
    if (type === 'tier') updateData = { tier: value };
    if (type === 'schedule') {
        updateData = { 
            schedule: document.getElementById('newSchedule')?.value,
            slotTime: document.getElementById('newTime')?.value
        };
    }
    if (type === 'revenue') {
        updateData = { revenue: parseFloat(document.getElementById('newRevenue')?.value || 0) };
    }
    if (type === 'terminate') updateData = { status: 'terminated' };

    setTimeout(() => {
      setLocalOverrides(prev => ({
        ...prev,
        [memberId]: { ...(prev[memberId] || {}), ...updateData }
      }));
      setActionView('success');
    }, 1200);
  };

  const handleAddNewMember = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newMember = {
        id: `m-${Date.now()}`,
        name: formData.get('name'),
        tier: formData.get('tier'),
        sport: formData.get('sport'),
        turfName: formData.get('turf'),
        schedule: formData.get('schedule'),
        slotTime: formData.get('time'),
        revenue: parseFloat(formData.get('revenue')),
        status: 'Active',
        expiry: '2026-12-31'
    };
    setManualMembers(prev => [...prev, newMember]);
    setShowAddModal(false);
  };

  // Derive subscription data: Optimized for real-time manual & frequency-based members
  const subscriptions = React.useMemo(() => {
    const subMap = {};
    const mockTiers = ['Monthly Pro', 'Weekly Lite', 'Annual Elite'];
    const mockDays = ['Mon, Wed', 'Tue, Thu, Sat', 'Every Sunday', 'Weekdays'];

    // Part 1: Process Existing frequency-based members from bookings
    ownerBookings.forEach((b, index) => {
      const id = b.userId || 'Guest';
      if (!subMap[id]) {
        subMap[id] = {
          id,
          name: id === 'u1' ? 'Arjun Mehta' : (id.startsWith('b') ? 'Guest' : id),
          tier: mockTiers[index % 3],
          sport: b.sport,
          turfName: b.turfName,
          turfId: b.turfId,
          schedule: mockDays[index % 4],
          slotTime: b.startTime,
          expiry: '2026-12-31',
          status: 'Active',
          revenue: 1440,
          totalSlots: 0
        };
      }
      subMap[id].totalSlots += 1;
    });

    // Part 2: Merge & Apply Overrides
    const allMembers = [...Object.values(subMap), ...manualMembers].map(m => {
        const override = localOverrides[m.id] || {};
        return {
            ...m,
            tier: override.tier || m.tier,
            schedule: override.schedule || m.schedule,
            slotTime: override.slotTime || m.slotTime,
            revenue: override.revenue !== undefined ? override.revenue : m.revenue,
            status: override.status || m.status
        };
    });

    return allMembers.filter(s => 
      s.status !== 'terminated' && 
      (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (sportFilter === 'all' || s.sport === sportFilter)
    );
  }, [ownerBookings, searchTerm, sportFilter, localOverrides, manualMembers]);

  const totalMembers = subscriptions.length;
  const monthlyRecurring = Math.round(subscriptions.reduce((s, c) => s + c.revenue, 0) * 0.9);

  return (
    <div className="animate-fade">
      {/* Existing Greeting, Stats, Filters... (implied) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4 }}>Member Subscriptions</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Manage recurring bookings and premium member schedules.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}><Plus size={18} /> New Member</button>
          <button className="btn btn-secondary btn-sm"><TrendingUp size={14} /> View Analytics</button>
        </div>
      </div>

      {/* Subscription Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
         {[
           { label: 'Total Members', value: totalMembers, icon: <User size={20} />, color: '#5b8def', sub: 'Active now' },
           { label: 'Recurring Revenue', value: `₹${monthlyRecurring.toLocaleString()}`, icon: <Zap size={20} />, color: '#00e676', sub: '90% Net Profit' },
           { label: 'Slot Occupancy', value: '62%', icon: <Clock size={20} />, color: '#f97316', sub: 'Reserved for subs' },
           { label: 'Renewal Rate', value: '94%', icon: <ShieldCheck size={20} />, color: '#8b5cf6', sub: 'Monthly retention' }
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

      {/* Filters Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
             <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
             <input type="text" className="form-input" placeholder="Search by member name or ID..." style={{ paddingLeft: 40, width: '100%' }} value={searchTerm} onChange={b => setSearchTerm(b.target.value)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
             <Filter size={16} color="var(--text-muted)" />
             <select className="form-input" style={{ width: 150 }} value={sportFilter} onChange={v => setSportFilter(v.target.value)}>
                <option value="all" style={{ background: '#1a1f26', color: '#fff' }}>All Games</option>
                <option value="Football" style={{ background: '#1a1f26', color: '#fff' }}>Football</option>
                <option value="Cricket" style={{ background: '#1a1f26', color: '#fff' }}>Cricket</option>
                <option value="Badminton" style={{ background: '#1a1f26', color: '#fff' }}>Badminton</option>
             </select>
          </div>
      </div>

      <div className="table-wrapper" style={{ border: 'none' }}>
         <table className="card" style={{ width: '100%', borderCollapse: 'separate', padding: 12 }}>
            <thead>
               <tr>
                  <th>Premium Member</th>
                  <th>Subscription Tier</th>
                  <th>Assigned Venue</th>
                  <th>Reserved Schedule</th>
                  <th>Membership Revenue</th>
                  <th>Status</th>
                  <th>Action</th>
               </tr>
            </thead>
            <tbody>
               {subscriptions.map(s => (
                 <tr key={s.id}>
                    <td>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #00e67615, #00c85325)', border: '1px solid #00e67640', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'var(--accent-green)' }}>{s.name.charAt(0)}</div>
                          <div>
                             <div style={{ fontWeight: 800, fontSize: 15 }}>{s.name}</div>
                             <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>ID: {s.id}</div>
                          </div>
                       </div>
                    </td>
                    <td>
                       <div className="badge badge-blue" style={{ fontSize: 10, padding: '4px 10px', fontWeight: 700 }}><Zap size={10} style={{ marginRight: 6 }} /> {s.tier.toUpperCase()}</div>
                       <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Expires {s.expiry}</div>
                    </td>
                    <td>
                       <div style={{ fontWeight: 700, fontSize: 14 }}>{s.turfName}</div>
                       <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.sport} Category</div>
                    </td>
                    <td>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-yellow)', fontSize: 13, fontWeight: 700 }}>
                          <Calendar size={13} /> {s.schedule}
                       </div>
                       <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Timing: {s.slotTime} Standard</div>
                    </td>
                    <td>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 900, color: 'var(--accent-green)', fontSize: 16 }}>
                          <CreditCard size={14} /> ₹{Math.round(s.revenue * 0.9).toLocaleString()}
                       </div>
                       <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Net Cleared Value</div>
                    </td>
                    <td>
                       <span style={{ padding: '6px 12px', background: 'rgba(0,230,118,0.1)', color: 'var(--accent-green)', borderRadius: 20, fontSize: 11, fontWeight: 800 }}>ACTIVE</span>
                    </td>
                    <td><button className="btn btn-ghost btn-icon" onClick={() => handleAction(s)}><MoreVertical size={16} /></button></td>
                 </tr>
               ))}
               {subscriptions.length === 0 && (
                 <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>No subscribed members found in this category.</td>
                 </tr>
               )}
            </tbody>
         </table>
      </div>

      {/* Action Modal */}
      {activeSub && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
           <div className="card animate-fade" style={{ width: 450, padding: 32, borderRadius: 24, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                 <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 16, background: 'linear-gradient(135deg, #00e67615, #00c85325)', border: '1px solid #00e67630', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-green)', fontSize: 20, fontWeight: 900 }}>{activeSub.name.charAt(0)}</div>
                    <div>
                       <h3 style={{ fontSize: 18, fontWeight: 800 }}>{activeSub.name}</h3>
                       <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>ID: {activeSub.id} · {activeSub.sport} Member</div>
                    </div>
                 </div>
                 <button className="btn btn-ghost" onClick={() => { setActiveSub(null); setActionView('home'); }}>&times;</button>
              </div>

              {actionView === 'home' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                     {[
                       { label: 'Tier', val: activeSub.tier, icon: <Zap size={14} /> },
                       { label: 'Schedule', val: activeSub.schedule, icon: <Calendar size={14} /> },
                       { label: 'Next Slot', val: activeSub.slotTime, icon: <Clock size={14} /> },
                       { label: 'Revenue', val: `₹${Math.round(activeSub.revenue * 0.9).toLocaleString()}`, icon: <CreditCard size={14} /> }
                     ].map(item => (
                        <div key={item.label} style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid var(--border)' }}>
                           <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>{item.icon} {item.label.toUpperCase()}</div>
                           <div style={{ fontSize: 13, fontWeight: 700 }}>{item.val}</div>
                        </div>
                     ))}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                     <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setActionView('tier')}>Modify Membership Tier</button>
                     <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setActionView('schedule')}>Change Scheduled Time</button>
                     <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setActionView('revenue')}>Edit Membership Revenue</button>
                     <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', color: '#ef4444' }} onClick={() => setActionView('terminate')}>Terminate Subscription</button>
                  </div>
                </>
              )}

              {actionView === 'tier' && (
                <div className="animate-fade">
                   <h4 style={{ fontSize: 15, fontWeight: 800, marginBottom: 12 }}>Select New Membership Tier</h4>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                      {['Monthly Pro', 'Weekly Lite', 'Annual Elite'].map(t => (
                        <button key={t} className={`btn ${activeSub.tier === t ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%', justifyContent: 'flex-start' }} onClick={() => handleConfirmUpdate('tier', t)}>
                           {activeSub.tier === t && <CheckCircle2 size={14} style={{ marginRight: 10 }} />}
                           {t} Pricing Plan
                        </button>
                      ))}
                   </div>
                   <button className="btn btn-ghost" style={{ width: '100%' }} onClick={() => setActionView('home')}>Back to Details</button>
                </div>
              )}

              {actionView === 'schedule' && (
                <div className="animate-fade">
                   <h4 style={{ fontSize: 15, fontWeight: 800, marginBottom: 12 }}>Re-schedule Regular Slots</h4>
                   <div style={{ marginBottom: 20 }}>
                      <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Preferred Days</label>
                      <input type="text" className="form-input" style={{ width: '100%' }} defaultValue={activeSub.schedule} id="newSchedule" />
                   </div>
                   <div style={{ marginBottom: 24 }}>
                      <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Regular Time Slot</label>
                      <input type="time" className="form-input" style={{ width: '100%' }} defaultValue={activeSub.slotTime} id="newTime" />
                   </div>
                   <button className="btn btn-primary" style={{ width: '100%', marginBottom: 12 }} onClick={() => handleConfirmUpdate('schedule')}>Update Reserve Schedule</button>
                   <button className="btn btn-ghost" style={{ width: '100%' }} onClick={() => setActionView('home')}>Cancel Changes</button>
                </div>
              )}

              {actionView === 'revenue' && (
                <div className="animate-fade">
                   <h4 style={{ fontSize: 15, fontWeight: 800, marginBottom: 12 }}>Modify Subscription Revenue</h4>
                   <div style={{ marginBottom: 24 }}>
                      <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Monthly Revenue Value (₹)</label>
                      <input type="number" className="form-input" style={{ width: '100%' }} defaultValue={activeSub.revenue} id="newRevenue" />
                      <div style={{ fontSize: 11, color: 'var(--accent-green)', marginTop: 8 }}>Owner Net (90%): ₹{Math.round((activeSub.revenue || 0) * 0.9)}</div>
                   </div>
                   <button className="btn btn-primary" style={{ width: '100%', marginBottom: 12 }} onClick={() => handleConfirmUpdate('revenue')}>Commit Financial Changes</button>
                   <button className="btn btn-ghost" style={{ width: '100%' }} onClick={() => setActionView('home')}>Cancel Changes</button>
                </div>
              )}

              {actionView === 'terminate' && (
                <div className="animate-fade" style={{ textAlign: 'center' }}>
                   <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}><ShieldCheck size={32} /></div>
                   <h4 style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>End Premium Membership?</h4>
                   <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>This will immediately release all reserved slots for {activeSub.name} across your venues. This action cannot be undone.</p>
                   <div style={{ display: 'flex', gap: 12 }}>
                      <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setActionView('home')}>Keep Membership</button>
                      <button className="btn btn-primary" style={{ flex: 1, background: '#ef4444', border: 'none' }} onClick={() => handleConfirmUpdate('terminate')}>Yes, Terminate</button>
                   </div>
                </div>
              )}

              {actionView === 'processing' && (
                <div style={{ padding: '40px 0', textAlign: 'center' }}>
                   <div style={{ marginBottom: 16 }} className="animate-spin"><Activity size={32} color="var(--accent-blue)" /></div>
                   <div style={{ fontWeight: 800, fontSize: 18 }}>Syncing with Backend...</div>
                   <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>Updating member portfolio & venue schedules</div>
                </div>
              )}

              {actionView === 'success' && (
                <div style={{ padding: '20px 0', textAlign: 'center' }}>
                   <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(0, 230, 118, 0.1)', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}><CheckCircle2 size={32} /></div>
                   <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 8 }}>Update Successful!</div>
                   <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>The member profiles have been updated on all devices.</div>
                   <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => { setActiveSub(null); setActionView('home'); }}>Return to CRM</button>
                </div>
              )}
           </div>
        </div>
      )}

      {/* Global Add Member Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
           <form onSubmit={handleAddNewMember} className="card animate-fade" style={{ width: 480, padding: 32, borderRadius: 24, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                 <h2 style={{ fontSize: 22, fontWeight: 900 }}>Enroll New Member</h2>
                 <button type="button" className="btn btn-ghost" onClick={() => setShowAddModal(false)}>&times;</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                 <div>
                    <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Full Name</label>
                    <input name="name" type="text" className="form-input" placeholder="Rahul Raj" required style={{ width: '100%' }} />
                 </div>
                 <div>
                    <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Sport Type</label>
                    <select name="sport" className="form-input" style={{ width: '100%' }}>
                       <option>Football</option>
                       <option>Cricket</option>
                       <option>Badminton</option>
                    </select>
                 </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                 <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Assign Venue</label>
                 <select name="turf" className="form-input" style={{ width: '100%' }}>
                    {ownerTurfs.map(t => <option key={t.id}>{t.name}</option>)}
                 </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                 <div>
                    <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Membership Tier</label>
                    <select name="tier" className="form-input" style={{ width: '100%' }}>
                       <option>Monthly Pro</option>
                       <option>Weekly Lite</option>
                       <option>Annual Elite</option>
                    </select>
                 </div>
                 <div>
                    <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Subscription Revenue (₹)</label>
                    <input name="revenue" type="number" className="form-input" defaultValue="1500" required style={{ width: '100%' }} />
                 </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
                 <div>
                    <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Reserved Days</label>
                    <input name="schedule" type="text" className="form-input" placeholder="Mon, Wed, Fri" required style={{ width: '100%' }} />
                 </div>
                 <div>
                    <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Preferred Time</label>
                    <input name="time" type="time" className="form-input" defaultValue="18:00" required style={{ width: '100%' }} />
                 </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                 <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>Cancel</button>
                 <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Complete Enrollment</button>
              </div>
           </form>
        </div>
      )}
    </div>
  );
}
