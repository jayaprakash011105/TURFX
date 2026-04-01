import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Plus, Edit, Trash2, Tag, X, Check, Calendar } from 'lucide-react';

export default function AdminCoupons() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);
  const [form, setForm] = useState({ code: '', discount: '', type: 'percent', maxDiscount: '', usageLimit: '', status: 'active', expiry: '' });

  const openAdd = () => { setForm({ code: '', discount: '', type: 'percent', maxDiscount: '', usageLimit: '', status: 'active', expiry: '' }); setEditCoupon(null); setShowModal(true); };
  const openEdit = (c) => { setForm({ ...c }); setEditCoupon(c); setShowModal(true); };

  const handleSave = () => {
    if (editCoupon) updateCoupon(editCoupon.id, { ...form, discount: Number(form.discount), maxDiscount: Number(form.maxDiscount), usageLimit: Number(form.usageLimit) });
    else addCoupon({ ...form, discount: Number(form.discount), maxDiscount: Number(form.maxDiscount), usageLimit: Number(form.usageLimit) });
    setShowModal(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Coupons & Offers</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{coupons.length} coupon codes managed</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Create Coupon</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {coupons.map(c => (
          <div key={c.id} style={{ background: 'var(--bg-card)', border: `1px solid ${c.status === 'active' ? 'rgba(0,230,118,0.2)' : 'var(--border)'}`, borderRadius: 16, padding: '20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -20, top: -20, width: 80, height: 80, borderRadius: '50%', background: c.status === 'active' ? 'rgba(0,230,118,0.05)' : 'rgba(255,255,255,0.02)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: c.status === 'active' ? 'var(--accent-green-glow)' : 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Tag size={16} color={c.status === 'active' ? 'var(--accent-green)' : 'var(--text-muted)'} />
                </div>
                <div>
                  <div style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 15, letterSpacing: 1 }}>{c.code}</div>
                  <span className={`badge badge-${c.status === 'active' ? 'green' : 'red'}`} style={{ fontSize: 10 }}>{c.status}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--accent-green)' }}>
                  {c.type === 'percent' ? `${c.discount}%` : `₹${c.discount}`}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.type === 'percent' ? 'discount' : 'flat off'}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--text-muted)' }}>Max Discount</span>
                <span>₹{c.maxDiscount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--text-muted)' }}>Usage</span>
                <span>{c.used}/{c.usageLimit}</span>
              </div>
              <div style={{ height: 4, background: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${Math.min((c.used/c.usageLimit)*100, 100)}%`, height: '100%', background: 'var(--accent-green)', borderRadius: 4 }} />
              </div>
              <div style={{ display: 'flex', gap: 4, fontSize: 12, color: 'var(--text-muted)', alignItems: 'center' }}>
                <Calendar size={11} /> Expires: {c.expiry}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => openEdit(c)}><Edit size={13} /> Edit</button>
              <button className="btn btn-danger btn-sm" onClick={() => deleteCoupon(c.id)}><Trash2 size={13} /></button>
              <button className="btn btn-ghost btn-sm" onClick={() => updateCoupon(c.id, { status: c.status === 'active' ? 'inactive' : 'active' })}>
                {c.status === 'active' ? <X size={13} /> : <Check size={13} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal" style={{ maxWidth: 440 }}>
            <div className="modal-header">
              <h2 style={{ fontSize: 17, fontWeight: 700 }}>{editCoupon ? 'Edit Coupon' : 'Create Coupon'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Coupon Code</label>
                <input className="form-input" style={{ fontFamily: 'monospace', textTransform: 'uppercase' }} placeholder="e.g. WELCOME20" value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Discount Type</label>
                  <select className="form-input form-select" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                    <option value="percent">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Discount Value</label>
                  <input className="form-input" type="number" placeholder={form.type === 'percent' ? '20' : '100'} value={form.discount} onChange={e => setForm(p => ({ ...p, discount: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Discount (₹)</label>
                  <input className="form-input" type="number" placeholder="200" value={form.maxDiscount} onChange={e => setForm(p => ({ ...p, maxDiscount: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Usage Limit</label>
                  <input className="form-input" type="number" placeholder="100" value={form.usageLimit} onChange={e => setForm(p => ({ ...p, usageLimit: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Expiry Date</label>
                <input className="form-input" type="date" value={form.expiry} onChange={e => setForm(p => ({ ...p, expiry: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-input form-select" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>{editCoupon ? 'Save Changes' : 'Create Coupon'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
