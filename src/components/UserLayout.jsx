import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../store/AppContext';
import {
  LayoutDashboard, MapPin, Calendar, History, User, Star,
  ChevronLeft, ChevronRight, Bell, Search, Filter, LogOut,
  Zap, Settings, CreditCard, HelpCircle, Menu, X
} from 'lucide-react';

const userNavItems = [
  { id: 'home', label: 'Home', icon: LayoutDashboard },
  { id: 'turfs', label: 'Discover', icon: MapPin },
  { id: 'bookings', label: 'My Bookings', icon: Calendar },
  { id: 'subscription', label: 'Subscription', icon: Zap },
  { id: 'profile', label: 'Profile', icon: User },
];

export default function UserLayout({ children, activePage, setActivePage }) {
  const { currentUser, logout, notifications } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrollRef = useRef(null);
  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [activePage]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-primary)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar - Desktop Only */}
        <aside className="hide-mobile" style={{
          width: collapsed ? 72 : 240,
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
          zIndex: 50,
        }}>
          {/* Logo */}
          <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#000' }}>T</div>
            {!collapsed && <div><div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 18 }}>TURF<span style={{ color: 'var(--accent-green)' }}>X</span></div><div style={{ fontSize: 10, color: 'var(--text-muted)' }}>PLAYER APP</div></div>}
          </div>

          <nav style={{ flex: 1, padding: '12px 8px' }}>
            {userNavItems.map(item => {
              const Icon = item.icon;
              const active = activePage === item.id;
              return (
                <button key={item.id} onClick={() => setActivePage(item.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                    borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: active ? 'var(--accent-green-glow)' : 'transparent',
                    color: active ? 'var(--accent-green)' : 'var(--text-secondary)',
                    fontWeight: active ? 700 : 500, fontSize: 14, marginBottom: 2,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    borderLeft: active ? '3px solid var(--accent-green)' : '3px solid transparent',
                  }}>
                  <Icon size={18} />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          <div style={{ borderTop: '1px solid var(--border)', padding: '12px 8px' }}>
             <button onClick={() => setCollapsed(!collapsed)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '8px', borderRadius: 8, border: 'none', background: 'transparent', color: 'var(--text-muted)' }}>
                {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span style={{ fontSize: 12 }}>Collapse</span></>}
             </button>
             <button onClick={logout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px', color: 'var(--accent-red)', border: 'none', background: 'transparent', fontWeight: 600 }}>
                <LogOut size={18} /> {!collapsed && 'Sign Out'}
             </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Top Bar - Responsive */}
          <header style={{ height: 64, background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16, zIndex: 40 }}>
            {/* Brand on Mobile */}
            <div className="hide-desktop" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
               <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-green)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16 }}>T</div>
               <div style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 18 }}>TURF<span style={{ color: 'var(--accent-green)' }}>X</span></div>
            </div>

            <div className="hide-mobile" style={{ flex: 1, position: 'relative', maxWidth: 400 }}>
               <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
               <input className="form-input" style={{ paddingLeft: 38, height: 38 }} placeholder="Search everything..." />
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
               <button onClick={() => setActivePage('notifications')} style={{ position: 'relative', padding: 8, background: 'none', border: 'none', color: 'var(--text-secondary)' }}>
                  <Bell size={20} />
                  {unread > 0 && <span style={{ position: 'absolute', top: 4, right: 4, width: 14, height: 14, background: 'var(--accent-red)', borderRadius: '50%', fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900 }}>{unread}</span>}
               </button>
               <div onClick={() => setActivePage('profile')} style={{ width: 34, height: 34, borderRadius: 12, background: 'linear-gradient(135deg, var(--accent-green), var(--accent-blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#000', cursor: 'pointer' }}>
                  {currentUser?.name?.[0]}
               </div>
            </div>
          </header>

          <main ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px 0' }}>
            {children}
          </main>
        </div>
      </div>

      {/* Bottom Nav - Mobile Only */}
      <nav className="hide-desktop" style={{ 
        height: 64, background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', 
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '0 8px', zIndex: 100 
      }}>
        {[
          { id: 'home', label: 'Home', icon: LayoutDashboard },
          { id: 'turfs', label: 'Explore', icon: MapPin },
          { id: 'bookings', label: 'Games', icon: Calendar },
          { id: 'profile', label: 'Me', icon: User },
        ].map(item => {
          const Icon = item.icon;
          const active = activePage === item.id;
          return (
            <button key={item.id} onClick={() => setActivePage(item.id)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                border: 'none', background: 'transparent',
                color: active ? 'var(--accent-green)' : 'var(--text-muted)',
                transition: 'all 0.2s',
              }}>
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{item.label}</span>
              {active && <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent-green)', marginTop: 2 }}></div>}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
