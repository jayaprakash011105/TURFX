import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import {
  LayoutDashboard, Building2, Calendar, DollarSign, Star,
  ChevronLeft, ChevronRight, Bell, LogOut, Zap,
  Users, Settings, BarChart2, Clock, Package, MessageSquare, QrCode, ToggleLeft
} from 'lucide-react';

const ownerNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'myturfs', label: 'My Turfs', icon: Building2 },
  { id: 'slots', label: 'Slot Management', icon: Clock },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'earnings', label: 'Earnings', icon: DollarSign },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'promotions', label: 'Promotions', icon: Package },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function OwnerLayout({ children, activePage, setActivePage }) {
  const { currentUser, logout, notifications } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-primary)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar - Desktop Only */}
        <aside className="hide-mobile" style={{
          width: collapsed ? 72 : 250,
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column',
          transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
          zIndex: 50, flexShrink: 0,
        }}>
          {/* Logo */}
          <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #5b8def, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, fontWeight: 900, color: '#fff' }}>T</div>
            {!collapsed && <div><div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 18 }}>TURF<span style={{ color: '#5b8def' }}>X</span></div><div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 1 }}>OWNER PORTAL</div></div>}
          </div>

          <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
            {ownerNavItems.filter(i => !['notifications'].includes(i.id)).map(item => {
              const Icon = item.icon;
              const active = activePage === item.id;
              return (
                <button key={item.id} onClick={() => setActivePage(item.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    padding: collapsed ? '12px' : '10px 12px',
                    borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: active ? 'rgba(91,141,239,0.12)' : 'transparent',
                    color: active ? '#5b8def' : 'var(--text-secondary)',
                    fontWeight: active ? 700 : 500, fontSize: 13, marginBottom: 2,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    borderLeft: active ? '3px solid #5b8def' : '3px solid transparent',
                  }}>
                  <Icon size={17} />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          <div style={{ borderTop: '1px solid var(--border)', padding: '12px 8px' }}>
             <button onClick={() => setCollapsed(!collapsed)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 8, borderRadius: 8, border: 'none', background: 'transparent', color: 'var(--text-muted)' }}>
                {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span style={{ fontSize: 12 }}>Collapse</span></>}
             </button>
             <button onClick={logout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px', color: 'var(--accent-red)', border: 'none', background: 'transparent', fontWeight: 600 }}>
                <LogOut size={18} /> {!collapsed && 'Sign Out'}
             </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Header - Responsive */}
          <header style={{ height: 64, background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16, zIndex: 40, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
               {/* Brand on Mobile */}
               <div className="hide-desktop" style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #5b8def, #8b5cf6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16 }}>T</div>
               <div>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>{ownerNavItems.find(i => i.id === activePage)?.label}</div>
                  <div className="hide-mobile" style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Venue Manager</div>
               </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
               <button onClick={() => setActivePage('notifications')} style={{ position: 'relative', padding: 8, background: 'none', border: 'none', color: 'var(--text-secondary)' }}>
                  <Bell size={20} />
                  {unread > 0 && <span style={{ position: 'absolute', top: 4, right: 4, width: 14, height: 14, background: 'var(--accent-red)', borderRadius: '50%', fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900 }}>{unread}</span>}
               </button>
               <div onClick={() => setActivePage('settings')} style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #5b8def, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', cursor: 'pointer' }}>
                  {currentUser?.name?.[0]}
               </div>
            </div>
          </header>

          <main style={{ flex: 1, overflowY: 'auto', padding: '20px 0' }}>
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
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'myturfs', label: 'Turfs', icon: Building2 },
          { id: 'bookings', label: 'Agenda', icon: Calendar },
          { id: 'settings', label: 'Admin', icon: Settings },
        ].map(item => {
          const Icon = item.icon;
          const active = activePage === item.id;
          return (
            <button key={item.id} onClick={() => setActivePage(item.id)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                border: 'none', background: 'transparent',
                color: active ? '#5b8def' : 'var(--text-muted)',
                transition: 'all 0.2s',
              }}>
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{item.label}</span>
              {active && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#5b8def', marginTop: 1 }}></div>}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
