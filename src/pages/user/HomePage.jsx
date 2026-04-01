import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { SPORTS } from '../../data/mockData';
import { MapPin, Search, CalendarDays, Activity, ArrowRight, Star, ArrowUpRight } from 'lucide-react';

const SPORT_COLORS = {
  football: { bg: '#FDE5C3', text: '#CD7025' },
  badminton: { bg: '#F9D1D8', text: '#CB243C' },
  cricket: { bg: '#C4F6B2', text: '#3E8E25' },
  pickleball: { bg: '#E3AB83', text: '#A63F0B' },
  swimming: { bg: '#8DE0ED', text: '#1A677A' },
  tennis: { bg: '#45D1A2', text: '#0E6342' },
  basketball: { bg: '#E0D1F9', text: '#522EA7' },
  default: { bg: '#1F202B', text: '#fff' }
};

const MinimalTurfCard = ({ turf, onClick }) => {
  const [hover, setHover] = useState(false);
  return (
    <div 
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        flexShrink: 0, width: 340, cursor: 'pointer', group: 'true'
      }}
    >
      <div style={{ 
        height: 240, borderRadius: 24, overflow: 'hidden', position: 'relative', marginBottom: 16,
        background: '#13131A'
      }}>
        {turf.images && turf.images.length > 0 ? (
          <img 
            src={turf.images[0]} 
            alt={turf.name}
            style={{ 
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: hover ? 'scale(1.05)' : 'scale(1)'
            }} 
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>🏟️</div>
        )}
        
        {/* Hover Overlay */}
        <div style={{ 
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: hover ? 'rgba(0,0,0,0.2)' : 'transparent',
          transition: 'background 0.3s', pointerEvents: 'none'
        }} />

        <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 6 }}>
          <span style={{ background: '#fff', color: '#000', padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800, letterSpacing: 0.5 }}>
            ₹{turf.pricePerHour}/hr
          </span>
        </div>
        
        <div style={{ 
          position: 'absolute', bottom: 16, right: 16, width: 40, height: 40, borderRadius: '50%',
          background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hover ? 1 : 0, transform: hover ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <ArrowUpRight size={20} color="#000" strokeWidth={3} />
        </div>
      </div>
      
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: -0.5, margin: 0 }}>{turf.name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#fff', fontWeight: 700, fontSize: 14 }}>
            <Star size={14} fill="#fff" /> {turf.rating}
          </div>
        </div>
        <div style={{ color: '#9CA3AF', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
          <MapPin size={12} /> {turf.location}
        </div>
      </div>
    </div>
  );
};

export default function HomePage({ setActivePage, setSelectedTurf }) {
  const { turfs, userBookings, currentUser, userLocation } = useApp();
  const [searchFocused, setSearchFocused] = useState(false);
  
  const approvedTurfs = turfs.filter(t => t.status === 'approved');
  const featured = approvedTurfs.slice(0, 5);
  const upcoming = userBookings.filter(b => b.status === 'confirmed').slice(0, 1)[0];

  const handleTurfClick = (turf) => {
    setSelectedTurf(turf);
    setActivePage('turfdetail');
  };

  return (
    <div className="animate-fade" style={{ paddingBottom: 100 }}>
      
      {/* Imminent Operation Top Banner */}
      {upcoming && (
        <div style={{ background: '#10B981', color: '#000', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setActivePage('bookings')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 8, height: 8, background: '#000', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Next Match in 2 Hours</span>
            <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.8 }} className="hide-mobile">• {upcoming.turfName}</span>
          </div>
          <ArrowRight size={16} strokeWidth={3} />
        </div>
      )}

      {/* Hero Section Container */}
      <div style={{ padding: '0 24px', maxWidth: 1400, margin: '24px auto 0 auto' }}>
        
        {/* Massive Cinematic Hero Image */}
        <div style={{ 
          position: 'relative', height: window.innerWidth < 768 ? 400 : 500, width: '100%', 
          borderRadius: 32 , overflow: 'hidden', backgroundColor: '#111' 
        }}>
          <img 
            src="/images/hero-tennis3.jpg" 
            alt="Hero" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 75%', opacity: 0.7 }} 
          />
          
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, #000 0%, transparent 60%)' }} />

          <div style={{ position: 'absolute', bottom: window.innerWidth < 768 ? 40 : 80, left: window.innerWidth < 768 ? 24 : 64, zIndex: 10 }}>
            <h1 style={{ 
              fontSize: window.innerWidth < 768 ? 48 : 88, 
              fontWeight: 900, color: '#fff', letterSpacing: window.innerWidth < 768 ? -2 : -4, 
              lineHeight: 1, marginBottom: 16, maxWidth: 800 
            }}>
              ELEVATE YOUR <br />
              <span style={{ color: '#10B981' }}>GAME.</span>
            </h1>
            <p style={{ color: '#D1D5DB', fontSize: window.innerWidth < 768 ? 16 : 22, fontWeight: 500, maxWidth: 500, lineHeight: 1.4 }}>
              The most exclusive sports arenas in {userLocation}, ready for you.
            </p>
          </div>
        </div>

        {/* Overlapping Glass Search Bar */}
        <div style={{ 
          marginTop: window.innerWidth < 768 ? -24 : -48, 
          position: 'relative', zIndex: 20, 
          margin: window.innerWidth < 768 ? '-24px 12px 0 12px' : '-48px 64px 0 64px',
          background: 'rgba(20, 20, 25, 0.85)', backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24,
          padding: window.innerWidth < 768 ? '16px' : '8px',
          display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', gap: 16,
          alignItems: 'center', boxShadow: '0 24px 48px rgba(0,0,0,0.5)'
        }}>
          
          <div style={{ flex: 1, width: '100%', position: 'relative' }}>
            <Search size={20} color="#9CA3AF" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search by venue or location..."
              style={{ 
                width: '100%', height: 56, background: searchFocused ? '#1A1A24' : 'transparent', border: 'none',
                color: '#fff', fontSize: 16, fontWeight: 600, paddingLeft: 48, borderRadius: 16,
                transition: 'background 0.3s', outline: 'none'
              }}
            />
          </div>
          
          <div className="hide-mobile" style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.1)' }} />

          <div style={{ flex: 1, width: '100%', position: 'relative' }}>
            <CalendarDays size={20} color="#9CA3AF" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
            <div style={{ 
                width: '100%', height: 56, display: 'flex', alignItems: 'center',
                color: '#fff', fontSize: 16, fontWeight: 600, paddingLeft: 48, borderRadius: 16,
                cursor: 'pointer'
              }}>
              Today, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          </div>

          <button 
            onClick={() => setActivePage('turfs')}
            style={{ 
              background: '#fff', color: '#000', height: 50, padding: '0 40px', 
              borderRadius: 16, fontSize: 16, fontWeight: 800, border: 'none', cursor: 'pointer',
              width: window.innerWidth < 768 ? '100%' : 'auto', transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            SEARCH
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '80px auto 0 auto', padding: '0 24px' }}>
        
        {/* Minimal Categories */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
            <h2 style={{ fontSize: window.innerWidth < 768 ? 28 : 40, fontWeight: 900, color: '#fff', letterSpacing: -1, margin: 0 }}>The Disciplines.</h2>
          </div>
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            {SPORTS.map(s => {
              const theme = SPORT_COLORS[s.id] || SPORT_COLORS.default;
              return (
                <div 
                  key={s.id} 
                  onClick={() => setActivePage('turfs')}
                  style={{ 
                    flexShrink: 0, width: 160, height: 160, borderRadius: 32, background: theme.bg,
                    cursor: 'pointer', position: 'relative', overflow: 'hidden',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div style={{ fontSize: 64, marginBottom: 12 }}>{s.icon}</div>
                  <div style={{ color: theme.text, fontSize: 15, fontWeight: 800, letterSpacing: 0.5 }}>{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cinematic Horizontal Scroll: Featured Venues */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: window.innerWidth < 768 ? 28 : 40, fontWeight: 900, color: '#fff', letterSpacing: -1, margin: 0 }}>Featured Venues.</h2>
            <button 
              onClick={() => setActivePage('turfs')}
              style={{ background: 'transparent', border: 'none', color: '#10B981', fontWeight: 800, fontSize: 16, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
            >
              See All <ArrowRight size={20} />
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: 24, overflowX: 'auto', paddingBottom: 32, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            {featured.map(t => <MinimalTurfCard key={t.id} turf={t} onClick={() => handleTurfClick(t)} />)}
            
            <div 
              onClick={() => setActivePage('turfs')}
              style={{ 
                flexShrink: 0, width: 340, height: 240, borderRadius: 24, border: '2px dashed #2A2A35',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#9CA3AF'
              }}
            >
              <ArrowRight size={32} style={{ marginBottom: 16 }} />
              <span style={{ fontSize: 16, fontWeight: 700 }}>Explore {approvedTurfs.length} more venues</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
