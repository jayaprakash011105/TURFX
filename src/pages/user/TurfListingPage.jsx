import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { SPORTS } from '../../data/mockData';
import { MapPin, Star, Clock, ChevronDown, Search, ArrowDownUp, Tag, Crosshair, ArrowLeft, ArrowRight } from 'lucide-react';

const SPORT_THEMES = {
  football: { bg: '#FDE5C3', text: '#CD7025', img: '⚽' },
  badminton: { bg: '#F9D1D8', text: '#CB243C', img: '🏸' },
  cricket: { bg: '#C4F6B2', text: '#3E8E25', img: '🏏' },
  pickleball: { bg: '#E3AB83', text: '#A63F0B', img: '🏓' },
  swimming: { bg: '#8DE0ED', text: '#1A677A', img: '🏊' },
  squash: { bg: '#8CBAEC', text: '#1A4375', img: '🎾' },
  tennis: { bg: '#45D1A2', text: '#0E6342', img: '🎾' },
  padel: { bg: '#F6A8C7', text: '#A9245A', img: '🏸' },
  basketball: { bg: '#E0D1F9', text: '#522EA7', img: '🏀' },
  table_tennis: { bg: '#B9B5F4', text: '#3A33A8', img: '🏓' },
  default: { bg: '#90BCEB', text: '#224B7D', img: '🏃' }
};

const LOCATIONS = [
  'Mylapore', 'Velachery', 'Thoraipakkam', 'Sholinganallur',
  'Ramapuram', 'Porur', 'Nungambakkam', 'Nolambur'
];

export default function TurfListingPage({ setActivePage, setSelectedTurf }) {
  const { turfs, userLocation, setUserLocation, calculateEffectivePrice } = useApp();
  const [search, setSearch] = useState('');
  const [sport, setSport] = useState('');
  const [sortTab, setSortTab] = useState('Distance');
  const [showLocationModal, setShowLocationModal] = useState(false);

  const approved = turfs.filter(t => t.status === 'approved');
  const filtered = approved
    .filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.location.toLowerCase().includes(search.toLowerCase()))
    .filter(t => !sport || t.sportTypes?.includes(sport))
    .sort((a, b) => sortTab === 'Price' ? a.pricePerHour - b.pricePerHour : b.rating - a.rating);

  const handleSelect = (turf) => { setSelectedTurf(turf); setActivePage('turfdetail'); };

  return (
    <>
      <div className="animate-fade" style={{ paddingBottom: 80, minHeight: '100vh', padding: '0 24px', maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Top Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '32px 0 40px 0', flexWrap: 'wrap', gap: 20 }}>
          {/* Location Selector */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#9CA3AF', letterSpacing: 1, marginBottom: 4 }}>YOUR LOCATION</div>
            <div 
              style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', padding: '4px 0' }}
              onClick={() => setShowLocationModal(true)}
            >
              <MapPin size={20} color="#3B82F6" strokeWidth={2.5} />
              <span style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{userLocation}</span>
              <ChevronDown size={18} color="#fff" />
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative', width: window.innerWidth < 768 ? '100%' : 400 }}>
            <Search size={18} color="#6B7280" style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search for Venues" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ 
                width: '100%', height: 48, borderRadius: 24, paddingLeft: 48, paddingRight: 20,
                background: '#1F2023', border: 'none', color: '#fff', fontSize: 14, fontWeight: 500
              }} 
            />
          </div>
        </div>

        {/* Sports Carousel */}
        <div style={{ position: 'relative', marginBottom: 60 }}>
          <div style={{ display: 'flex', gap: 20, overflowX: 'auto', paddingBottom: 16, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            {SPORTS.map(s => {
              const theme = SPORT_THEMES[s.id] || SPORT_THEMES.default;
              const isSelected = sport === s.id;
              return (
                <div 
                  key={s.id} 
                  onClick={() => setSport(isSelected ? '' : s.id)}
                  style={{ 
                    flexShrink: 0, width: 140, height: 150, borderRadius: 16, background: theme.bg, 
                    cursor: 'pointer', position: 'relative', overflow: 'hidden',
                    border: isSelected ? `2px solid #fff` : '2px solid transparent',
                    transition: 'transform 0.2s', transform: isSelected ? 'scale(0.95)' : 'scale(1)'
                  }}
                >
                  <div style={{ textAlign: 'center', paddingTop: 16, color: theme.text, fontSize: 16, fontWeight: 800, position: 'relative', zIndex: 10 }}>
                    {s.label}
                  </div>
                  <div style={{ position: 'absolute', bottom: -10, left: 0, width: '100%', display: 'flex', justifyContent: 'center', fontSize: 90, opacity: 0.9 }}>
                    {theme.img}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ position: 'absolute', right: 0, top: 0, height: 150, width: 60, background: 'linear-gradient(to right, transparent, var(--bg-primary))', pointerEvents: 'none' }}></div>
        </div>

        {/* Sorting / Meta Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #2A2A2A', paddingBottom: 16, marginBottom: 32, flexWrap: 'wrap', gap: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#fff', margin: 0 }}>
            {filtered.length} Sports Venues In <span style={{ fontWeight: 700 }}>{userLocation}</span>
          </h2>
          <div style={{ display: 'flex', gap: 32 }}>
            {['Distance', 'Offers', 'Price'].map((tab) => (
              <div 
                key={tab} 
                onClick={() => setSortTab(tab)}
                style={{ 
                  color: sortTab === tab ? '#fff' : '#9CA3AF', 
                  fontSize: 14, fontWeight: 600, cursor: 'pointer', position: 'relative',
                  display: 'flex', alignItems: 'center', gap: 6
                }}
              >
                {tab === 'Offers' && <Tag size={14} />}
                {tab === 'Price' && <ArrowDownUp size={14} />}
                {tab}
                {sortTab === tab && (
                  <div style={{ position: 'absolute', bottom: -17, left: 0, width: '100%', height: 3, background: '#3B82F6', borderRadius: '3px 3px 0 0' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Turf Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {filtered.map(turf => (
            <div key={turf.id} onClick={() => handleSelect(turf)} style={{ cursor: 'pointer', background: 'transparent', borderRadius: 16, overflow: 'hidden', transition: 'transform 0.2s', border: '1px solid #2A2A2A' }}>
               <div style={{ height: 200, background: `linear-gradient(135deg, #111118, #0a0a0f)`, position: 'relative' }}>
                  {turf.images && turf.images.length > 0 ? (
                    <img src={turf.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={turf.name} />
                  ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>🏟️</div>
                  )}
               </div>
               
               <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                     <div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 6px 0', color: '#fff' }}>{turf.name}</h3>
                        <div style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 12 }}>{turf.location}</div>
                     </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                     <div style={{ display: 'flex', gap: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#fff', background: '#333', padding: '4px 10px', borderRadius: 6 }}>
                           ⭐ {turf.rating}
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF', background: '#222', padding: '4px 10px', borderRadius: 6 }}>
                           {turf.courts} Courts
                        </span>
                     </div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent-green)' }}>
                        ₹{calculateEffectivePrice(turf.pricePerHour)}<span style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>/hr</span>
                      </div>
                  </div>
               </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px 20px', color: '#6B7280' }}>
               <div style={{ fontSize: 64, marginBottom: 24 }}>🔍</div>
               <h3 style={{ fontWeight: 700, color: '#fff', fontSize: 20 }}>No Venues Found</h3>
               <p style={{ fontSize: 14 }}>Try adjusting your search or filters.</p>
            </div>
          )}
        </div>

      </div>

      {/* Location Selection Modal Overlay */}
      {showLocationModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', background: '#18181A', zIndex: 9999, padding: '40px 24px', overflowY: 'auto' }}>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40, cursor: 'pointer' }} onClick={() => setShowLocationModal(false)}>
               <ArrowLeft size={24} color="#D1D5DB" />
               <div style={{ fontSize: 20, fontWeight: 600, color: '#fff' }}>Set Location</div>
            </div>

            {/* Use Current Lcoation Button */}
            <div 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#2A2A32', padding: '20px', borderRadius: 12, cursor: 'pointer', marginBottom: 40 }}
              onClick={() => { setUserLocation('Current Location'); setShowLocationModal(false); }}
            >
               <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Crosshair strokeWidth={3} size={20} color="#10B981" />
                  <span style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>Use Current Location</span>
               </div>
               <ArrowRight size={20} color="#9CA3AF" />
            </div>

            {/* Popular Areas List */}
            <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', marginBottom: 20, letterSpacing: 0.5 }}>
              POPULAR AREAS IN CHENNAI
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
               {LOCATIONS.map((loc) => (
                 <div 
                   key={loc} 
                   onClick={() => { setUserLocation(loc); setShowLocationModal(false); }}
                   style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '8px 0', cursor: 'pointer' }}
                 >
                    <div style={{ width: 40, height: 40, background: '#222', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <MapPin size={16} color="#9CA3AF" />
                    </div>
                    <span style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{loc}</span>
                 </div>
               ))}
            </div>

            <div style={{ color: '#9CA3AF', fontSize: 14, fontWeight: 500, marginTop: 24, cursor: 'pointer' }}>
               See more
            </div>
            
            <div style={{ height: 1, background: '#2A2A2A', marginTop: 32 }}></div>
          </div>
        </div>
      )}
    </>
  );
}
