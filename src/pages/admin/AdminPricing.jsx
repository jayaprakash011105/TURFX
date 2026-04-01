import React, { useState, useMemo } from 'react';
import { useApp } from '../../store/AppContext';
import { Zap, TrendingUp, CloudRain, Clock, Save, Building2, Percent, Target } from 'lucide-react';

export default function AdminPricing() {
  const { turfs, pricingRules, setPricingRules, addToast } = useApp();
  const rules = pricingRules;

  const [saving, setSaving] = useState(false);

  const toggleRule = (ruleKey) => {
    setPricingRules(prev => ({
      ...prev,
      [ruleKey]: { ...prev[ruleKey], active: !prev[ruleKey].active }
    }));
  };

  const updateMultiplier = (ruleKey, val) => {
    setPricingRules(prev => ({
      ...prev,
      [ruleKey]: { ...prev[ruleKey], multiplier: parseFloat(val) }
    }));
  };

  const savePricingRules = () => {
    setSaving(true);
    setTimeout(() => {
      addToast('success', 'Algorithms Synchronized', 'Global yield parameters are now live across all user discovery portals.');
      setSaving(false);
    }, 800);
  };

  // Simulate a live dashboard showing current effective prices for all turfs
  const simulatedTurfs = useMemo(() => {
    // Let's pretend it's a Weekend Peak Hour right now for demonstration
    let activeMultiplier = 1.0;
    let appliedRules = [];

    if (rules.weekendSurge.active) {
      activeMultiplier *= rules.weekendSurge.multiplier;
      appliedRules.push('Weekend');
    }
    if (rules.peakHourSurge.active) {
      activeMultiplier *= rules.peakHourSurge.multiplier;
      appliedRules.push('Peak Hour');
    }
    if (rules.weatherDiscount.active) {
      activeMultiplier *= rules.weatherDiscount.multiplier;
      appliedRules.push('Weather');
    }

    return turfs.map(t => ({
      ...t,
      basePrice: t.price || 1200,
      activeMultiplier,
      appliedRules,
      finalPrice: Math.round((t.price || 1200) * activeMultiplier)
    }));
  }, [turfs, rules]);

  return (
<div className="container animate-fade" style={{ paddingBottom: 80 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h1 style={{ fontWeight: 900, marginBottom: 8 }}>Price Scaling Engine</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="status-dot online" style={{ width: 8, height: 8, boxShadow: '0 0 10px var(--accent-green)' }} />
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>ALGO_SYNC: ACTIVE · Real-time demand scaling</span>
          </div>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={savePricingRules} 
          disabled={saving}
          style={{ minWidth: 200, height: 48, borderRadius: 14, display: 'flex', justifyContent: 'center', fontWeight: 800, letterSpacing: 0.5 }}
        >
          {saving ? 'SYNCHRONIZING...' : <><Save size={18} strokeWidth={2.5} /> DEPLOY ALGORITHMS</>}
        </button>
      </div>

      <div className="grid grid-mobile-1" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24, marginBottom: 32 }}>
        {/* SURGE RULES */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--accent-orange)' }}>
            <TrendingUp size={22} strokeWidth={2.5} /> Yield Boosters
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Weekend Surge */}
            <div style={{ padding: 20, background: 'var(--bg-secondary)', borderRadius: 16, border: rules.weekendSurge.active ? '1px solid var(--accent-orange)' : '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>Weekend Scale</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Fri-Sun high density scaling</div>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={rules.weekendSurge.active} onChange={() => toggleRule('weekendSurge')} />
                  <span className="slider"></span>
                </label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)' }}>MULTIPLIER</div>
                <input 
                  type="number" step="0.05" min="1.0" max="2.0"
                  value={rules.weekendSurge.multiplier} 
                  onChange={e => updateMultiplier('weekendSurge', e.target.value)}
                  disabled={!rules.weekendSurge.active}
                  className="form-input" style={{ width: 80, padding: '8px 12px', textAlign: 'center', fontWeight: 900, fontSize: 14 }} 
                />
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent-orange)' }}>+{Math.round((rules.weekendSurge.multiplier - 1) * 100)}% BOOST</span>
              </div>
            </div>

            {/* Peak Hour Surge */}
            <div style={{ padding: 20, background: 'var(--bg-secondary)', borderRadius: 16, border: rules.peakHourSurge.active ? '1px solid var(--accent-orange)' : '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>Prime Time (18:00-22:00)</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Active window surge modifier</div>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={rules.peakHourSurge.active} onChange={() => toggleRule('peakHourSurge')} />
                  <span className="slider"></span>
                </label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)' }}>MULTIPLIER</div>
                <input 
                  type="number" step="0.05" min="1.0" max="2.0"
                  value={rules.peakHourSurge.multiplier} 
                  onChange={e => updateMultiplier('peakHourSurge', e.target.value)}
                  disabled={!rules.peakHourSurge.active}
                  className="form-input" style={{ width: 80, padding: '8px 12px', textAlign: 'center', fontWeight: 900, fontSize: 14 }} 
                />
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent-orange)' }}>+{Math.round((rules.peakHourSurge.multiplier - 1) * 100)}% BOOST</span>
              </div>
            </div>
          </div>
        </div>

        {/* DISCOUNT RULES */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--accent-blue)' }}>
            <Percent size={22} strokeWidth={2.5} /> Efficiency Modifiers
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Weather Discount */}
            <div style={{ padding: 20, background: 'var(--bg-secondary)', borderRadius: 16, border: rules.weatherDiscount.active ? '1px solid var(--accent-blue)' : '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>Climate Shield</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Inclement weather occupancy guard</div>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={rules.weatherDiscount.active} onChange={() => toggleRule('weatherDiscount')} />
                  <span className="slider"></span>
                </label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)' }}>MULTIPLIER</div>
                <input 
                  type="number" step="0.05" min="0.5" max="1.0"
                  value={rules.weatherDiscount.multiplier} 
                  onChange={e => updateMultiplier('weatherDiscount', e.target.value)}
                  disabled={!rules.weatherDiscount.active}
                  className="form-input" style={{ width: 80, padding: '8px 12px', textAlign: 'center', fontWeight: 900, fontSize: 14 }} 
                />
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent-blue)' }}>-{Math.round((1 - rules.weatherDiscount.multiplier) * 100)}% OFF-LOAD</span>
              </div>
            </div>

            {/* Low Occupancy Drop */}
            <div style={{ padding: 20, background: 'var(--bg-secondary)', borderRadius: 16, border: rules.lowOccupancyDrop.active ? '1px solid var(--accent-blue)' : '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>Dead-Hour Fillers</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>10:00 - 14:00 demand incentive</div>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={rules.lowOccupancyDrop.active} onChange={() => toggleRule('lowOccupancyDrop')} />
                  <span className="slider"></span>
                </label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)' }}>MULTIPLIER</div>
                <input 
                  type="number" step="0.05" min="0.5" max="1.0"
                  value={rules.lowOccupancyDrop.multiplier} 
                  onChange={e => updateMultiplier('lowOccupancyDrop', e.target.value)}
                  disabled={!rules.lowOccupancyDrop.active}
                  className="form-input" style={{ width: 80, padding: '8px 12px', textAlign: 'center', fontWeight: 900, fontSize: 14 }} 
                />
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent-blue)' }}>-{Math.round((1 - rules.lowOccupancyDrop.multiplier) * 100)}% OFF-LOAD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Target size={22} strokeWidth={2.5} color="var(--accent-green)"/> Algorithmic Output Monitor
            </h3>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Live simulation of effective yield per asset</div>
          </div>
          <div className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', fontSize: 10, fontWeight: 900 }}>
             <div className="status-dot online" style={{ width: 6, height: 6 }}/> SIM_INTERVAL: SATURDAY_PEAK 20:00
          </div>
        </div>
        
        <div className="table-wrapper animate-fade" style={{ background: 'var(--bg-secondary)', borderRadius: 20, overflow: 'hidden' }}>
          <table style={{ margin: 0 }}>
            <thead style={{ background: 'rgba(255,255,255,0.02)' }}>
              <tr>
                <th style={{ padding: '16px 20px', fontSize: 11, fontWeight: 800 }}>ASSET_KEY</th>
                <th style={{ padding: '16px 20px', fontSize: 11, fontWeight: 800 }}>BASE_RATE</th>
                <th style={{ padding: '16px 20px', fontSize: 11, fontWeight: 800 }}>ACTIVE_TRIGGERS</th>
                <th style={{ padding: '16px 20px', fontSize: 11, fontWeight: 800 }}>EFFECTIVE_MULT</th>
                <th style={{ padding: '16px 20px', fontSize: 11, fontWeight: 800, textAlign: 'right' }}>LIVE_YIELD</th>
              </tr>
            </thead>
            <tbody>
              {simulatedTurfs.map(t => (
                <tr key={t.id} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Building2 size={16} strokeWidth={2.5} color="var(--accent-purple)"/>
                      <span style={{ fontSize: 13, fontWeight: 800 }}>{t.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>₹{t.basePrice}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {t.appliedRules.length > 0 ? t.appliedRules.map(r => (
                        <span key={r} className="badge" style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', fontSize: 9, fontWeight: 800, padding: '4px 10px', border: '1px solid var(--border)' }}>{r.toUpperCase()}</span>
                      )) : <span style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 700 }}>NOMINAL_STATE</span>}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', fontWeight: 900, color: t.activeMultiplier > 1 ? 'var(--accent-orange)' : t.activeMultiplier < 1 ? 'var(--accent-blue)' : 'var(--text-secondary)', fontSize: 14 }}>
                    {t.activeMultiplier.toFixed(2)}x
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right', fontSize: 18, fontWeight: 900, color: 'var(--accent-green)' }}>
                    ₹{t.finalPrice}
                  </td>
                </tr>
              ))}
              {simulatedTurfs.length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontWeight: 700 }}>NO ACTIVE ASSETS DETECTED</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
