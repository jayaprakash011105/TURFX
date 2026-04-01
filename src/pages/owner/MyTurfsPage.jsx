import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { SPORTS, AMENITIES_LIST, VENUE_RULES_LIST } from '../../data/mockData';
import { Plus, Edit, Trash2, Eye, MapPin, Star, Clock, Building2, X, Check, Image, Phone, Mail, DollarSign, AlignLeft, Shield, Zap } from 'lucide-react';
import Modal from '../../components/Modal';

function TurfFormModal({ turf, onSave, onClose, currentUser, isOpen }) {
  const [form, setForm] = useState(turf ? {
    ...turf,
    sportTypes: turf.sportTypes || [],
    amenities: turf.amenities || [],
    venueRules: turf.venueRules || [],
    images: turf.images || [],
  } : {
    name: '', tagline: '', location: '', address: '', phone: '', email: '',
    description: '', sportTypes: [], amenities: [], venueRules: [],
    pricePerHour: '', weekendPrice: '', courts: 1, openTime: '06:00', closeTime: '22:00',
    ownerId: currentUser?.id, ownerName: currentUser?.name,
    images: [],
  });

  const [activeTab, setActiveTab] = useState('basic'); // basic | sports | location | gallery

  const toggleArr = (key, val) => setForm(p => ({
    ...p, [key]: p[key].includes(val) ? p[key].filter(v => v !== val) : [...p[key], val]
  }));

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (form.images.length + files.length > 5) {
      alert("You can only upload a maximum of 5 images.");
      return;
    }
    const newImages = files.map(file => URL.createObjectURL(file));
    setForm(p => ({ ...p, images: [...p.images, ...newImages] }));
  };

  const removeImage = (idx) => setForm(p => ({
    ...p, images: p.images.filter((_, i) => i !== idx)
  }));

  const tabs = [
    { id: 'basic', label: 'Basic', icon: <AlignLeft size={16} /> },
    { id: 'sports', label: 'Sports', icon: <Zap size={16} /> },
    { id: 'location', label: 'Asset Info', icon: <MapPin size={16} /> },
    { id: 'gallery', label: 'Media', icon: <Image size={16} /> },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="animate-fade" style={{ width: '95%', maxWidth: 800, background: 'var(--bg-card)', borderRadius: 28, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        
        {/* Modal Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)' }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 2 }}>{turf ? 'Update Asset' : 'Register Asset'}</h2>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>ASSET_REG_VAL_001</div>
          </div>
          <button onClick={onClose} style={{ width: 40, height: 40, borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        {/* Tab Navigation - Scrollable on mobile */}
        <div style={{ padding: '0 24px', display: 'flex', gap: 20, borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', overflowX: 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{
                padding: '16px 4px', border: 'none', background: 'none', cursor: 'pointer',
                color: activeTab === t.id ? 'var(--accent-green)' : 'var(--text-muted)',
                fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap',
                borderBottom: `3px solid ${activeTab === t.id ? 'var(--accent-green)' : 'transparent'}`,
                transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: 1
              }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '24px', overflowY: 'auto' }}>
          {activeTab === 'basic' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>Legal Asset Name *</label>
                <input className="form-input" style={{ height: 48, borderRadius: 12 }} placeholder="e.g. Champions Sports Hub" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>Marketing Tagline</label>
                <input className="form-input" style={{ height: 48, borderRadius: 12 }} placeholder="e.g. Your premium sports destination" value={form.tagline} onChange={e => setForm(p => ({ ...p, tagline: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>Detailed Intel</label>
                <textarea className="form-input" style={{ borderRadius: 12, padding: 16 }} rows={4} placeholder="Describe types of turfs, lighting conditions, parking facilities, etc." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="grid grid-mobile-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>Business Comm [VOICE]</label>
                  <input className="form-input" style={{ height: 48, borderRadius: 12 }} placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>Business Comm [DIGITAL]</label>
                  <input className="form-input" style={{ height: 48, borderRadius: 12 }} value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sports' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Authorized Disciplines</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {SPORTS.map(s => {
                    const selected = form.sportTypes.includes(s.id);
                    return (
                      <button key={s.id} onClick={() => toggleArr('sportTypes', s.id)}
                        style={{ padding: '12px 20px', borderRadius: 14, border: `2px solid ${selected ? s.color : 'var(--border)'}`, background: selected ? `${s.color}15` : 'var(--bg-secondary)', color: selected ? s.color : 'var(--text-secondary)', cursor: 'pointer', fontSize: 12, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s', textTransform: 'uppercase' }}>
                        {s.icon} {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Operational Amenities</div>
                <div className="grid grid-mobile-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {AMENITIES_LIST.map(a => {
                    const selected = form.amenities.includes(a);
                    return (
                      <button key={a} onClick={() => toggleArr('amenities', a)}
                        style={{ padding: '12px', textAlign: 'left', borderRadius: 12, border: `1px solid ${selected ? 'var(--accent-green)' : 'var(--border)'}`, background: selected ? 'var(--accent-green-glow)' : 'var(--bg-secondary)', color: selected ? 'var(--accent-green)' : 'var(--text-muted)', cursor: 'pointer', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10, textTransform: 'uppercase' }}>
                        {selected ? <Check size={14} strokeWidth={3} /> : <Plus size={14} strokeWidth={3} />} {a}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Venue Protocols</div>
                <div className="grid grid-mobile-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {VENUE_RULES_LIST.map(r => {
                    const selected = form.venueRules.includes(r);
                    return (
                      <button key={r} onClick={() => toggleArr('venueRules', r)}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 14, border: `1px solid ${selected ? 'var(--accent-orange)' : 'var(--border)'}`, background: selected ? 'rgba(249,115,22,0.1)' : 'var(--bg-secondary)', color: selected ? 'var(--accent-orange)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: 11, fontWeight: 800, textAlign: 'left', textTransform: 'uppercase' }}>
                        <Shield size={14} strokeWidth={2.5}/> {r}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'location' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="grid grid-mobile-1" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>Geographic Locality</label>
                  <input className="form-input" style={{ height: 48, borderRadius: 12 }} placeholder="e.g. HSR Layout, Sector 7" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>Asset Units</label>
                  <input className="form-input" style={{ height: 48, borderRadius: 12 }} type="number" min={1} value={form.courts} onChange={e => setForm(p => ({ ...p, courts: Number(e.target.value) }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>Asset Address [GEO_HASH]</label>
                <textarea className="form-input" style={{ borderRadius: 12, padding: 16 }} rows={2} value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
              </div>

              <div style={{ background: 'var(--bg-secondary)', borderRadius: 24, padding: '24px', border: '1px solid var(--border)' }}>
                 <div style={{ fontSize: 12, fontWeight: 900, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
                    <DollarSign size={16} strokeWidth={3} /> Yield Engine Parameters
                 </div>
                 <div className="grid grid-mobile-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>Weekday Delta [₹/hr]</label>
                      <input className="form-input" style={{ height: 44, borderRadius: 10, fontWeight: 900 }} type="number" value={form.pricePerHour} onChange={e => setForm(p => ({ ...p, pricePerHour: Number(e.target.value) }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>Weekend Delta [₹/hr]</label>
                      <input className="form-input" style={{ height: 44, borderRadius: 10, fontWeight: 900 }} type="number" value={form.weekendPrice} onChange={e => setForm(p => ({ ...p, weekendPrice: Number(e.target.value) }))} />
                    </div>
                 </div>
                 <div className="grid grid-mobile-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>Operational Start</label>
                      <input className="form-input" style={{ height: 44, borderRadius: 10, fontWeight: 900 }} type="time" value={form.openTime} onChange={e => setForm(p => ({ ...p, openTime: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>Operational End</label>
                      <input className="form-input" style={{ height: 44, borderRadius: 10, fontWeight: 900 }} type="time" value={form.closeTime} onChange={e => setForm(p => ({ ...p, closeTime: e.target.value }))} />
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div>
              <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 900 }}>Visual Intel</div>
                  <p style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}>Upload multispectral assets for validation (MAX: 5)</p>
                </div>
                <div style={{ fontSize: 12, fontWeight: 900, color: form.images.length >= 5 ? 'var(--accent-red)' : 'var(--text-muted)', textTransform: 'uppercase' }}>{form.images.length}/5 ASSETS</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
                {form.images.map((img, i) => (
                  <div key={i} style={{ position: 'relative', height: 140, borderRadius: 18, overflow: 'hidden', border: '2px solid var(--border)' }}>
                    <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Venue Preview" />
                    <button onClick={() => removeImage(i)}
                      style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(239,68,68,0.95)', border: 'none', color: '#fff', width: 28, height: 28, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
                      <X size={16} strokeWidth={3} />
                    </button>
                  </div>
                ))}

                {form.images.length < 5 && (
                  <label style={{ height: 140, borderRadius: 18, border: '2px dashed var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', background: 'var(--bg-secondary)', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--accent-green)'} onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                    <input type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(0,230,118,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-green)' }}>
                      <Plus size={22} strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>ADD_MEDIA</span>
                  </label>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{ padding: '24px', borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button className="btn btn-ghost" style={{ fontWeight: 800 }} onClick={onClose}>DISCARD</button>
          <button className="btn btn-primary" style={{ height: 48, padding: '0 32px', borderRadius: 14, fontWeight: 900, letterSpacing: 0.5 }} onClick={() => { onSave(form); onClose(); }}>
            {turf ? 'UPDATE_DATABASE' : 'COMMENCE_APPROVAL'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default function MyTurfsPage({ setActivePage }) {
  const { ownerTurfs, addTurf, updateTurf, deleteTurf, currentUser, addToast } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editTurf, setEditTurf] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleSave = (form) => {
    if (editTurf) updateTurf(editTurf.id, form);
    else addTurf(form);
  };

  const handleDelete = (id) => {
    deleteTurf(id);
    setConfirmDelete(null);
  };

  return (
    <div className="container animate-fade" style={{ paddingBottom: 80 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontWeight: 900, marginBottom: 4 }}>Asset Registry</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 500 }}>{ownerTurfs.length} operational units connected</p>
        </div>
        <button className="btn btn-primary" style={{ height: 48, padding: '0 24px', borderRadius: 14, fontWeight: 800 }} onClick={() => { setEditTurf(null); setShowModal(true); }}>
          <Plus size={18} strokeWidth={2.5} /> NEW_ASSET
        </button>
      </div>

      {ownerTurfs.length === 0 ? (
        <div className="card animate-fade" style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🏟️</div>
          <h3 style={{ fontWeight: 900, color: 'var(--text-primary)' }}>No Registrations Found</h3>
          <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 24 }}>Initiate asset registration to commence operational scaling.</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={18} strokeWidth={3} /> START_REGISTRATION</button>
        </div>
      ) : (
        <div className="grid grid-mobile-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {ownerTurfs.map(t => (
            <div key={t.id} className="card" style={{ padding: 0, overflow: 'hidden', transition: 'all 0.3s' }}>
              <div style={{ height: 200, background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {t.images && t.images.length > 0 ? (
                  <img src={t.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={t.name} />
                ) : (
                  <div style={{ fontSize: 60 }}>🏟️</div>
                )}
                <div style={{ position: 'absolute', top: 14, right: 14 }}>
                  <span className={`badge badge-${t.status === 'approved' ? 'green' : t.status === 'pending' ? 'yellow' : 'red'}`} style={{ boxShadow: '0 8px 20px rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)', fontSize: 10, fontWeight: 900 }}>{t.status.toUpperCase()}</span>
                </div>
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: 16 }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 900 }}>{t.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--bg-secondary)', padding: '4px 8px', borderRadius: 8 }}>
                        <Star size={12} fill="var(--accent-yellow)" color="var(--accent-yellow)" />
                        <span style={{ fontWeight: 900, fontSize: 12 }}>{t.rating || 'N/A'}</span>
                      </div>
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                     <MapPin size={14} color="var(--accent-blue)" /> {t.location}
                   </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, background: 'var(--bg-secondary)', padding: 14, borderRadius: 16, marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--accent-green)' }}>₹{t.pricePerHour}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800 }}>RATE / HR</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)' }}>{t.courts}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800 }}>UNITS</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                  {t.sportTypes?.slice(0,3).map(s => (
                    <span key={s} className="badge" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: 9, fontWeight: 800, color: 'var(--text-muted)' }}>
                      {SPORTS.find(sp=>sp.id===s)?.label.toUpperCase()}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-secondary" style={{ flex: 1, height: 42, fontSize: 12, fontWeight: 800, borderRadius: 12 }} onClick={() => setActivePage('slots')}>
                    <Clock size={14} strokeWidth={2.5} /> MANAGE SLOTS
                  </button>
                  <button className="btn btn-ghost" style={{ width: 42, height: 42, padding: 0, borderRadius: 12, border: '1px solid var(--border)' }} onClick={() => { setEditTurf(t); setShowModal(true); }}>
                    <Edit size={16} strokeWidth={2.5} />
                  </button>
                  <button className="btn btn-danger" style={{ width: 42, height: 42, padding: 0, borderRadius: 12 }} onClick={() => setConfirmDelete(t.id)}>
                    <Trash2 size={16} strokeWidth={2.5} />
                  </button>
                </div>

                {t.status === 'pending' && (
                  <div style={{ marginTop: 14, background: 'rgba(234,179,8,0.06)', border: '1px dashed var(--accent-yellow)', borderRadius: 12, padding: '10px', fontSize: 11, color: 'var(--accent-yellow)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Clock size={14} /> VAL_STATUS: PENDING_APPROVAL
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <TurfFormModal isOpen={showModal} turf={editTurf} currentUser={currentUser} onSave={handleSave} onClose={() => { setShowModal(false); setEditTurf(null); }} />
      )}

      {confirmDelete && (
        <Modal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
          <div className="animate-fade" style={{ maxWidth: 400, background: 'var(--bg-card)', borderRadius: 28, overflow: 'hidden', textAlign: 'center' }}>
            <div style={{ padding: '40px 32px' }}>
              <div style={{ width: 80, height: 80, borderRadius: 28, background: 'rgba(239,68,68,0.1)', color: 'var(--accent-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Trash2 size={40} strokeWidth={2.5} />
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 12 }}>Decommission Asset?</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6, fontWeight: 500 }}>Critical Action: Decommissioning this asset will terminate all operational data, slot histories, and active listings.</p>
            </div>
            <div style={{ padding: '24px', background: 'var(--bg-secondary)', display: 'flex', gap: 12 }}>
              <button className="btn btn-ghost" style={{ flex: 1, height: 50, fontWeight: 800 }} onClick={() => setConfirmDelete(null)}>ABORT</button>
              <button className="btn btn-danger" style={{ flex: 1, height: 50, fontWeight: 900 }} onClick={() => handleDelete(confirmDelete)}>CONFIRM</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
