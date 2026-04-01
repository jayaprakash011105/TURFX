import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../store/AppContext';
import { SPORTS } from '../../data/mockData';
import { MapPin, Star, Clock, Phone, Mail, ChevronLeft, ChevronRight, Lock, CheckCircle, AlertCircle, Shield } from 'lucide-react';

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const fmt = (d) => d.toISOString().split('T')[0];

function SlotGrid({ slots, selectedSlot, onSelect, court }) {
  const courtSlots = slots.filter(s => s.court === court);
  return (
    <div className="grid grid-mobile-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 14 }}>
      {courtSlots.map(slot => {
        const isSelected = selectedSlot?.id === slot.id;
        const isPast = slot.status === 'past';
        const isBooked = slot.status === 'booked';
        const isBlocked = slot.status === 'blocked' || slot.status === 'locked';
        const isAvailable = slot.status === 'available';
        return (
          <button key={slot.id} onClick={() => isAvailable && onSelect(slot)}
            disabled={!isAvailable}
            style={{
              padding: '12px 10px', borderRadius: 14, border: `1px solid ${isSelected ? 'var(--accent-green)' : isBooked ? 'rgba(255,255,255,0.05)' : 'var(--border)'}`,
              background: isSelected ? 'var(--accent-green-glow)' : isBooked ? 'rgba(0,0,0,0.3)' : isBlocked ? 'rgba(239,68,68,0.04)' : 'var(--bg-secondary)',
              color: isSelected ? 'var(--accent-green)' : isBooked || isBlocked || isPast ? 'var(--text-muted)' : 'var(--text-primary)',
              cursor: isAvailable ? 'pointer' : 'not-allowed', fontSize: 13, fontWeight: isSelected ? 800 : 700,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: isPast ? 0.3 : 1, width: '100%', position: 'relative', overflow: 'hidden',
              boxShadow: isSelected ? '0 0 20px rgba(0, 230, 118, 0.15)' : 'none',
              transform: isSelected ? 'scale(1.02)' : 'scale(1)'
            }}>
            {isSelected && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--accent-green)' }} />}
            <span style={{ fontSize: 13, fontWeight: 900, letterSpacing: -0.5 }}>{slot.startTime}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
               <div style={{ width: 5, height: 5, borderRadius: '50%', background: isSelected ? 'var(--accent-green)' : isBooked ? '#444' : isBlocked ? 'var(--accent-red)' : 'var(--accent-green)', opacity: isBooked || isPast ? 0.5 : 1 }} />
               <span style={{ fontSize: 8, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 900, opacity: 0.8 }}>
                 {isSelected ? 'SELECTED' : isBooked ? 'BOOKED' : isBlocked ? 'BLOCKED' : isPast ? 'EXPIRED' : 'AVAILABLE'}
               </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function TurfDetailPage({ turf, setActivePage }) {
  const { slots, createBooking, currentUser, addToast, reviews: allReviews, addReview, calculateEffectivePrice } = useApp();
  const [selectedDate, setSelectedDate] = useState(fmt(new Date()));
  const [selectedCourt, setSelectedCourt] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('GPay');
  const [showBooking, setShowBooking] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Review Form State
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  if (!turf) return null;
  const turfSlots = slots[turf.id] || [];
  const dateSlots = turfSlots.filter(s => s.date === selectedDate);
  const turfReviews = allReviews.filter(r => r.turfId === turf.id);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i); return d;
  });

  const availableCount = dateSlots.filter(s => s.status === 'available' && s.court === selectedCourt).length;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'WELCOME20') { setDiscount(0.2); addToast('success', 'Coupon Applied!', '20% discount applied'); }
    else if (couponCode.toUpperCase() === 'FLAT100') { setDiscount(100); addToast('success', 'Coupon Applied!', '₹100 flat discount'); }
    else addToast('error', 'Invalid Coupon', 'Coupon code not found or expired');
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return addToast('error', 'Incomplete Review', 'Please add a comment');
    setIsSubmittingReview(true);
    addReview({
      turfId: turf.id,
      userId: currentUser?.id,
      userName: currentUser?.name || 'Anonymous',
      rating: newRating,
      comment: newComment
    });
    setNewComment('');
    setNewRating(5);
    setIsSubmittingReview(false);
  };

  const effectiveBasePrice = useMemo(() => calculateEffectivePrice(turf.pricePerHour), [turf.pricePerHour, calculateEffectivePrice]);
  const baseAmount = selectedSlot ? effectiveBasePrice : 0;
  const discountAmount = typeof discount === 'number' && discount < 1 ? Math.round(baseAmount * discount) : Math.min(discount, baseAmount);
  const finalAmount = baseAmount - discountAmount;

  const handleBook = () => {
    if (!selectedSlot) { addToast('error', 'No Slot Selected', 'Please select a time slot'); return; }
    createBooking({
      turfId: turf.id,
      turfName: turf.name,
      slotId: selectedSlot.id,
      court: selectedCourt,
      date: selectedDate,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      sport: turf.sportTypes?.[0],
      amount: finalAmount,
      paymentMethod,
    });
    setShowBooking(false);
    setSelectedSlot(null);
    setActivePage('bookings');
  };

  const sport = SPORTS.find(s => turf.sportTypes?.includes(s.id));

  return (
    <div className="container animate-fade" style={{ paddingBottom: 100 }}>
      {/* Back */}
      <button className="btn btn-ghost" onClick={() => setActivePage('turfs')} style={{ marginBottom: 20, padding: 0, height: 'auto', fontWeight: 900 }}>
        <ChevronLeft size={16} strokeWidth={3} /> Back
      </button>

      {/* Hero Banner */}
      <div style={{ 
        minHeight: window.innerWidth < 768 ? 200 : 280, 
        background: `linear-gradient(135deg, #0d1f0d, #0a1520)`, 
        borderRadius: 24, display: 'flex', alignItems: 'flex-end', 
        position: 'relative', marginBottom: 24, overflow: 'hidden', 
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 20px 50px -15px rgba(0,0,0,0.5)'
      }}>
        {turf.images && turf.images.length > 0 && (
          <img src={turf.images[0]} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} alt="Venue" />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.95) 100%)' }} />
        
        <div style={{ position: 'relative', padding: window.innerWidth < 768 ? '16px' : '24px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
              {turf.sportTypes?.map(s => (
                <span key={s} style={{ 
                  fontSize: 8, fontWeight: 900, backdropFilter: 'blur(12px)', 
                  background: 'rgba(0,230,118,0.15)', color: 'var(--accent-green)',
                  padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(0,230,118,0.2)',
                  letterSpacing: 1, textTransform: 'uppercase'
                }}>
                  {SPORTS.find(sp => sp.id === s)?.label}
                </span>
              ))}
            </div>
            <h1 style={{ fontSize: window.innerWidth < 768 ? 24 : 36, fontWeight: 900, marginBottom: 8, letterSpacing: -1, lineHeight: 1, color: '#fff' }}>{turf.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                <MapPin size={12} color="var(--accent-blue)" /> {turf.location}
              </span>
              <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', padding: '4px 8px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Star size={12} fill="var(--accent-yellow)" color="var(--accent-yellow)" /> 
                <span style={{ fontWeight: 900, color: '#fff', fontSize: 12 }}>{turf.rating}</span>
              </div>
            </div>
          </div>

          <div style={{ 
            background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', 
            borderRadius: 16, padding: '12px 20px', textAlign: 'right', 
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
            marginLeft: 'auto'
          }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--accent-green)', letterSpacing: -1, lineHeight: 1 }}>₹{effectiveBasePrice}</div>
            <div style={{ fontSize: 8, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 900, marginTop: 4 }}>PER_HR_YIELD</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Info */}
        <div className="card" style={{ padding: window.innerWidth < 768 ? '24px' : '32px', background: 'linear-gradient(145deg, var(--bg-card), rgba(0,0,0,0.4))', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{ width: 4, height: 20, background: 'var(--accent-green)', borderRadius: 2 }} />
            <h3 style={{ fontSize: 18, fontWeight: 900, letterSpacing: -0.5, margin: 0 }}>Venue Intel</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, marginBottom: 32, fontWeight: 500, maxWidth: 800 }}>{turf.description}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16 }}>
            {[
              { icon: <Clock size={18} />, label: 'HOURS', value: `${turf.openTime} - ${turf.closeTime}`, color: 'var(--accent-green)' },
              { icon: <MapPin size={18} />, label: 'ASSETS', value: `${turf.courts} Fields`, color: 'var(--accent-blue)' },
              { icon: <Phone size={18} />, label: 'CONTACT', value: turf.phone, color: 'var(--accent-purple)' },
              { icon: <Mail size={18} />, label: 'DIGITAL', value: turf.email, color: 'var(--accent-yellow)' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ color: item.color, background: `${item.color}15`, padding: 8, borderRadius: 10, width: 'fit-content' }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', wordBreak: 'break-all' }}>{item.value || 'N/A'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="card" style={{ padding: window.innerWidth < 768 ? '24px' : '32px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{ width: 4, height: 20, background: 'var(--accent-blue)', borderRadius: 2 }} />
            <h3 style={{ fontSize: 18, fontWeight: 900, letterSpacing: -0.5, margin: 0 }}>Amenities</h3>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {turf.amenities?.map(a => (
              <span key={a} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: '8px 14px', fontSize: 10, color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.05)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                <CheckCircle size={14} color="var(--accent-green)" strokeWidth={3} /> {a}
              </span>
            ))}
          </div>
        </div>

        {/* Slot Booking */}
        <div className="card" id="booking-section" style={{ padding: window.innerWidth < 768 ? '24px' : '32px' }}>
          <h3 style={{ marginBottom: 24, fontSize: 18, fontWeight: 900, letterSpacing: -0.5 }}>Reserve Slot</h3>

          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '8px 4px 20px 4px', marginBottom: 28, msOverflowStyle: 'none', scrollbarWidth: 'none', flexWrap: 'nowrap' }}>
            {dates.map(d => {
              const ds = fmt(d);
              const isSelected = selectedDate === ds;
              return (
                <button key={ds} onClick={() => { setSelectedDate(ds); setSelectedSlot(null); }}
                  style={{ 
                    flexShrink: 0, width: 72, padding: '14px 8px', borderRadius: 20, 
                    border: `1px solid ${isSelected ? 'var(--accent-green)' : 'rgba(255,255,255,0.08)'}`, 
                    background: isSelected ? 'rgba(0,230,118,0.08)' : 'rgba(255,255,255,0.02)', 
                    color: isSelected ? 'var(--accent-green)' : 'var(--text-secondary)', 
                    cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                    textAlign: 'center', position: 'relative', overflow: 'hidden',
                    transform: isSelected ? 'translateY(-6px)' : 'none',
                    boxShadow: isSelected ? '0 8px 20px -5px rgba(0, 230, 118, 0.25)' : 'none'
                  }}>
                  {isSelected && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,230,118,0.1), transparent)', opacity: 0.5 }} />}
                  <div style={{ fontSize: 10, marginBottom: 4, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.2, opacity: isSelected ? 1 : 0.6 }}>{DAYS[d.getDay()]}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: -1.2, lineHeight: 1 }}>{d.getDate()}</div>
                </button>
              );
            })}
          </div>

          <div style={{ 
            display: 'flex', gap: 8, marginBottom: 28, padding: '6px', 
            background: 'rgba(0,0,0,0.2)', borderRadius: 20, 
            width: 'fit-content', maxWidth: '100%', overflowX: 'auto',
            msOverflowStyle: 'none', scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch'
          }}>
            {Array.from({ length: turf.courts }, (_, i) => i + 1).map(c => (
              <button key={c} onClick={() => { setSelectedCourt(c); setSelectedSlot(null); }}
                style={{ 
                  padding: '10px 20px', borderRadius: 14, border: 'none', flexShrink: 0,
                  background: selectedCourt === c ? 'var(--accent-blue)' : 'transparent', 
                  color: selectedCourt === c ? '#fff' : 'var(--text-muted)', 
                  cursor: 'pointer', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.2,
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: selectedCourt === c ? '0 4px 12px rgba(91,141,239,0.25)' : 'none'
                }}>
                TURF-{c}
              </button>
            ))}
          </div>

          <SlotGrid slots={dateSlots} selectedSlot={selectedSlot} onSelect={setSelectedSlot} court={selectedCourt} />
          {dateSlots.filter(s => s.court === selectedCourt).length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <Clock size={32} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <p style={{ fontWeight: 800, textTransform: 'uppercase' }}>NO_SLOTS_INITIALIZED</p>
            </div>
          )}
        </div>

        <div className="card animate-fade" style={{ background: 'linear-gradient(135deg, #0d0d12 0%, #15151e 100%)', border: '1px solid var(--border)', borderRadius: 28, padding: '32px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, background: 'radial-gradient(circle, var(--accent-green-glow) 0%, transparent 70%)', opacity: 0.15, pointerEvents: 'none' }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <div style={{ width: 4, height: 20, background: 'var(--accent-purple)', borderRadius: 2 }} />
            <h3 style={{ fontSize: 18, fontWeight: 900, letterSpacing: -0.5, margin: 0 }}>Bookings</h3>
          </div>

          {selectedSlot ? (
            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 1024 ? '1fr' : '1fr 1fr', gap: 32, alignItems: 'start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 20, padding: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5 }}>TIMINGS</div>
                  <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: -0.5, marginBottom: 4, color: '#fff' }}>{selectedSlot.startTime} – {selectedSlot.endTime}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: 'var(--accent-green)', fontSize: 12, fontWeight: 900, background: 'rgba(0,230,118,0.1)', padding: '3px 10px', borderRadius: 8 }}>TURF-{selectedCourt}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: 11, fontWeight: 700 }}>{new Date(selectedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).toUpperCase()}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800 }}>
                     <span style={{ color: 'var(--text-muted)' }}>SLOT COST</span>
                     <span style={{ color: '#fff' }}>₹{effectiveBasePrice}</span>
                   </div>
                   {discountAmount > 0 && (
                     <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800 }}>
                       <span style={{ color: 'var(--accent-green)' }}>CAMPAIGN DELTA</span>
                       <span style={{ color: 'var(--accent-green)' }}>–₹{discountAmount}</span>
                     </div>
                   )}
                   <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />
                   <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', fontWeight: 900, fontSize: 20, alignItems: 'center', gap: 8 }}>
                     <span style={{ letterSpacing: -0.5, fontSize: 14 }}>TOTAL</span>
                     <span style={{ color: 'var(--accent-green)', letterSpacing: -1, fontSize: 24 }}>₹{finalAmount}</span>
                   </div>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 24, padding: '24px', border: '1px solid rgba(255,255,255,0.03)' }}>
                {/* Payment Method */}
                <div style={{ marginBottom: 28 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 16, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5 }}>PAYMENT METHOD</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {['GPay', 'UPI', 'Card', 'Wallet'].map(m => (
                      <button key={m} onClick={() => setPaymentMethod(m)}
                        style={{ 
                          padding: '12px', borderRadius: 12, border: `1px solid ${paymentMethod === m ? 'var(--accent-green)' : 'rgba(255,255,255,0.05)'}`, 
                          background: paymentMethod === m ? 'rgba(0,230,118,0.06)' : 'rgba(0,0,0,0.2)', 
                          color: paymentMethod === m ? 'var(--accent-green)' : 'var(--text-muted)', 
                          cursor: 'pointer', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5,
                          transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <button className="btn btn-primary btn-full animate-glow" onClick={handleBook} 
                   style={{ height: 56, borderRadius: 16, fontSize: 15, fontWeight: 900, letterSpacing: 0.8, textTransform: 'uppercase' }}>
                  <Lock size={16} strokeWidth={2.5} /> <span style={{ marginLeft: 6 }}>CONFIRM BOOKING</span>
                </button>
                <div style={{ textAlign: 'center', marginTop: 12, fontSize: 9, color: 'var(--text-muted)', fontWeight: 800, letterSpacing: 2 }}>ENCRYPTED TRANSLAYER v2.4</div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 24px', background: 'rgba(0,0,0,0.1)', borderRadius: 20, border: '1px dashed rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: 48, marginBottom: 20, opacity: 0.8 }}>📋</div>
              <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 8, color: '#fff', letterSpacing: -0.5 }}>AWAIT_PARAMS</div>
              <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', maxWidth: 300, margin: '0 auto 24px' }}>Initialize vector by selecting timeframe and field unit above.</p>
              <button onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })} 
                className="btn btn-ghost" style={{ fontWeight: 900, height: 44, borderRadius: 12, padding: '0 24px', fontSize: 13 }}>
                INITIATE_HANDSHAKE
              </button>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="card" style={{ padding: window.innerWidth < 768 ? '24px' : '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{ width: 4, height: 20, background: 'var(--accent-yellow)', borderRadius: 2 }} />
            <h3 style={{ fontSize: 18, fontWeight: 900, letterSpacing: -0.5, margin: 0 }}>Reviews</h3>
          </div>
          
          <form onSubmit={handleReviewSubmit} style={{ marginBottom: 32, background: 'var(--bg-secondary)', padding: 16, borderRadius: 16 }}>
             <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5 }}>Submit Feedback</div>
             <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                {[1,2,3,4,5].map(i => (
                   <button type="button" key={i} onClick={() => setNewRating(i)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                      <Star size={20} fill={i <= newRating ? 'var(--accent-yellow)' : 'transparent'} color="var(--accent-yellow)" strokeWidth={1.5} />
                   </button>
                ))}
             </div>
             <textarea className="form-input" placeholder="Operational details..." 
                style={{ width: '100%', minHeight: 70, marginBottom: 12, padding: 12, fontSize: 13, borderRadius: 10 }}
                value={newComment} onChange={e => setNewComment(e.target.value)} />
             <button className="btn btn-primary" type="submit" disabled={isSubmittingReview} style={{ height: 38, borderRadius: 10, padding: '0 20px', fontWeight: 900, fontSize: 11 }}>SUBMIT</button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
             {turfReviews.map(r => (
               <div key={r.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, alignItems: 'flex-start' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 12, background: 'linear-gradient(135deg, var(--bg-card), #000)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900 }}>{r.userName?.[0]}</div>
                        <div>
                           <div style={{ fontSize: 14, fontWeight: 900 }}>{r.userName}</div>
                           <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800 }}>{r.createdAt}</div>
                        </div>
                     </div>
                     <div style={{ display: 'flex', gap: 2, background: 'var(--bg-secondary)', padding: '4px 8px', borderRadius: 8 }}>
                        {[1,2,3,4,5].map(i => <Star key={i} size={12} fill={i <= r.rating ? 'var(--accent-yellow)' : 'transparent'} color="var(--accent-yellow)" />)}
                     </div>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: 48, fontWeight: 500 }}>"{r.comment}"</p>
               </div>
             ))}
             {turfReviews.length === 0 && (
               <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '32px 0', fontWeight: 800, fontSize: 12 }}>NO_REVIEWS_REGISTRY</div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
