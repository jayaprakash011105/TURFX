import React from 'react';
import { useApp } from '../../store/AppContext';
import { Tag, Plus, Trash2, Edit, Calendar, Info, Clock, CheckCircle2, MoreVertical, Search, Filter, Activity } from 'lucide-react';
import Modal from '../../components/Modal';

export default function PromotionsPage() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, ownerTurfs, addToast } = useApp();
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [editingPromo, setEditingPromo] = React.useState(null);
  
  // Promotion Form State
  const [form, setForm] = React.useState({
    code: '',
    discount: '',
    type: 'percent',
    status: 'active',
    expiry: '2026-12-31',
    usageLimit: 500
  });

  const handleOpenModal = (promo = null) => {
    if (promo) {
      setEditingPromo(promo);
      setForm({
        code: promo.code,
        discount: promo.discount,
        type: promo.type,
        status: promo.status,
        expiry: promo.expiry,
        usageLimit: promo.usageLimit
      });
    } else {
      setEditingPromo(null);
      setForm({ code: '', discount: '', type: 'percent', status: 'active', expiry: '2026-12-31', usageLimit: 500 });
    }
    setShowAddModal(true);
  };

  const handleSubmit = () => {
    if (!form.code || !form.discount) return addToast('error', 'Fields Missing', 'Please fill all required campaign details.');
    
    const payload = { ...form, discount: Number(form.discount) };
    
    if (editingPromo) {
      updateCoupon(editingPromo.id, payload);
    } else {
      addCoupon(payload);
    }
    
    setShowAddModal(false);
  };

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activePromoCount = coupons.filter(c => c.status === 'active').length;

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4 }}>Dynamic Promotions</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Create and manage discount coupons for all your venues.</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}><Plus size={18} /> New Promotion</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
         {[
           { label: 'Active Codes', value: activePromoCount, icon: <Tag size={20} />, color: '#00e676', desc: 'Currently running' },
           { label: 'Total Claims', value: '184', icon: <CheckCircle2 size={20} />, color: '#5b8def', desc: 'All time redeems' },
           { label: 'Revenue Saved', value: '₹12,450', icon: <Plus size={20} />, color: '#f97316', desc: 'Customer savings' }
         ].map(stat => (
           <div key={stat.label} className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>{stat.icon}</div>
                <div>
                   <div style={{ fontSize: 13, fontWeight: 800 }}>{stat.label}</div>
                   <div style={{ fontSize: 11, color: stat.color, fontWeight: 700 }}>{stat.desc}</div>
                </div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 900 }}>{stat.value}</div>
           </div>
         ))}
      </div>

      <div className="card" style={{ padding: '20px', marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
             <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
             <input type="text" className="form-input" placeholder="Search by promo code or venue..." style={{ paddingLeft: 40, width: '100%' }} value={searchTerm} onChange={r => setSearchTerm(r.target.value)} />
          </div>
          <button className="btn btn-secondary btn-icon"><Filter size={16} /></button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
         {filteredCoupons.map(p => (
           <div key={p.id} className="card" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
              <div style={{ height: 4, background: p.status === 'active' ? 'var(--accent-green)' : 'var(--text-muted)' }}></div>
              <div style={{ padding: '24px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                       <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>CAMPAIGN CODE</div>
                       <div style={{ fontSize: 22, fontWeight: 900, fontFamily: 'Space Grotesk', letterSpacing: 1 }}>{p.code}</div>
                    </div>
                    <div className={`badge badge-${p.status === 'active' ? 'green' : 'red'}`}>{p.status?.toUpperCase()}</div>
                 </div>
                 
                 <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px dashed var(--border)', marginBottom: 20, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Discount Value</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--accent-green)' }}>{p.type === 'percent' ? `${p.discount}% OFF` : `₹${p.discount} FLAT`}</div>
                 </div>

                 <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Activity size={12} /> Redeemed <strong>{p.used || 0} times</strong></div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Plus size={12} /> Limit <strong>{p.usageLimit || 500}</strong></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={12} /> Start <strong>2026-03-01</strong></div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={12} /> End <strong>{p.expiry || '2026-04-01'}</strong></div>
                    </div>
                 </div>

                 <div style={{ height: 1, background: 'var(--border)', marginBottom: 16 }}></div>

                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}>
                       <Info size={12} /> Campaign Live
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                       <button className="btn btn-ghost btn-icon" style={{ padding: 8 }} onClick={() => handleOpenModal(p)}><Edit size={14} /></button>
                       <button className="btn btn-ghost btn-icon" style={{ padding: 8, color: '#ef4444' }} onClick={() => deleteCoupon(p.id)}><Trash2 size={14} /></button>
                    </div>
                 </div>
              </div>
           </div>
         ))}
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
         <div style={{ width: 450, padding: 32, background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>{editingPromo ? 'Modify Campaign' : 'Launch Campaign'}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>Set up a new discount code for your customers.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
               <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Promo Code (e.g. SUMMERFLAT50)</label>
                  <input type="text" className="form-input" placeholder="WINTER2026" style={{ width: '100%' }} value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} />
               </div>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Discount Value</label>
                    <input type="number" className="form-input" placeholder="20" style={{ width: '100%' }} value={form.discount} onChange={e => setForm({...form, discount: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Value Type</label>
                    <select className="form-input" style={{ width: '100%' }} value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                       <option value="percent">Percentage (%)</option>
                       <option value="flat">Flat Discount (₹)</option>
                    </select>
                  </div>
               </div>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Usage Limit</label>
                    <input type="number" className="form-input" style={{ width: '100%' }} value={form.usageLimit} onChange={e => setForm({...form, usageLimit: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Status</label>
                    <select className="form-input" style={{ width: '100%' }} value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                       <option value="active">Active</option>
                       <option value="expired">Expired</option>
                    </select>
                  </div>
               </div>
               <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Campaign Expiry</label>
                  <input type="date" className="form-input" style={{ width: '100%' }} value={form.expiry} onChange={e => setForm({...form, expiry: e.target.value})} />
               </div>
            </div>

            <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
               <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>Cancel</button>
               <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSubmit}>{editingPromo ? 'Update Campaign' : 'Activate Coupon'}</button>
            </div>
         </div>
      </Modal>
    </div>
  );
}
