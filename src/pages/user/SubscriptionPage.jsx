import React from 'react';
import { useApp } from '../../store/AppContext';
import { subscriptionPlans } from '../../data/mockData';
import { Check, Zap, Star } from 'lucide-react';

export default function SubscriptionPage() {
  const { currentUser, addToast } = useApp();
  const handleUpgrade = (plan) => {
    if (plan.id === 'free') return;
    addToast('success', 'Upgrade Initiated', `Redirecting to payment gateway for ${plan.name} Tier - ₹${plan.price}/month`);
  };
  return (
    <div className="container animate-fade" style={{ paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: window.innerWidth < 768 ? 40 : 64 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--accent-green-glow)', borderRadius: 24, padding: '10px 24px', fontSize: 11, color: 'var(--accent-green)', fontWeight: 900, marginBottom: 24, textTransform: 'uppercase', letterSpacing: 1.5, border: '1px solid rgba(0,230,118,0.2)' }}>
          <Zap size={16} fill="currentColor" /> MEMBERSHIP_TIERS
        </div>
        <h1 style={{ fontSize: window.innerWidth < 768 ? 32 : 48, fontWeight: 900, marginBottom: 16, letterSpacing: -1, lineHeight: 1.1 }}>Elite <span className="gradient-text">Protocol Access</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 640, margin: '0 auto', fontWeight: 500, lineHeight: 1.6 }}>Scale your performance with exclusive platform infrastructure, priority queuing vectors, and elite yield discounts.</p>
      </div>

      {/* Pricing Tiers Grid */}
      <div className="grid grid-mobile-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: window.innerWidth < 768 ? 24 : 32, marginBottom: window.innerWidth < 768 ? 40 : 64 }}>
        {subscriptionPlans.map((plan, idx) => {
          const isCurrentPlan = currentUser?.subscription === plan.id || (plan.id === 'free' && !currentUser?.subscription);
          const isPopular = idx === 1;
          return (
            <div key={plan.id} className="card animate-fade" style={{ 
              padding: window.innerWidth < 768 ? '32px 24px' : '48px 40px', position: 'relative', border: `2px solid ${isPopular ? plan.color : 'var(--border)'}`,
              background: isPopular ? 'linear-gradient(180deg, var(--bg-card), rgba(0,0,0,0.6))' : 'var(--bg-secondary)',
              display: 'flex', flexDirection: 'column'
            }}>
              {isPopular && (
                <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', background: plan.color, color: '#000', fontSize: 11, fontWeight: 900, padding: '8px 24px', borderRadius: 24, boxShadow: '0 8px 16px rgba(0,230,118,0.4)', letterSpacing: 1 }}>RECOMMENDED_TIER</div>
              )}
              
              <div style={{ marginBottom: 40 }}>
                <div style={{ width: 64, height: 64, borderRadius: 20, background: `${plan.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, border: `1px solid ${plan.color}30` }}>
                  <Zap size={32} color={plan.color} strokeWidth={2.5} />
                </div>
                <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12, letterSpacing: -0.5 }}>{plan.name}</h3>
                <div style={{ fontSize: 48, fontWeight: 950, color: plan.color, letterSpacing: -2, display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                  {plan.price === 0 ? 'Base' : `₹${plan.price}`}
                  {plan.price > 0 && <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 8, letterSpacing: 0 }}>/MO</span>}
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 48, flex: 1 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', gap: 16, fontSize: 14, color: 'var(--text-secondary)', alignItems: 'flex-start', fontWeight: 600, lineHeight: 1.5 }}>
                    <div style={{ background: `${plan.color}15`, borderRadius: '50%', padding: 4, marginTop: 2 }}>
                      <Check size={14} color={plan.color} strokeWidth={4} style={{ flexShrink: 0 }} />
                    </div>
                    {f}
                  </div>
                ))}
              </div>
              
              <div style={{ marginTop: 'auto' }}>
                {isCurrentPlan ? (
                  <button disabled style={{ width: '100%', height: 56, borderRadius: 16, border: `2px solid ${plan.color}40`, background: 'rgba(255,255,255,0.02)', color: plan.color, fontWeight: 900, fontSize: 15, letterSpacing: 1, textTransform: 'uppercase' }}>
                    ACTIVE_PROTOCOL
                  </button>
                ) : (
                  <button className="btn btn-primary btn-full animate-glow" onClick={() => handleUpgrade(plan)} style={{ background: plan.color, color: '#000', height: 56, borderRadius: 16, fontSize: 15, fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase' }}>
                    {plan.price === 0 ? 'INITIATE_BASE' : 'ACQUIRE_ELITE'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Global Analytics Ribbon */}
      <div className="card animate-fade" style={{ padding: window.innerWidth < 768 ? '32px 24px' : '48px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: window.innerWidth < 768 ? 32 : 48, textAlign: 'center', background: 'linear-gradient(135deg, rgba(0,230,118,0.05), rgba(91,141,239,0.05))', border: '1px solid var(--border)', borderRadius: 32 }}>
        {[
          { label: 'ACTIVE_ATHLETES', value: '15,000+' },
          { label: 'OPERATIONAL_VENUES', value: '450+' },
          { label: 'EXECUTED_SESSIONS', value: '2.5L+' },
          { label: 'GLOBAL_MERIT', value: '4.9/5' },
        ].map(s => (
          <div key={s.label} style={{ flex: window.innerWidth < 768 ? '1 1 40%' : 'auto' }}>
            <div style={{ fontSize: window.innerWidth < 768 ? 32 : 40, fontWeight: 950, color: 'var(--accent-green)', letterSpacing: -1, marginBottom: 8 }}>{s.value}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
